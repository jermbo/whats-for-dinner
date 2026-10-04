// The sizes of QR code that the app can make. Each size is one version of the QR standard
// (ISO 18004), with error correction level L: a camera can read a code that has 7% damage.

/**
 * @typedef {object} QrSize
 * @property {number} version The version of the standard. A code has 17 + 4 × version squares on each side.
 * @property {number} codewords The bytes of the code: the data and the error correction.
 * @property {number} blocks The data is divided into this many blocks, each with its own error correction.
 * @property {number} ecLength The error correction bytes of one block.
 * @property {number[]} align The centers of the alignment patterns, on each axis.
 * @property {number} letters The longest text of the code.
 */

/** @satisfies {Record<string, QrSize>} */
export const QR_SIZES = {
	small: {
		version: 15,
		codewords: 655,
		blocks: 6,
		ecLength: 22,
		align: [6, 26, 48, 70],
		letters: 758
	},
	medium: {
		version: 20,
		codewords: 1085,
		blocks: 8,
		ecLength: 28,
		align: [6, 34, 62, 90],
		letters: 1249
	},
	large: {
		version: 25,
		codewords: 1588,
		blocks: 12,
		ecLength: 26,
		align: [6, 32, 58, 84, 110],
		letters: 1853
	}
};

/**
 * The squares on each side of a code.
 * @param {QrSize} size
 */
export const sideOf = (size) => 17 + 4 * size.version;
