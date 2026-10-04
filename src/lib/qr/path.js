/**
 * The dark squares of a code as one SVG path. Each run of dark squares in a row is one
 * rectangle, so the path stays short.
 * @param {{ side: number, dark: Uint8Array }} code The result of "qrCode".
 * @param {number} border The light border around the code, in squares.
 * @returns {string}
 */
export function qrPath({ side, dark }, border) {
	let path = '';
	for (let y = 0; y < side; y++) {
		for (let x = 0; x < side; x++) {
			if (!dark[y * side + x]) continue;
			const start = x;
			while (x + 1 < side && dark[y * side + x + 1]) x++;
			path += `M${start + border} ${y + border}h${x - start + 1}v1H${start + border}z`;
		}
	}
	return path;
}
