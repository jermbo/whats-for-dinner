// The lines at the top of the Today screen: a thing that the owner must do or decide tonight.
// A line is the reminder: the phone sends no message.
import { leadHours, needsNightBefore, prepNight, prepTask } from './menu-plan';
import { nightName, nightOf } from './nights';
import { inStock } from './pantry';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {import('./menu').MenuEntry} MenuEntry
 *
 * @typedef {{
 *   kind: 'prep' | 'blocked',
 *   entry: MenuEntry,
 *   text: string,
 *   sub: string,
 *   frozen: { item: PantryItem, ingredient: Ingredient }[]
 * }} TodayLine
 *   prep: the preparation of a later meal starts tonight. Its answer is "Done".
 *   blocked: the meal of tonight is not prepared, and the time is too short. Its answers are
 *   "Order in" and "for tomorrow". frozen: the food of the meal that is in the freezer.
 */

/**
 * The food of a meal that is in the freezer and not empty.
 * @param {MenuEntry} entry
 * @param {Map<string, Ingredient>} ingredientsById
 * @param {Map<string, PantryItem>} pantryByIngredient
 */
function frozenFood(entry, ingredientsById, pantryByIngredient) {
	return entry.recipe.ingredients.flatMap((row) => {
		const ingredient = ingredientsById.get(row.ingredientId);
		const item = pantryByIngredient.get(row.ingredientId);
		return ingredient && item && inStock(item, ingredient) && item.location === 'freezer'
			? [{ item, ingredient }]
			: [];
	});
}

/**
 * The lines of tonight, the meal of tonight first.
 * @param {MenuEntry[]} entries
 * @param {Map<string, Ingredient>} ingredientsById
 * @param {Map<string, PantryItem>} pantryByIngredient
 * @param {number} time
 * @returns {TodayLine[]}
 */
export function todayLines(entries, ingredientsById, pantryByIngredient, time) {
	const today = nightOf(time);

	/** @type {TodayLine[]} */
	const blocked = [];
	/** @type {TodayLine[]} */
	const prep = [];

	for (const entry of entries) {
		const { night } = entry.item;
		if (!night || !needsNightBefore(entry)) continue;
		const frozen = frozenFood(entry, ingredientsById, pantryByIngredient);
		const name = entry.recipe.name;

		if (night === today) {
			blocked.push({
				kind: 'blocked',
				entry,
				text: frozen[0] ? `${frozen[0].ingredient.name} is frozen.` : `${name} is not prepared.`,
				sub: `${name} needs ${leadHours(entry.recipe)} hours.`,
				frozen
			});
		} else if (night > today && (prepNight(entry) ?? '') <= today) {
			prep.push({
				kind: 'prep',
				entry,
				text: `${prepTask(entry.recipe)}.`,
				sub: `For ${name}: ${nightName(night, time).toLowerCase()}.`,
				frozen
			});
		}
	}
	return [...blocked, ...prep];
}
