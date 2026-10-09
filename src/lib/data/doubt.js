import { db } from '$lib/db/db';
import { getMeta, setMeta } from '$lib/db/meta';
import { doubtOf } from '$lib/domain/doubt';
import { groupBy } from '$lib/util/collections';
import { now } from '$lib/util/ids';
import { readPreferences } from './preferences';

/** The note of the time of the last pantry check. */
export const CHECK_KEY = 'lastPantryCheckAt';

/** @returns {Promise<string>} The time of the last pantry check, or '' when there was none. */
export async function lastPantryCheck() {
	const time = await getMeta(CHECK_KEY);
	return typeof time === 'string' ? time : '';
}

/** Records that the owner completed a pantry check now. */
export function finishPantryCheck() {
	return setMeta(CHECK_KEY, now());
}

/**
 * The pantry items that the app is not sure about now.
 * @returns {Promise<Map<string, string>>} The item ID and the reason.
 */
export async function findDoubts() {
	const [pantry, ingredients, recipes, sessions, log, lastCheck, preferences] = await Promise.all([
		db.pantry.toArray(),
		db.ingredients.toArray(),
		db.recipes.toArray(),
		db.sessions.toArray(),
		db.pantryLog.orderBy('at').toArray(),
		lastPantryCheck(),
		readPreferences()
	]);

	const since = lastCheck;
	const ingredientsById = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));
	const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]));
	const changesByIngredient = groupBy(log, (change) => change.ingredientId);

	/** @type {Map<string, string[]>} The times of the meals that had each ingredient. */
	const usesByIngredient = new Map();
	for (const session of sessions) {
		// Leftovers use no ingredients. An open session is a meal that is not cooked yet.
		if (session.kind !== 'recipe' || !session.cookedAt) continue;
		for (const row of recipesById.get(session.recipeId)?.ingredients ?? []) {
			usesByIngredient.set(row.ingredientId, [
				...(usesByIngredient.get(row.ingredientId) ?? []),
				session.cookedAt
			]);
		}
	}

	const time = Date.now();
	/** @type {Map<string, string>} */
	const doubts = new Map();
	for (const item of pantry) {
		const ingredient = ingredientsById.get(item.ingredientId);
		if (!ingredient) continue;
		const reason = doubtOf({
			item,
			ingredient,
			changes: changesByIngredient.get(ingredient.id) ?? [],
			uses: usesByIngredient.get(ingredient.id) ?? [],
			since,
			staleDays: preferences.doubtDays,
			time
		});
		if (reason) doubts.set(item.id, reason);
	}
	return doubts;
}
