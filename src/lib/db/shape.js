// A record from an older version of the app gets the fields of this version here. The upgrade
// of the database and the import of a file both use these functions.
import { newStep, splitLines } from '$lib/domain/step-list';
import { newId } from '$lib/util/ids';

/**
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {import('$lib/types').CookSession} CookSession
 */

/**
 * Before version 5, the steps of a recipe were one block of text. Each line becomes a step.
 * @param {Record<string, any>} recipe
 * @returns {Recipe}
 */
export function recipeShape(recipe) {
	const steps =
		typeof recipe.steps === 'string'
			? splitLines(recipe.steps).map(newStep)
			: (recipe.steps ?? []).map((/** @type {Record<string, any>} */ step) => ({
					id: step.id || newId(),
					text: step.text ?? '',
					photoIds: step.photoIds ?? [],
					selectedPhotoId: step.selectedPhotoId ?? null
				}));

	return /** @type {Recipe} */ ({
		...recipe,
		steps,
		minutes: recipe.minutes ?? null,
		coverPhotoId: recipe.coverPhotoId ?? null
	});
}

/**
 * Before version 5, a cook session had no facts from Cook mode.
 * @param {Record<string, any>} session
 * @returns {CookSession}
 */
export function sessionShape(session) {
	/** @type {Record<string, any>} */
	const shaped = {
		startedAt: null,
		servings: 0,
		photoId: null,
		visits: [],
		stepNotes: [],
		timers: [],
		checked: [],
		...session
	};
	return /** @type {CookSession} */ (shaped);
}
