import { DAY } from '$lib/util/time';

/**
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {import('$lib/types').PantryChange} PantryChange
 */

/**
 * The time when the pantry got new stock of an item: the last purchase, or the last correction
 * that added to it. With no such change in the log, the last change of the item.
 * @param {PantryChange[]} changes The log of the ingredient, oldest first.
 * @param {PantryItem} item
 * @returns {string}
 */
function stockedAt(changes, item) {
	return (
		changes.findLast(
			(change) => change.cause === 'bought' || (change.cause === 'corrected' && change.delta > 0)
		)?.at ?? item.updatedAt
	);
}

/**
 * The full days since the pantry got new stock of an item.
 * @param {PantryChange[]} changes The log of the ingredient, oldest first.
 * @param {PantryItem} item
 * @param {number} time
 */
export function daysInStock(changes, item, time) {
	return Math.max(0, Math.floor((time - Date.parse(stockedAt(changes, item))) / DAY));
}
