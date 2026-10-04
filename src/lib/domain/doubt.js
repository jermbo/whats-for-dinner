import { plural } from '$lib/util/format';
import { daysInStock } from './freshness';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {import('$lib/types').PantryChange} PantryChange
 */

/** A perishable item with no new stock for this many days gets a doubt. */
const STALE_DAYS = 7;
/** A 'state' item that this many meals used gets a doubt. Cooking does not change its state. */
const MANY_MEALS = 3;

/**
 * Why the app is not sure about one pantry item. The app is sure when the text is empty.
 * The pantry check asks the owner about the items with a doubt, and not about the others.
 * @param {{
 *   item: PantryItem,
 *   ingredient: Ingredient,
 *   changes: PantryChange[],
 *   uses: string[],
 *   since: string,
 *   time: number
 * }} facts
 *   changes: the log of this ingredient, oldest first. uses: the times of the meals that had
 *   this ingredient. since: the time of the last pantry check, or '' when there was none.
 * @returns {string}
 */
export function doubtOf({ item, ingredient, changes, uses, since, time }) {
	// The last time that a person gave the amount of this item.
	const corrected = changes.findLast((change) => change.cause === 'corrected')?.at ?? '';
	const looked = corrected > since ? corrected : since;

	if (ingredient.tracking === 'state') {
		if (item.state === 'low') return 'Low at the last look.';
		const meals = uses.filter((at) => at > looked).length;
		if (item.state === 'have' && meals >= MANY_MEALS) {
			return `Used in ${plural(meals, 'meal')} since the last look.`;
		}
	} else if (ingredient.unit !== 'count') {
		// A recipe gives a weight or a volume, but the cook does not measure each gram.
		const recent = changes.filter((change) => change.at > looked);
		const meals =
			recent.filter((change) => change.cause === 'cooked').length -
			recent.filter((change) => change.cause === 'undo').length;
		if (meals > 0) return `Used in ${plural(meals, 'meal')} since the last look.`;
	}

	const inStock = ingredient.tracking === 'state' ? item.state !== 'out' : item.quantity > 0;
	if (ingredient.perishable && item.location !== 'freezer' && inStock) {
		const days = daysInStock(changes, item, time);
		if (days >= STALE_DAYS) return `Perishable. No new stock for ${days} days.`;
	}

	return '';
}
