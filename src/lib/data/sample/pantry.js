import { daysAgo, id } from './keys';

/** @param {number} days */
const inDays = (days) => daysAgo(-days);

/**
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {import('$lib/types').PantryChange} PantryChange
 * @typedef {import('$lib/types').StockState} StockState
 */

/**
 * Ingredient key, quantity now, largest quantity, the days since the purchase, and the days
 * until the use-by date. With no last number, the food keeps.
 * The levels are different on purpose: full, half, low, and empty. The dates are different too:
 * today, in the next three days, in this week, and later.
 * @typedef {[string, number, number, number, number?]} Counted
 */

/** @type {Counted[]} */
const SHELF = [
	['rice', 450, 2000, 21],
	['spaghetti', 250, 500, 12],
	['oats', 400, 500, 14],
	['flour', 800, 1000, 30],
	['sugar', 950, 1000, 30],
	['lentils', 300, 500, 9],
	['stock', 0, 12, 40],
	['tomatoes', 400, 1200, 12],
	['beans', 2, 4, 12],
	['coconut', 400, 400, 12],
	['onion', 3, 6, 6],
	['garlic', 4, 10, 6],
	['potatoes', 5, 8, 6],
	['tortillas', 4, 8, 6],
	['bread', 6, 12, 2, 2],
	['bananas', 3, 6, 3, 1],
	['tea', 34, 40, 25],
	['coffee', 150, 500, 18],
	['peanut-butter', 60, 350, 35]
];

/** @type {Counted[]} */
const FRIDGE = [
	['eggs', 8, 12, 2, 12],
	['milk', 300, 1000, 9, 1],
	['butter', 180, 250, 6, 20],
	['cheddar', 150, 400, 5, 9],
	['yogurt', 0, 500, 10],
	['cream', 50, 250, 5, 3],
	['spinach', 120, 200, 8, 0],
	['broccoli', 200, 500, 3, 4],
	['carrots', 4, 6, 4, 8],
	['lemon', 1, 3, 6, 6]
];

/** @type {Counted[]} */
const FREEZER = [
	['chicken', 500, 1000, 14],
	['beef', 500, 500, 20],
	['fish', 2, 4, 12],
	['peas', 600, 750, 28],
	['berries', 300, 300, 9],
	['ice-cream', 200, 900, 16]
];

/**
 * The items that have only a state: ingredient key, state, and location.
 * @type {[string, StockState, PantryItem['location']][]}
 */
const STATES = [
	['oil', 'have', 'pantry'],
	['salt', 'have', 'pantry'],
	['black-pepper', 'have', 'pantry'],
	['soy', 'low', 'pantry'],
	['paprika', 'out', 'pantry'],
	['cumin', 'have', 'pantry'],
	['honey', 'have', 'pantry'],
	['mayonnaise', 'have', 'fridge'],
	['jam', 'have', 'fridge']
];

/**
 * @param {string} key
 * @param {Partial<PantryItem>} values
 * @param {number} days The days since the purchase.
 * @returns {PantryItem}
 */
function item(key, values, days) {
	return {
		id: id(`pantry-${key}`),
		ingredientId: id(key),
		quantity: 0,
		fullQuantity: 0,
		state: 'have',
		location: 'pantry',
		useBy: null,
		updatedAt: daysAgo(days),
		...values
	};
}

/**
 * The purchase that put an item into the pantry.
 * @param {string} key
 * @param {number} delta
 * @param {number} days
 * @returns {PantryChange}
 */
function bought(key, delta, days) {
	return {
		id: id(`log-bought-${key}`),
		ingredientId: id(key),
		cause: 'bought',
		delta,
		state: null,
		sessionId: null,
		at: daysAgo(days)
	};
}

/** @returns {{ pantry: PantryItem[], log: PantryChange[] }} */
export function samplePantry() {
	/** @type {PantryItem[]} */
	const pantry = [];
	/** @type {PantryChange[]} */
	const log = [];

	/** @type {[PantryItem['location'], Counted[]][]} */
	const places = [
		['pantry', SHELF],
		['fridge', FRIDGE],
		['freezer', FREEZER]
	];
	for (const [location, rows] of places) {
		for (const [key, quantity, fullQuantity, days, left] of rows) {
			const useBy = left === undefined ? null : inDays(left);
			pantry.push(item(key, { quantity, fullQuantity, location, useBy }, days));
			log.push(bought(key, fullQuantity, days));
		}
	}

	for (const [key, state, location] of STATES) {
		pantry.push(item(key, { state, location }, 30));
	}

	return { pantry, log };
}
