// A photo from a phone is 2 to 15 MB, and Obsidian Sync takes 5 MB or less on the Standard plan.
// The plugin draws it again on a canvas of 1600 pixels or less. At the quality 100% you see no loss,
// and the photo is about 1 MB. The GPS location of the photo does not stay.

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
		canvas.toBlob(resolve, 'image/jpeg', 1)
	);
	return (small ?? photo).arrayBuffer();
}
