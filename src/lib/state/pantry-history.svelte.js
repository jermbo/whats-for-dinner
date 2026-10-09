import { db } from '$lib/db/db';
import { historyLines, mealNames } from '$lib/domain/pantry-detail';
import { groupBy } from '$lib/util/collections';
import { live } from './live.svelte';

/**
 * The history of the pantry: each change of each item, with the name of the meal that used it.
 * Call it during component setup.
 */
export function usePantryHistory() {
	const log = live(() => db.pantryLog.orderBy('at').toArray(), []);
	const sessions = live(() => db.sessions.toArray(), []);

	/** The log of each ingredient, oldest first. */
	const changes = $derived(groupBy(log.current, (change) => change.ingredientId));
	const meals = $derived(mealNames(sessions.current));

	return {
		/**
		 * The last changes of one ingredient, the newest first.
		 * @param {import('$lib/types').Ingredient} ingredient
		 */
		linesOf(ingredient) {
			return historyLines(changes.get(ingredient.id) ?? [], meals, ingredient);
		}
	};
}
