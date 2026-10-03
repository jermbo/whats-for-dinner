import { db } from '$lib/db/db';
import { now } from '$lib/db/ids';
import { round } from '$lib/util/format';
import { stock } from './pantry';
import { settleTrip } from './trips';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').Product} Product
 * @typedef {import('$lib/types').Purchase} Purchase
 *
 * @typedef {{
 *   purchase: Purchase,
 *   ingredient: Ingredient | null,
 *   productId: string | null,
 *   quantity: number | null,
 *   price: number | null
 * }} Line
 *   One item to put away, with the product, the quantity, and the price that the owner
 *   confirmed. quantity: null for an item that the app does not count. price: for one package.
 */

/** @param {Ingredient | null | undefined} ingredient */
export function isCounted(ingredient) {
	return ingredient?.tracking === 'quantity';
}

/**
 * The last purchase of each ingredient that has a quantity.
 * @param {Purchase[]} purchases
 * @returns {Map<string, Purchase>} By ingredient ID.
 */
export function lastPurchases(purchases) {
	/** @type {Map<string, Purchase>} */
	const last = new Map();
	for (const purchase of purchases.toSorted((a, b) => a.cartAt.localeCompare(b.cartAt))) {
		if (purchase.ingredientId && purchase.putAwayAt && purchase.quantity) {
			last.set(purchase.ingredientId, purchase);
		}
	}
	return last;
}

/**
 * The quantity that the app proposes for an item in the cart. It uses the best information
 * that it has: the package size of a known product, then the quantity of the last time, then
 * the quantity that the menu needs.
 * @param {object} known
 * @param {Purchase} known.purchase
 * @param {Ingredient | null} known.ingredient
 * @param {Product | undefined} known.product The product of the purchase, if the app knows it.
 * @param {Purchase | undefined} known.last The last purchase of the ingredient.
 * @param {number} known.need What the menu needs and the pantry does not have.
 * @returns {number | null} Null for an item that the app does not count.
 */
export function proposeQuantity({ purchase, ingredient, product, last, need }) {
	if (!isCounted(ingredient)) return null;
	if (product && product.quantity > 0) return round(purchase.packages * product.quantity);
	if (last?.quantity) return round((last.quantity / last.packages) * purchase.packages);
	return need;
}

/**
 * "Put away": the items go from the cart into the pantry. Each purchase gets its quantity,
 * its price, and its put-away time. When the cart is empty, the trip is complete.
 * An item that is not an ingredient, such as soap, does not go into the pantry.
 * @param {Line[]} lines
 */
export function putAway(lines) {
	const tables = [db.purchases, db.trips, db.pantry, db.pantryLog, db.shopping];

	return db.transaction('rw', tables, async () => {
		const time = now();

		for (const { purchase, ingredient, productId, quantity, price } of lines) {
			// A second tap on "Put away" must not add the item to the pantry again.
			const current = await db.purchases.get(purchase.id);
			if (!current || current.putAwayAt) continue;

			if (ingredient) await stock(ingredient, quantity ?? 0, 'bought');
			await db.purchases.update(purchase.id, {
				productId,
				quantity: isCounted(ingredient) ? (quantity ?? 0) : null,
				price,
				putAwayAt: time,
				updatedAt: time
			});
			// The item that the owner added by hand is done.
			if (purchase.shoppingItemId) await db.shopping.delete(purchase.shoppingItemId);
		}

		for (const tripId of new Set(lines.map((line) => line.purchase.tripId))) {
			await settleTrip(tripId);
		}
	});
}
