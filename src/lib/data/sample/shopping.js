import { daysAgo, id } from './keys';

/**
 * @typedef {import('$lib/types').Product} Product
 * @typedef {import('$lib/types').Purchase} Purchase
 * @typedef {import('$lib/types').ShoppingItem} ShoppingItem
 * @typedef {import('$lib/types').Trip} Trip
 */

/**
 * Product key, ingredient key, name, package size, and barcode.
 * The numbers of products are different on purpose: canned tomatoes have three, milk has two,
 * and rice has one. Chicken has none.
 * @type {[string, string, string, number, string?][]}
 */
const PRODUCTS = [
	['tomatoes-chopped', 'tomatoes', 'Chopped tomatoes', 400],
	['tomatoes-whole', 'tomatoes', 'Whole tomatoes', 400],
	['tomatoes-large', 'tomatoes', 'Crushed tomatoes, large can', 800],
	['milk-whole', 'milk', 'Whole milk', 1000],
	['milk-semi', 'milk', 'Semi-skimmed milk', 1000],
	['rice-basmati', 'rice', 'Basmati rice', 1000],
	['yogurt-plain', 'yogurt', 'Plain yogurt', 500],
	['spaghetti-n5', 'spaghetti', 'Barilla Spaghetti n.5', 500, '8076800195057']
];

/**
 * The lines of a trip: ingredient key (or the name of an item that is not an ingredient),
 * product key, packages, quantity, and the price of one package.
 * @typedef {[string, string | null, number, number | null, number | null]} Line
 */

/**
 * Two trips in the past: the days since the trip, and its lines. The price of the rice is
 * different in each trip. Some lines have no price.
 * @type {[number, Line[]][]}
 */
const TRIPS = [
	[
		21,
		[
			['rice', 'rice-basmati', 2, 2000, 2.09],
			['tomatoes', 'tomatoes-chopped', 1, 400, 0.89],
			['milk', 'milk-whole', 1, 1000, 1.15],
			['chicken', null, 1, 1000, 7.8]
		]
	],
	[
		12,
		[
			['rice', 'rice-basmati', 1, 1000, 2.29],
			['tomatoes', 'tomatoes-large', 1, 800, 1.59],
			['tomatoes', 'tomatoes-whole', 1, 400, null],
			['milk', 'milk-semi', 1, 1000, 1.09],
			['spaghetti', 'spaghetti-n5', 1, 500, 1.49],
			['chicken', null, 1, 500, null],
			['Dish soap', null, 1, null, 2.1]
		]
	]
];

/** The names of the sample ingredients that the trips use. */
const NAMES = {
	rice: 'Rice',
	tomatoes: 'Canned tomatoes',
	milk: 'Milk',
	chicken: 'Chicken thighs',
	spaghetti: 'Spaghetti'
};

/** @param {string} key */
export const photoId = (key) => id(`photo-${key}`);

/** The key and the name of each sample product. A photo is drawn for each one. */
export const PHOTO_LABELS = PRODUCTS.map(([key, , name]) => ({ key, name }));

/** @returns {Product[]} */
export function sampleProducts() {
	return PRODUCTS.map(([key, ingredientKey, name, quantity, barcode]) => ({
		id: id(`product-${key}`),
		ingredientId: id(ingredientKey),
		name,
		quantity,
		photoId: photoId(key),
		barcode: barcode ?? null,
		updatedAt: daysAgo(30)
	}));
}

/** @returns {{ trips: Trip[], purchases: Purchase[] }} */
export function sampleTrips() {
	/** @type {Trip[]} */
	const trips = [];
	/** @type {Purchase[]} */
	const purchases = [];

	for (const [days, lines] of TRIPS) {
		const tripId = id(`trip-${days}`);
		const at = daysAgo(days);
		trips.push({ id: tripId, startedAt: at, completedAt: at, updatedAt: at });

		lines.forEach(([item, productKey, packages, quantity, price], index) => {
			const name = NAMES[/** @type {keyof typeof NAMES} */ (item)];
			purchases.push({
				id: id(`purchase-${days}-${index}`),
				tripId,
				ingredientId: name ? id(item) : null,
				name: name ?? item,
				productId: productKey ? id(`product-${productKey}`) : null,
				shoppingItemId: null,
				packages,
				quantity,
				price,
				within: null,
				cartAt: at,
				putAwayAt: at,
				updatedAt: at
			});
		});
	}

	return { trips, purchases };
}

/**
 * The items that the owner added to the list by hand: two that are not ingredients, and one
 * ingredient that no meal on the menu needs.
 * @returns {ShoppingItem[]}
 */
export function sampleShopping() {
	/** @type {[string, string, string | null][]} */
	const items = [
		['paper-towels', 'Paper towels', null],
		['dish-soap', 'Dish soap', null],
		['eggs', 'Eggs', id('eggs')]
	];
	return items.map(([key, name, ingredientId]) => ({
		id: id(`shopping-${key}`),
		name,
		ingredientId,
		quantity: 0,
		fromPantry: false,
		updatedAt: daysAgo(0)
	}));
}
