import { db } from '$lib/db/db';
import { finishedPhotos } from '$lib/domain/finished-photos';
import { now } from '$lib/util/ids';
import { savePhoto } from './photo-storage';

/** @typedef {import('$lib/types').CookSession} CookSession */

/**
 * Sets the photo of the finished meal of one cook session. The first finished photo of a
 * recipe becomes its cover. A later photo never changes the cover: the owner selects it.
 * A second photo for the same session replaces the first one.
 * @param {string} sessionId
 * @param {Blob} blob The small photo.
 */
export function setFinishedPhoto(sessionId, blob) {
	return db.transaction('rw', db.sessions, db.recipes, db.photos, async () => {
		const session = await db.sessions.get(sessionId);
		if (!session) throw new Error('This cook session is not on this device.');

		const photoId = await savePhoto(blob);
		const recipe = await db.recipes.get(session.recipeId);
		if (recipe && (!recipe.coverPhotoId || recipe.coverPhotoId === session.photoId)) {
			await db.recipes.update(recipe.id, { coverPhotoId: photoId });
		}
		if (session.photoId) await db.photos.delete(session.photoId);
		await db.sessions.update(sessionId, { photoId, updatedAt: now() });
	});
}

/**
 * @param {string} recipeId
 * @param {string} photoId
 */
export function setCover(recipeId, photoId) {
	return db.recipes.update(recipeId, { coverPhotoId: photoId });
}

/**
 * Deletes the finished photo of a cook session that goes away. If the photo was the cover,
 * the newest finished photo that stays becomes the cover.
 * Call it in a transaction with the sessions, the recipes, and the photos.
 * @param {CookSession} session
 */
export async function dropFinishedPhoto(session) {
	if (!session.photoId) return;
	await db.photos.delete(session.photoId);

	const recipe = await db.recipes.get(session.recipeId);
	if (recipe?.coverPhotoId !== session.photoId) return;

	const others = await db.sessions.where('recipeId').equals(recipe.id).toArray();
	const [next] = finishedPhotos(
		{ ...recipe, coverPhotoId: null },
		others.filter((other) => other.id !== session.id)
	);
	await db.recipes.update(recipe.id, { coverPhotoId: next?.photoId ?? null });
}
