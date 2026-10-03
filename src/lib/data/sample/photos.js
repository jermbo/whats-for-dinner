import { PHOTO_LABELS, photoId } from './shopping';

/** @typedef {import('$lib/types').Photo} Photo */

const SIZE = 300;

/**
 * A drawing in the place of a camera photo: a package with the name of the product on it.
 * Each product gets a different color.
 * @param {string} name
 * @param {number} hue
 * @returns {Promise<Blob>}
 */
function drawPhoto(name, hue) {
	const canvas = document.createElement('canvas');
	canvas.width = SIZE;
	canvas.height = SIZE;
	const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));

	context.fillStyle = `hsl(${hue} 45% 88%)`;
	context.fillRect(0, 0, SIZE, SIZE);
	context.fillStyle = `hsl(${hue} 55% 38%)`;
	context.beginPath();
	context.roundRect(60, 30, 180, 240, 20);
	context.fill();

	context.fillStyle = '#ffffff';
	context.font = '600 26px system-ui, sans-serif';
	context.textAlign = 'center';
	name
		.split(/[ ,]+/)
		.slice(0, 4)
		.forEach((word, line) => context.fillText(word, SIZE / 2, 95 + line * 38, 160));

	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => (blob ? resolve(blob) : reject(new Error('This browser cannot draw the photo.'))),
			'image/jpeg',
			0.8
		);
	});
}

/**
 * The photos of the sample products. The browser draws them, so they need no connection.
 * @returns {Promise<Photo[]>}
 */
export function samplePhotos() {
	return Promise.all(
		PHOTO_LABELS.map(async ({ key, name }, index) => ({
			id: photoId(key),
			blob: await drawPhoto(name, (index * 47 + 10) % 360)
		}))
	);
}
