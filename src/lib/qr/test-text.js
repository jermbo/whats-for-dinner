import { QR_LETTERS } from './letters';
import { QR_SIZES } from './sizes';

// The text of the code test. One device shows it, and the other device reads it and makes
// the same text again. If the two are equal, the camera read each square correctly.

/** @typedef {keyof typeof QR_SIZES} SizeName */

const MARK = 'MPTEST';

/**
 * A text that fills a code of this size. The letters have no pattern, as compressed data has
 * none, so the code is as hard to read as a real one.
 * @param {SizeName} name
 * @returns {string}
 */
export function testText(name) {
	const start = `${MARK}/${name.toUpperCase()}/`;
	let seed = QR_SIZES[name].version;
	const letters = Array.from({ length: QR_SIZES[name].letters - start.length }, () => {
		seed = (seed * 1103515245 + 12345) % 2147483648;
		return QR_LETTERS[Math.floor((seed / 2147483648) * QR_LETTERS.length)];
	});
	return start + letters.join('');
}

/**
 * @param {string} text The text that the camera read.
 * @returns {{ name: SizeName, correct: boolean } | null} Null: the code is not from the code test.
 */
export function readTestText(text) {
	const [mark, size] = text.split('/');
	const name = /** @type {SizeName} */ (size?.toLowerCase());
	if (mark !== MARK || !Object.hasOwn(QR_SIZES, name)) return null;
	return { name, correct: text === testText(name) };
}
