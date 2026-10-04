/** The longest side of a stored photo. A photo that is 300 wide on the screen needs 600. */
const MAX_SIDE = 600;
const QUALITY = 0.8;

/**
 * Makes a camera photo small: reads the file, draws it on a small canvas, and packs the canvas
 * as a JPEG. A file of some megabytes becomes a blob of about 60 KB. Works with no connection.
 * @param {Blob} file The file from the camera.
 * @returns {Promise<Blob>}
 */
export async function shrinkPhoto(file) {
	const image = await createImageBitmap(file);
	const scale = Math.min(1, MAX_SIDE / Math.max(image.width, image.height));

	const canvas = document.createElement('canvas');
	canvas.width = Math.round(image.width * scale);
	canvas.height = Math.round(image.height * scale);

	const context = canvas.getContext('2d');
	if (!context) throw new Error('This browser cannot draw the photo.');
	context.imageSmoothingQuality = 'high';
	context.drawImage(image, 0, 0, canvas.width, canvas.height);
	image.close();

	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => (blob ? resolve(blob) : reject(new Error('This browser cannot pack the photo.'))),
			'image/jpeg',
			QUALITY
		);
	});
}
