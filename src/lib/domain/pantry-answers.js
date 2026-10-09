// The two answers of the pantry in words: what must I use, and what must I buy?
import { nameList, pluralIs } from '$lib/util/format';
import { leftText } from './use-by';

/**
 * @typedef {import('./pantry-view').PantryRow} PantryRow
 * @typedef {import('./pantry-detail').Use} Use
 */

/**
 * One sentence about the food that spoils first: the meal on the menu that uses it, or that
 * no meal does.
 * @param {PantryRow | undefined} first The row with the fewest days.
 * @param {Use[]} uses The recipes that use the food of that row.
 */
export function soonSentence(first, uses) {
	if (!first || first.left === null) return 'No food spoils in the next days.';

	const name = first.ingredient.name;
	const meal = uses.find((use) => use.item)?.recipe.name;
	if (meal) return `${name} is in the ${meal.toLowerCase()} on the menu.`;
	const when = first.left <= 0 ? 'today' : `in ${leftText(first.left)}`;
	return `No meal on the menu uses the ${name.toLowerCase()}. Use it ${when}.`;
}

/**
 * One sentence about the food below the low line: the names, and how many are on the list.
 * @param {PantryRow[]} below The rows below the line.
 * @param {number} toShop The number of those rows that are not on the shopping list.
 */
export function belowSentence(below, toShop) {
	if (below.length === 0) return 'All items are above their low line.';

	const names = nameList(below.map((row) => row.ingredient.name));
	const listed = below.length - toShop;
	if (listed === 0) return `${names}.`;
	if (toShop === 0) return `${names}. All are on the Shop list.`;
	return `${names}. ${pluralIs(listed, 'item')} on the Shop list already.`;
}
