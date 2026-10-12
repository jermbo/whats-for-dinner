// A photo from a phone is some megabytes. The plugin draws it on a small canvas, and that makes it
// small before it goes into the vault.

const MAX_SIDE = 1600;

export async function shrinkPhoto(photo: Blob): Promise<ArrayBuffer> {
	const image = await createImageBitmap(photo);
	const scale = Math.min(1, MAX_SIDE / Math.max(image.width, image.height));

	const canvas = document.createElement('canvas');
	canvas.width = Math.round(image.width * scale);
	canvas.height = Math.round(image.height * scale);
	canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
	image.close();

	const small = await new Promise<Blob | null>((resolve) =>
		canvas.toBlob(resolve, 'image/jpeg', 0.8)
	);
	return (small ?? photo).arrayBuffer();
}
