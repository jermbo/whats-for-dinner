import { db } from '$lib/db/db';
import { defaultLocation } from '$lib/domain/pantry';
import { isCounted } from '$lib/domain/put-away';
import { round } from '$lib/util/format';
import { now } from '$lib/util/ids';
import { changeQuantity, stock } from './pantry';
import { settleTrip } from './trips';

/** @typedef {import('$lib/domain/put-away').Line} Line */

/**
 * "Put away": the items go from the cart into the pantry. Each purchase gets its quantity,
 * its price, and its put-away time. The food gets its use-by time from the answer to "Use
 * within". When the cart is empty, the trip is complete.
 * An item that is not an ingredient, such as soap, does not go into the pantry.
 * @param {Line[]} lines
 */
export function putAway(lines) {
	const tables = [db.purchases, db.trips, db.pantry, db.pantryLog, db.shopping];

	return db.transaction('rw', tables, async () => {
		const time = now();

		for (const { purchase, ingredient, productId, quantity, price, within } of lines) {
			// A second tap on "Put away" must not add the item to the pantry again.
			const current = await db.purchases.get(purchase.id);
			if (!current || current.putAwayAt) continue;

			if (ingredient) await stock(ingredient, quantity ?? 0, 'bought', within);
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

/**
 * Corrects an item after it is put away: the product, the quantity, or the price.
 * The pantry changes by the difference between the new quantity and the old quantity.
 * @param {Line} line The item with its correct values.
 */
export function amend({ purchase, ingredient, productId, quantity, price }) {
	return db.transaction('rw', [db.purchases, db.pantry, db.pantryLog], async () => {
		const current = await db.purchases.get(purchase.id);
		if (!current?.putAwayAt) return;

		const next = isCounted(ingredient) ? (quantity ?? 0) : null;
		const difference = round((next ?? 0) - (current.quantity ?? 0));
		if (ingredient && difference !== 0) {
			const location = defaultLocation(ingredient);
			await changeQuantity(ingredient.id, difference, 'corrected', { location });
		}
		await db.purchases.update(purchase.id, { productId, quantity: next, price, updatedAt: now() });
	});
}
