// The text of a code, as bytes. The app uses the "alphanumeric" mode of the QR standard: 45
// letters, and two letters use 11 bits. This mode holds more text than the byte mode.

/** The 45 letters that a code can have. Their sequence is a part of the standard. */
export const QR_LETTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';

const MODE_LETTERS = 0b0010;
// Versions 10 to 26 write the count of the letters in 11 bits. All sizes of the app are there.
const COUNT_BITS = 11;
/** The standard fills the room that the text does not use with these two bytes, in turn. */
const PAD = [0xec, 0x11];

/**
 * @param {string} text Only letters of QR_LETTERS.
 * @param {number} length The count of data bytes of the code.
 * @returns {number[]} The data bytes: the mode, the count, the letters, and the fill.
 */
export function dataBytes(text, length) {
	/** @type {number[]} */
	const bits = [];
	/** @param {number} value @param {number} count */
	const put = (value, count) => {
		for (let i = count - 1; i >= 0; i--) bits.push((value >>> i) & 1);
	};

	const values = Array.from(text, (letter) => QR_LETTERS.indexOf(letter));
	if (values.includes(-1)) throw new Error('The text has a letter that a code cannot have.');

	put(MODE_LETTERS, 4);
	put(values.length, COUNT_BITS);
	for (let i = 0; i + 1 < values.length; i += 2) put(values[i] * 45 + values[i + 1], 11);
	if (values.length % 2) put(values[values.length - 1], 6);

	const room = length * 8;
	if (bits.length > room) throw new Error('The text is too long for this code.');

	// The end mark is four zero bits, or less when the room ends. Then zero bits fill the byte.
	put(0, Math.min(4, room - bits.length));
	put(0, (8 - (bits.length % 8)) % 8);
	for (let i = 0; bits.length < room; i++) put(PAD[i % 2], 8);

	return Array.from({ length }, (_, byte) =>
		bits.slice(byte * 8, byte * 8 + 8).reduce((value, bit) => (value << 1) | bit, 0)
	);
}
