/** A step keeps this many photos. More would make a recipe heavy to store and to send. */
export const STEP_PHOTO_LIMIT = 3;

/**
 * The photos that a step keeps. When there are too many, the oldest photo that is not
 * selected goes first. The selected photo never goes.
 * @param {string[]} photoIds Oldest first.
 * @param {string | null} selectedPhotoId
 * @returns {{ kept: string[], dropped: string[] }}
 */
export function limitStepPhotos(photoIds, selectedPhotoId) {
	const kept = [...photoIds];
	/** @type {string[]} */
	const dropped = [];
	while (kept.length > STEP_PHOTO_LIMIT) {
		const index = kept.findIndex((id) => id !== selectedPhotoId);
		dropped.push(...kept.splice(index, 1));
	}
	return { kept, dropped };
}
