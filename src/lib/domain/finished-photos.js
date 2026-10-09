/**
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {import('$lib/types').CookSession} CookSession
 * @typedef {{ photoId: string, at: string }} FinishedPhoto
 *   "at" is the time of the cook. It is empty for a cover that came with a recipe file.
 */

/**
 * The finished photos of a recipe, newest first: one for each cook session that has one.
 * A cover that came with a recipe file has no cook session on this device. It is the last.
 * @param {Recipe} recipe
 * @param {CookSession[]} sessions The cook sessions of the recipe.
 * @returns {FinishedPhoto[]}
 */
export function finishedPhotos(recipe, sessions) {
	/** @type {FinishedPhoto[]} */
	const photos = sessions
		.flatMap((session) =>
			session.photoId
				? [{ photoId: session.photoId, at: session.cookedAt || session.startedAt || '' }]
				: []
		)
		.sort((a, b) => b.at.localeCompare(a.at));

	const cover = recipe.coverPhotoId;
	if (cover && !photos.some((photo) => photo.photoId === cover)) {
		photos.push({ photoId: cover, at: '' });
	}
	return photos;
}
