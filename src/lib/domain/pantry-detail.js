// The facts of one pantry item that its detail shows: the meals that use it, and its history.
import { formatQuantity } from '$lib/util/format';
import { STOCK_STATES, labelOf } from './options';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').MenuItem} MenuItem
 * @typedef {import('$lib/types').PantryChange} PantryChange
 * @typedef {import('$lib/types').Recipe} Recipe
 *
 * @typedef {{ recipe: Recipe, quantity: number, item: MenuItem | null }} Use
 *   One recipe that uses the ingredient. item: its meal on the menu. Null: not planned.
 * @typedef {{ id: string, at: string, label: string, amount: string }} HistoryLine
 */

/** The most lines that the history shows. */
const MAX_LINES = 6;

/** The words of each cause. A cooked change shows the name of the meal. */
const CAUSES = /** @type {Record<import('$lib/types').Cause, string>} */ ({
	bought: 'Put away',
	cooked: 'Cooked',
	used: 'Used',
	corrected: 'Corrected',
	thrown: 'Thrown away',
	undo: 'Undo'
});

/**
 * The recipes that use an ingredient. The meals on the menu are first, in the sequence of
 * their nights. Then the other recipes, by name.
 * @param {string} ingredientId
 * @param {Recipe[]} recipes
 * @param {MenuItem[]} menu
 * @returns {Use[]}
 */
export function usedIn(ingredientId, recipes, menu) {
	const planned = new Map(
		menu.filter((item) => item.kind === 'recipe').map((item) => [item.recipeId, item])
	);

	/** @type {Use[]} */
	const uses = [];
	for (const recipe of recipes) {
		const row = recipe.ingredients.find((entry) => entry.ingredientId === ingredientId);
		if (row) uses.push({ recipe, quantity: row.quantity, item: planned.get(recipe.id) ?? null });
	}

	return uses.sort(
		(a, b) =>
			Number(!a.item) - Number(!b.item) ||
			(a.item?.night ?? '').localeCompare(b.item?.night ?? '') ||
			a.recipe.name.localeCompare(b.recipe.name)
	);
}

/**
 * The name of the meal of each cook session.
 * @param {import('$lib/types').CookSession[]} sessions
 * @returns {Map<string, string>} By session ID.
 */
export function mealNames(sessions) {
	return new Map(sessions.map((session) => [session.id, session.recipeName]));
}

/**
 * The last changes of one ingredient as the lines of a receipt, the newest first.
 * @param {PantryChange[]} changes The log of the ingredient, oldest first.
 * @param {Map<string, string>} meals The name of the meal of each cook session, by session ID.
 * @param {Ingredient} ingredient
 * @returns {HistoryLine[]}
 */
export function historyLines(changes, meals, ingredient) {
	return changes
		.filter((change) => change.delta !== 0 || change.state)
		.slice(-MAX_LINES)
		.reverse()
		.map((change) => {
			const sign = change.delta > 0 ? '+' : '';
			return {
				id: change.id,
				at: change.at,
				label:
					(change.cause === 'cooked' && meals.get(change.sessionId ?? '')) || CAUSES[change.cause],
				amount:
					change.delta !== 0
						? `${sign}${formatQuantity(change.delta, ingredient.unit)}`
						: labelOf(STOCK_STATES, change.state ?? '')
			};
		});
}
