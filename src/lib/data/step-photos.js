import { db } from '$lib/db/db';
import { limitStepPhotos } from '$lib/domain/step-photos';
import { savePhoto } from './photo-storage';

/** @typedef {import('$lib/types').RecipeStep} RecipeStep */

/**
 * Changes one step of a recipe. The time of the last text change stays, because a photo is
 * not text. Call it in a transaction.
 * @param {string} recipeId
 * @param {string} stepId
 * @param {(step: RecipeStep) => Promise<RecipeStep> | RecipeStep} change
 */
async function changeStep(recipeId, stepId, change) {
	const recipe = await db.recipes.get(recipeId);
	const step = recipe?.steps.find((item) => item.id === stepId);
	if (!recipe || !step) throw new Error('This step is not in the recipe.');

	const changed = await change(step);
	const steps = recipe.steps.map((item) => (item.id === stepId ? changed : item));
	await db.recipes.update(recipeId, { steps });
}

/**
 * Adds a photo to a step. The first photo of a step becomes the selected photo. A new photo
 * does not change the selection.
 * @param {string} recipeId
 * @param {string} stepId
 * @param {Blob} blob The small photo.
 */
export function addStepPhoto(recipeId, stepId, blob) {
	return db.transaction('rw', db.recipes, db.photos, () =>
		changeStep(recipeId, stepId, async (step) => {
			const photoId = await savePhoto(blob);
			const selectedPhotoId = step.selectedPhotoId ?? photoId;
			const { kept, dropped } = limitStepPhotos([...step.photoIds, photoId], selectedPhotoId);
			await db.photos.bulkDelete(dropped);
			return { ...step, photoIds: kept, selectedPhotoId };
		})
	);
}

/**
 * @param {string} recipeId
 * @param {string} stepId
 * @param {string} photoId
 */
export function selectStepPhoto(recipeId, stepId, photoId) {
	return db.transaction('rw', db.recipes, () =>
		changeStep(recipeId, stepId, (step) => ({ ...step, selectedPhotoId: photoId }))
	);
}

/**
 * Deletes one photo of a step. If it was the selected photo, the newest photo that stays
 * becomes the selected photo.
 * @param {string} recipeId
 * @param {string} stepId
 * @param {string} photoId
 */
export function deleteStepPhoto(recipeId, stepId, photoId) {
	return db.transaction('rw', db.recipes, db.photos, () =>
		changeStep(recipeId, stepId, async (step) => {
			await db.photos.delete(photoId);
			const photoIds = step.photoIds.filter((id) => id !== photoId);
			const selectedPhotoId =
				step.selectedPhotoId === photoId ? (photoIds.at(-1) ?? null) : step.selectedPhotoId;
			return { ...step, photoIds, selectedPhotoId };
		})
	);
}
