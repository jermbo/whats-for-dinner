import { cookPhotoList } from './cook-photos';
import { PHOTO_LABELS, photoId } from './shopping';

/** @typedef {import('$lib/types').Photo} Photo */

const SIZE = 300;
/** A photo of a step or of a finished meal has the size of a real photo: 600 on its longest side. */
const WIDE = 600;
const HIGH = 450;

/**
 * The canvas as a small JPEG, as a camera photo after the app made it small.
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<Blob>}
 */
function pack(canvas) {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => (blob ? resolve(blob) : reject(new Error('This browser cannot draw the photo.'))),
			'image/jpeg',
			0.8
		);
	});
}

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

	return pack(canvas);
}

/**
 * @param {CanvasRenderingContext2D} context
 * @param {number} x
 * @param {number} y
 * @param {number} radius
 * @param {string} color
 */
function disc(context, x, y, radius, color) {
	context.fillStyle = color;
	context.beginPath();
	context.arc(x, y, radius, 0, 2 * Math.PI);
	context.fill();
}

/**
 * A drawing in the place of a photo that the owner takes while cooking. A step photo shows
 * a pan from above. A finished photo shows a plate. The words on the drawing tell which
 * photo it is, so that a test can see which photo a screen shows.
 * @param {'step' | 'finished'} scene
 * @param {string[]} lines
 * @param {number} hue
 * @returns {Promise<Blob>}
 */
function drawScene(scene, lines, hue) {
	const canvas = document.createElement('canvas');
	canvas.width = WIDE;
	canvas.height = HIGH;
	const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
	const food = `hsl(${hue} 60% 48%)`;
	const garnish = `hsl(${(hue + 90) % 360} 55% 42%)`;

	// The table.
	context.fillStyle = `hsl(${hue} 35% 86%)`;
	context.fillRect(0, 0, WIDE, HIGH);

	if (scene === 'step') {
		// A pan with its handle to the right.
		context.fillStyle = '#2c2c2e';
		context.beginPath();
		context.roundRect(420, 165, 180, 44, 22);
		context.fill();
		disc(context, 270, 187, 172, '#2c2c2e');
		disc(context, 270, 187, 150, '#48484a');
		disc(context, 270, 187, 128, food);
	} else {
		// A plate with a rim.
		disc(context, 300, 187, 176, '#ffffff');
		disc(context, 300, 187, 140, '#f0f0f2');
		disc(context, 300, 187, 112, food);
	}

	// Some pieces on the food.
	const center = scene === 'step' ? 270 : 300;
	for (const [x, y, radius] of [
		[-48, -30, 26],
		[40, -44, 20],
		[52, 28, 30],
		[-30, 46, 22],
		[4, 0, 16]
	]) {
		disc(context, center + x, 187 + y, radius, garnish);
	}

	// The words, on a dark band at the lower edge.
	context.fillStyle = 'rgb(0 0 0 / 0.62)';
	context.fillRect(0, HIGH - 96, WIDE, 96);
	context.fillStyle = '#ffffff';
	context.textAlign = 'center';
	context.font = '600 30px system-ui, sans-serif';
	context.fillText(lines[0] ?? '', WIDE / 2, HIGH - 56, WIDE - 40);
	context.font = '500 24px system-ui, sans-serif';
	context.fillText(lines[1] ?? '', WIDE / 2, HIGH - 22, WIDE - 40);

	return pack(canvas);
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

/**
 * The step photos and the finished photos of the sample recipes. Each photo has the time
 * when the owner took it: the app uses the times to find the oldest photo of a step.
 * @param {Map<string, string>} names The name of each recipe, by its key.
 * @returns {Promise<Photo[]>}
 */
export function sampleCookPhotos(names) {
	return Promise.all(
		cookPhotoList(names).map(async ({ id, takenAt, scene, lines }, index) => ({
			id,
			takenAt,
			blob: await drawScene(scene, lines, (index * 53 + 20) % 360)
		}))
	);
}
