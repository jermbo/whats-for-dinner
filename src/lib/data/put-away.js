import { db } from '$lib/db/db';
import { now } from '$lib/db/ids';
import { round } from '$lib/util/format';
import { changeQuantity, defaultLocation, stock } from './pantry';
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
 *
 * @typedef {{
 *   purchase: Purchase,
 *   ingredient: Ingredient | null,
 *   products: Product[],
 *   product: Product | undefined,
 *   quantity: number | null,
 *   price: number | null,
 *   asks: boolean
 * }} CartEntry
 *   One item of a trip, with what the app knows and proposes. products: the products of the
 *   ingredient. product: the product of the purchase. quantity and price: what the owner gave,
 *   or what the app proposes. asks: the app needs an answer before it can propose a quantity.
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
 * One item of a trip as the put-away screen shows it. For an item in the cart, the app
 * proposes what the owner did not give: the only product of the ingredient, a quantity, and
 * the last price of the product. An item that is put away shows only what its record has.
 * @param {object} known
 * @param {Purchase} known.purchase
 * @param {Ingredient | null} known.ingredient
 * @param {Product[]} known.products The products of the ingredient.
 * @param {Purchase | undefined} known.last The last purchase of the ingredient.
 * @param {number} known.need What the menu needs and the pantry does not have.
 * @param {Map<string, number>} known.prices The last price of each product.
 * @returns {CartEntry}
 */
export function cartEntry({ purchase, ingredient, products, last, need, prices }) {
	const selected = products.find((product) => product.id === purchase.productId);
	const entry = { purchase, ingredient, products };

	if (purchase.putAwayAt) {
		const { quantity, price } = purchase;
		return { ...entry, product: selected, quantity, price, asks: false };
	}

	const product = selected ?? (products.length === 1 ? products[0] : undefined);
	const quantity =
		purchase.quantity ?? proposeQuantity({ purchase, ingredient, product, last, need });
	const price = purchase.price ?? (product && prices.get(product.id)) ?? null;

	// The app asks when it has no number, or when it must know the package size and the
	// ingredient has more than one product. A quantity from the owner is the answer.
	const asks =
		isCounted(ingredient) &&
		purchase.quantity === null &&
		(!quantity || (!product && products.length > 1));

	return { ...entry, product, quantity, price, asks };
}

/**
 * @param {CartEntry} entry
 * @returns {Line}
 */
export function toLine({ purchase, ingredient, product, quantity, price }) {
	return { purchase, ingredient, productId: product?.id ?? null, quantity, price };
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
