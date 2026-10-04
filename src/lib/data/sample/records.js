import { CHECK_DAYS, LEFTOVER_MENU_ID, sampleHistory } from './history';
import { sampleIngredients } from './ingredients';
import { daysAgo, hoursAgo, id } from './keys';
import { sampleOpenCook } from './open-cook';
import { samplePantry } from './pantry';
import { sampleRecipes } from './recipes';
import { sampleProducts, sampleShopping, sampleTrips } from './shopping';

/** @typedef {import('$lib/types').MenuItem} MenuItem */

/**
 * A meal on the menu. The states are different on purpose: ready, needs preparation,
 * in preparation, and leftovers. One ready meal is open in Cook mode: see "open-cook.js".
 * @param {string} recipeKey
 * @param {number} hours The hours since the owner added the meal.
 * @param {Partial<MenuItem>} [options]
 * @returns {MenuItem}
 */
function menuItem(recipeKey, hours, options = {}) {
	return {
		id: id(`menu-${recipeKey}`),
		kind: 'recipe',
		recipeId: id(recipeKey),
		addedAt: hoursAgo(hours),
		prepDoneAt: null,
		updatedAt: hoursAgo(hours),
		...options
	};
}

/**
 * The sample records. The times are relative to now, so that the data is always recent.
 */
export function sampleRecords() {
	const ingredients = sampleIngredients();
	const recipes = sampleRecipes();
	const stock = samplePantry();
	const history = sampleHistory(recipes, ingredients);
	const shopped = sampleTrips();

	/** @type {MenuItem[]} */
	const menu = [
		menuItem('lentil-soup', 24, { id: LEFTOVER_MENU_ID, kind: 'leftover' }),
		menuItem('spaghetti', 20),
		menuItem('chicken-bowl', 19),
		menuItem('beef-chili', 18),
		menuItem('baked-fish', 17),
		// The 8 hours of preparation are over 2 minutes after a reset: its card changes from
		// "In preparation" to "Ready" while you look.
		menuItem('overnight-oats', 16, { prepDoneAt: hoursAgo(8 - 2 / 60) }),
		// The 24 hours of preparation are over tomorrow: a note with a clock.
		menuItem('coconut-curry', 14, { prepDoneAt: hoursAgo(6) }),
		menuItem('banana-smoothie', 15)
	];

	return {
		ingredients,
		recipes,
		pantry: stock.pantry,
		pantryLog: [...stock.log, ...history.log],
		menu,
		// The cook history, and one meal that the owner is in the middle of.
		sessions: [...history.sessions, ...sampleOpenCook(recipes, menu)],
		products: sampleProducts(),
		trips: shopped.trips,
		purchases: shopped.purchases,
		shopping: sampleShopping(),
		lastPantryCheckAt: daysAgo(CHECK_DAYS)
	};
}
