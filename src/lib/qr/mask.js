import { writeFormat } from './grid';

/** @typedef {import('./grid').QrGrid} QrGrid */

// Text can make large areas of one color, or shapes that look like a finder pattern. A camera
// reads such a code badly. So the standard has eight masks. A mask inverts some data squares
// by a rule, and the code tells which mask it used.

/** For each mask: is the square at column x and row y inverted? */
const MASKS = [
	(/** @type {number} */ x, /** @type {number} */ y) => (x + y) % 2 === 0,
	(/** @type {number} */ x, /** @type {number} */ y) => y % 2 === 0,
	(/** @type {number} */ x) => x % 3 === 0,
	(/** @type {number} */ x, /** @type {number} */ y) => (x + y) % 3 === 0,
	(/** @type {number} */ x, /** @type {number} */ y) =>
		(Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
	(/** @type {number} */ x, /** @type {number} */ y) => ((x * y) % 2) + ((x * y) % 3) === 0,
	(/** @type {number} */ x, /** @type {number} */ y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
	(/** @type {number} */ x, /** @type {number} */ y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0
];

/** Error correction level L, as the two bits of the format. */
const LEVEL_L = 0b01;

/**
 * Applies a mask to the data squares. A second call with the same mask removes it.
 * @param {QrGrid} grid
 * @param {number} mask 0 to 7.
 */
function invert(grid, mask) {
	const { side, dark, fixed } = grid;
	for (let y = 0; y < side; y++) {
		for (let x = 0; x < side; x++) {
			if (!fixed[y * side + x] && MASKS[mask](x, y)) dark[y * side + x] ^= 1;
		}
	}
}

/**
 * The 15 format bits: the level and the mask, with their own error correction.
 * @param {number} mask
 */
function formatBits(mask) {
	const data = (LEVEL_L << 3) | mask;
	let rest = data;
	for (let i = 0; i < 10; i++) rest = (rest << 1) ^ ((rest >>> 9) * 0x537);
	return ((data << 10) | rest) ^ 0x5412;
}

/** The start or the end of a finder pattern with light squares next to it, in one line. */
const FINDER_LIKE = ['10111010000', '00001011101'];

/**
 * The score of one row or one column. A low score is a line that a camera reads well.
 * @param {number[]} line
 */
function lineScore(line) {
	let score = 0;

	// Five or more squares of one color in a row.
	for (let i = 0, run = 1; i < line.length; i++, run++) {
		if (line[i] === line[i + 1]) continue;
		if (run >= 5) score += run - 2;
		run = 0;
	}

	const text = line.join('');
	for (const shape of FINDER_LIKE) {
		for (let at = text.indexOf(shape); at !== -1; at = text.indexOf(shape, at + 1)) score += 40;
	}
	return score;
}

/**
 * The score of a full code, by the four rules of the standard.
 * @param {QrGrid} grid
 */
function score(grid) {
	const { side, dark } = grid;
	const at = (/** @type {number} */ x, /** @type {number} */ y) => dark[y * side + x];
	const index = Array.from({ length: side }, (_, i) => i);
	let total = 0;

	for (const i of index) {
		total += lineScore(index.map((x) => at(x, i)));
		total += lineScore(index.map((y) => at(i, y)));
	}

	// A block of two by two squares of one color.
	for (let y = 0; y < side - 1; y++) {
		for (let x = 0; x < side - 1; x++) {
			const color = at(x, y);
			if (color === at(x + 1, y) && color === at(x, y + 1) && color === at(x + 1, y + 1))
				total += 3;
		}
	}

	// The dark part of the code must be near 50%.
	const percent = (dark.reduce((sum, square) => sum + square, 0) * 100) / dark.length;
	return total + Math.floor(Math.abs(percent - 50) / 5) * 10;
}

/**
 * Tries each mask and keeps the one with the lowest score. It also writes the format bits.
 * @param {QrGrid} grid A grid with its patterns and its data.
 */
export function applyBestMask(grid) {
	let best = 0;
	let lowest = Infinity;

	for (let mask = 0; mask < MASKS.length; mask++) {
		invert(grid, mask);
		writeFormat(grid, formatBits(mask));
		const result = score(grid);
		if (result < lowest) [best, lowest] = [mask, result];
		invert(grid, mask);
	}

	invert(grid, best);
	writeFormat(grid, formatBits(best));
}
