import { getPhoto } from '$lib/data/photo-storage';

/**
 * The temporary address of a photo in the database, for an image on a page.
 * A blob in the database has no address, so the browser makes one. The address is good only
 * while the component is open. The component gives it back, so that the browser can release
 * the memory.
 * Call it during component setup.
 * @param {() => string | null | undefined} id A function that reads the ID of the photo.
 * @returns {{ readonly current: string }} The address. Empty until the photo is read.
 */
export function photoAddress(id) {
	let current = $state('');

	$effect(() => {
		const photoId = id();
		if (!photoId) return;

		let made = '';
		let closed = false;
		getPhoto(photoId).then((photo) => {
			if (!photo || closed) return;
			made = URL.createObjectURL(photo.blob);
			current = made;
		});

		return () => {
			closed = true;
			current = '';
			if (made) URL.revokeObjectURL(made);
		};
	});

	return {
		get current() {
			return current;
		}
	};
}
