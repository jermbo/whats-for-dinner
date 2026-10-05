import { round } from '$lib/util/format';
import { productsByIngredient } from './products';
import { lastPrices, tripCost } from './trips';
import { proposeWithin } from './use-by';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').Product} Product
 * @typedef {import('$lib/types').Purchase} Purchase
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {import('$lib/types').Trip} Trip
 * @typedef {import('$lib/types').UseWithin} UseWithin
 *
 * @typedef {{
 *   purchase: Purchase,
 *   ingredient: Ingredient | null,
 *   productId: string | null,
 *   quantity: number | null,
 *   price: number | null,
 *   within: UseWithin | null
 * }} Line
 *   One item to put away, with the product, the quantity, and the price that the owner
 *   confirmed. quantity: null for an item that the app does not count. price: for one package.
 *   within: the answer to "Use within". Null: the food keeps.
 *
 * @typedef {{
 *   purchase: Purchase,
 *   ingredient: Ingredient | null,
 *   products: Product[],
 *   product: Product | undefined,
 *   quantity: number | null,
 *   price: number | null,
 *   within: UseWithin | null,
 *   asks: boolean
 * }} CartEntry
 *   One item of a trip, with what the app knows and proposes. products: the products of the
 *   ingredient. product: the product of the purchase. quantity and price: what the owner gave,
 *   or what the app proposes. within: the answer to "Use within", from the owner or from the
 *   usual days of the food. Null: the food keeps. asks: the app needs an answer before it can
 *   propose a quantity.
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
function proposeQuantity({ purchase, ingredient, product, last, need }) {
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
 * @param {PantryItem | undefined} known.item The pantry item of the ingredient.
 * @param {Purchase | undefined} known.last The last purchase of the ingredient.
 * @param {number} known.need What the menu needs and the pantry does not have.
 * @param {Map<string, number>} known.prices The last price of each product.
 * @returns {CartEntry}
 */
export function cartEntry({ purchase, ingredient, products, item, last, need, prices }) {
	const selected = products.find((product) => product.id === purchase.productId);
	const within = purchase.within ?? (ingredient ? proposeWithin(ingredient, item) : null);
	const entry = { purchase, ingredient, products, within };

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
 * The trip that the receipt shows: the open trip. With no open trip, it is the trip that ended
 * last.
 * @param {Trip[]} trips
 */
export function receiptTrip(trips) {
	return trips.find((trip) => !trip.completedAt) ?? trips.findLast((trip) => trip.completedAt);
}

/**
 * The lines of the receipt of one trip, in the sequence of the taps in the store.
 * @param {object} known
 * @param {Trip | undefined} known.trip
 * @param {Purchase[]} known.purchases All purchases, of this trip and of the trips before it.
 * @param {Product[]} known.products All products.
 * @param {Map<string, Ingredient>} known.ingredientsById
 * @param {Map<string, PantryItem>} known.pantryByIngredient
 * @param {import('./shopping').Need[]} known.needs What the menu needs and the pantry does not have.
 * @returns {CartEntry[]}
 */
export function receiptLines({
	trip,
	purchases,
	products,
	ingredientsById,
	pantryByIngredient,
	needs
}) {
	if (!trip) return [];

	const productsOf = productsByIngredient(products, purchases);
	const last = lastPurchases(purchases);
	const prices = lastPrices(purchases);
	const needOf = new Map(needs.map((need) => [need.ingredient.id, need.quantity]));

	return purchases
		.filter((purchase) => purchase.tripId === trip.id)
		.sort((a, b) => a.cartAt.localeCompare(b.cartAt))
		.map((purchase) => {
			const id = purchase.ingredientId ?? '';
			return cartEntry({
				purchase,
				ingredient: ingredientsById.get(id) ?? null,
				products: productsOf.get(id) ?? [],
				item: pantryByIngredient.get(id),
				last: last.get(id),
				need: needOf.get(id) ?? 0,
				prices
			});
		});
}

/**
 * The next line of the receipt that is in the cart, after a given line. After the last line,
 * the search goes on at the first line.
 * @param {CartEntry[]} entries The lines of the receipt.
 * @param {CartEntry} current
 * @returns {CartEntry | undefined}
 */
export function nextInCart(entries, current) {
	const at = entries.findIndex((entry) => entry.purchase.id === current.purchase.id);
	return [...entries.slice(at + 1), ...entries.slice(0, at)].find(
		(entry) => !entry.purchase.putAwayAt
	);
}

/**
 * The cost of the receipt. It has the prices that the lines show: a price that the app
 * proposes counts too.
 * @param {CartEntry[]} entries The lines of the receipt.
 */
export function receiptCost(entries) {
	return tripCost(entries.map((entry) => ({ ...entry.purchase, price: entry.price })));
}

/**
 * @param {CartEntry} entry
 * @returns {Line}
 */
export function toLine({ purchase, ingredient, product, quantity, price, within }) {
	return { purchase, ingredient, productId: product?.id ?? null, quantity, price, within };
}

/**
 * The food of a trip that is in the pantry now: the pantry item of each line that is put
 * away, one time for each ingredient, in the sequence of the receipt.
 * @param {CartEntry[]} entries The lines of the receipt.
 * @param {Map<string, PantryItem>} pantryByIngredient
 * @returns {{ item: PantryItem, ingredient: Ingredient }[]}
 */
export function pantryFills(entries, pantryByIngredient) {
	/** @type {Map<string, { item: PantryItem, ingredient: Ingredient }>} */
	const fills = new Map();
	for (const { purchase, ingredient } of entries) {
		const item = ingredient && pantryByIngredient.get(ingredient.id);
		if (ingredient && item && purchase.putAwayAt) fills.set(ingredient.id, { item, ingredient });
	}
	return [...fills.values()];
}
