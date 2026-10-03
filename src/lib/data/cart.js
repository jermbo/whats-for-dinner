import { db } from '$lib/db/db';
import { newId, now } from '$lib/db/ids';
import { openOrStartTrip, settleTrip } from './trips';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').Product} Product
 * @typedef {import('$lib/types').Purchase} Purchase
 * @typedef {import('$lib/types').ShoppingItem} ShoppingItem
 * @typedef {{ name: string, ingredient: Ingredient | null, item: ShoppingItem | null }} Taken
 *   The item that the owner took: an ingredient, or an item that the owner added by hand.
 */

/** The button for the packages goes back to one after this number. */
const MAX_PACKAGES = 6;

/**
 * Puts an item in the cart: makes a purchase with no quantity and no price.
 * The pantry stays the same. The first item starts a trip.
 *
 * With a product, the app knows which package it is. A second take of the same product is a
 * second package. With no product, a second take of the same item does nothing.
 * @param {Taken} taken
 * @param {Product | null} [product]
 * @returns {Promise<Purchase>} The purchase that is in the cart now.
 */
export function take({ name, ingredient, item }, product = null) {
	return db.transaction('rw', db.trips, db.purchases, async () => {
		const trip = await openOrStartTrip();
		const time = now();

		const inTrip = await db.purchases.where('tripId').equals(trip.id).toArray();
		const same = inTrip.filter(
			(purchase) =>
				!purchase.putAwayAt &&
				(ingredient
					? purchase.ingredientId === ingredient.id
					: purchase.shoppingItemId === item?.id)
		);

		if (product) {
			const again = same.find((purchase) => purchase.productId === product.id);
			if (again) return change(again, { packages: again.packages + 1 });

			const unknown = same.find((purchase) => !purchase.productId);
			if (unknown) return change(unknown, { productId: product.id });
		} else if (same.length > 0) {
			return same[0];
		}

		/** @type {Purchase} */
		const purchase = {
			id: newId(),
			tripId: trip.id,
			ingredientId: ingredient?.id ?? null,
			name,
			productId: product?.id ?? null,
			shoppingItemId: item?.id ?? null,
			packages: 1,
			quantity: null,
			price: null,
			cartAt: time,
			putAwayAt: null,
			updatedAt: time
		};
		await db.purchases.add(purchase);
		return purchase;
	});
}

/**
 * @param {Purchase} purchase
 * @param {Partial<Purchase>} values
 * @returns {Promise<Purchase>}
 */
async function change(purchase, values) {
	const changes = { ...values, updatedAt: now() };
	await db.purchases.update(purchase.id, changes);
	return { ...purchase, ...changes };
}

/**
 * "Undo": the item goes back to the list. The purchase is deleted.
 * @param {Purchase} purchase
 */
export function putBack(purchase) {
	return db.transaction('rw', db.trips, db.purchases, async () => {
		await db.purchases.delete(purchase.id);
		await settleTrip(purchase.tripId);
	});
}

/**
 * The number of packages that the button for the packages sets next: 2, 3, and so on, then 1.
 * @param {number} packages
 */
export function nextPackages(packages) {
	return packages >= MAX_PACKAGES ? 1 : packages + 1;
}

/**
 * @param {Purchase} purchase
 * @param {number} packages
 */
export function setPackages(purchase, packages) {
	return change(purchase, { packages });
}

/**
 * Tells the app which product a purchase is. Null: the owner does not tell.
 * @param {Purchase} purchase
 * @param {string | null} productId
 */
export function setProduct(purchase, productId) {
	return change(purchase, { productId });
}
