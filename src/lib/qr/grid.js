import { sideOf } from './sizes';

/** @typedef {import('./sizes').QrSize} QrSize */

/**
 * The squares of a code. "dark" has 1 for a dark square. "fixed" has 1 for a square of a
 * pattern that the standard sets: the data and the mask do not change it.
 * @typedef {{ side: number, dark: Uint8Array, fixed: Uint8Array }} QrGrid
 */

/**
 * @param {number} value
 * @param {number} i
 * @returns {boolean} Bit i of the value. Bit 0 is the lowest.
 */
export const bit = (value, i) => ((value >>> i) & 1) === 1;

/**
 * Sets one square of a pattern.
 * @param {QrGrid} grid
 * @param {number} x The column.
 * @param {number} y The row.
 * @param {boolean} dark
 */
function setFixed(grid, x, y, dark) {
	if (x < 0 || y < 0 || x >= grid.side || y >= grid.side) return;
	grid.dark[y * grid.side + x] = dark ? 1 : 0;
	grid.fixed[y * grid.side + x] = 1;
}

/**
 * A finder pattern: the large square in three corners. It has a light border around it.
 * @param {QrGrid} grid
 * @param {number} cx The center.
 * @param {number} cy
 */
function finder(grid, cx, cy) {
	for (let dy = -4; dy <= 4; dy++) {
		for (let dx = -4; dx <= 4; dx++) {
			const ring = Math.max(Math.abs(dx), Math.abs(dy));
			setFixed(grid, cx + dx, cy + dy, ring !== 2 && ring !== 4);
		}
	}
}

/**
 * An alignment pattern: a small square that shows a camera how the code bends.
 * @param {QrGrid} grid
 * @param {number} cx The center.
 * @param {number} cy
 */
function alignment(grid, cx, cy) {
	for (let dy = -2; dy <= 2; dy++) {
		for (let dx = -2; dx <= 2; dx++) {
			setFixed(grid, cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
		}
	}
}

/**
 * The version number, 18 bits with their own error correction, at two places.
 * @param {QrGrid} grid
 * @param {number} version
 */
function versionInfo(grid, version) {
	let rest = version;
	for (let i = 0; i < 12; i++) rest = (rest << 1) ^ ((rest >>> 11) * 0x1f25);
	const bits = (version << 12) | rest;

	for (let i = 0; i < 18; i++) {
		const a = grid.side - 11 + (i % 3);
		const b = Math.floor(i / 3);
		setFixed(grid, a, b, bit(bits, i));
		setFixed(grid, b, a, bit(bits, i));
	}
}

/**
 * A grid with all patterns of the standard, and no data.
 * @param {QrSize} size
 * @returns {QrGrid}
 */
export function patterns(size) {
	const side = sideOf(size);
	/** @type {QrGrid} */
	const grid = { side, dark: new Uint8Array(side * side), fixed: new Uint8Array(side * side) };

	// The timing patterns: one row and one column of squares that are dark and light in turn.
	for (let i = 0; i < side; i++) {
		setFixed(grid, 6, i, i % 2 === 0);
		setFixed(grid, i, 6, i % 2 === 0);
	}

	finder(grid, 3, 3);
	finder(grid, side - 4, 3);
	finder(grid, 3, side - 4);

	// An alignment pattern is at each crossing of the centers, but not on a finder pattern.
	const last = size.align.length - 1;
	size.align.forEach((cy, row) => {
		size.align.forEach((cx, column) => {
			const onFinder =
				(row === 0 && column === 0) ||
				(row === 0 && column === last) ||
				(row === last && column === 0);
			if (!onFinder) alignment(grid, cx, cy);
		});
	});

	versionInfo(grid, size.version);
	// The room for the format bits. "writeFormat" sets them when the mask is known.
	writeFormat(grid, 0);
	return grid;
}

/**
 * Puts the 15 format bits at their two places next to the finder patterns.
 * @param {QrGrid} grid
 * @param {number} bits
 */
export function writeFormat(grid, bits) {
	const { side } = grid;

	for (let i = 0; i <= 5; i++) setFixed(grid, 8, i, bit(bits, i));
	setFixed(grid, 8, 7, bit(bits, 6));
	setFixed(grid, 8, 8, bit(bits, 7));
	setFixed(grid, 7, 8, bit(bits, 8));
	for (let i = 9; i < 15; i++) setFixed(grid, 14 - i, 8, bit(bits, i));

	for (let i = 0; i < 8; i++) setFixed(grid, side - 1 - i, 8, bit(bits, i));
	for (let i = 8; i < 15; i++) setFixed(grid, 8, side - 15 + i, bit(bits, i));
	// One square that is dark in each code.
	setFixed(grid, 8, side - 8, true);
}

/**
 * Puts the bytes of the code into the squares that no pattern uses. The path goes up and down
 * in columns of two squares, from the right edge to the left edge.
 * @param {QrGrid} grid
 * @param {number[]} bytes The result of "withCorrection".
 */
export function writeData(grid, bytes) {
	const { side } = grid;
	let i = 0;

	for (let right = side - 1; right >= 1; right -= 2) {
		// The column of the timing pattern is not a part of the path.
		if (right === 6) right = 5;
		const up = ((right + 1) & 2) === 0;

		for (let step = 0; step < side; step++) {
			const y = up ? side - 1 - step : step;
			for (const x of [right, right - 1]) {
				const at = y * side + x;
				if (grid.fixed[at] || i >= bytes.length * 8) continue;
				grid.dark[at] = bit(bytes[i >>> 3], 7 - (i & 7)) ? 1 : 0;
				i++;
			}
		}
	}
}
