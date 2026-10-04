import { correction, divisor } from './reed-solomon';

/** @typedef {import('./sizes').QrSize} QrSize */

/**
 * The count of data bytes of a code: all bytes, minus the error correction.
 * @param {QrSize} size
 */
export const dataLength = (size) => size.codewords - size.blocks * size.ecLength;

/**
 * Divides the data into blocks, gives each block its error correction, and puts the bytes in
 * the sequence of the code: byte 1 of each block, then byte 2 of each block, and so on. Thus
 * damage in one area of the code is a small damage in many blocks.
 * @param {number[]} data The result of "dataBytes".
 * @param {QrSize} size
 * @returns {number[]} All bytes of the code.
 */
export function withCorrection(data, size) {
	const { blocks, codewords, ecLength } = size;
	// The first blocks are short. The last blocks have one byte more.
	const long = codewords % blocks;
	const shortLength = Math.floor(codewords / blocks) - ecLength;
	const by = divisor(ecLength);

	/** @type {{ data: number[], ec: number[] }[]} */
	const parts = [];
	for (let i = 0, at = 0; i < blocks; i++) {
		const length = shortLength + (i < blocks - long ? 0 : 1);
		const block = data.slice(at, at + length);
		parts.push({ data: block, ec: correction(block, by) });
		at += length;
	}

	/** @type {number[]} */
	const result = [];
	for (let i = 0; i <= shortLength; i++) {
		for (const part of parts) if (i < part.data.length) result.push(part.data[i]);
	}
	for (let i = 0; i < ecLength; i++) {
		for (const part of parts) result.push(part.ec[i]);
	}
	return result;
}
