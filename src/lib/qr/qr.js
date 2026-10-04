import { dataLength, withCorrection } from './blocks';
import { patterns, writeData } from './grid';
import { dataBytes } from './letters';
import { applyBestMask } from './mask';

/**
 * Makes a QR code. The app has its own code for this, so that it needs no package.
 * @param {string} text Only the 45 letters of QR_LETTERS, and not more than "size.letters".
 * @param {import('./sizes').QrSize} size
 * @returns {{ side: number, dark: Uint8Array }} The squares, row by row. 1 is a dark square.
 */
export function qrCode(text, size) {
	const bytes = withCorrection(dataBytes(text, dataLength(size)), size);
	const grid = patterns(size);
	writeData(grid, bytes);
	applyBestMask(grid);
	return { side: grid.side, dark: grid.dark };
}
