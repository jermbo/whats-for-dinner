import { CHECK_DAYS, LEFTOVER_MENU_ID, sampleHistory } from './history';
import { sampleIngredients } from './ingredients';
import { daysAgo, hoursAgo, id } from './keys';
import { samplePantry } from './pantry';
import { sampleRecipes } from './recipes';

/**
 * @typedef {import('$lib/types').MenuItem} MenuItem
 * @typedef {import('$lib/types').Product} Product
 * @typedef {import('$lib/types').ShoppingItem} ShoppingItem
 */

/**
 * A meal on the menu. The states are different on purpose: ready, needs preparation,
 * in preparation, and leftovers.
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

	/** @type {MenuItem[]} */
	const menu = [
		menuItem('lentil-soup', 24, { id: LEFTOVER_MENU_ID, kind: 'leftover' }),
		menuItem('spaghetti', 20),
		menuItem('chicken-bowl', 19),
		menuItem('beef-chili', 18),
		menuItem('baked-fish', 17),
		// The preparation is done, but the 8 hours are not over.
		menuItem('overnight-oats', 16, { prepDoneAt: hoursAgo(3) }),
		menuItem('banana-smoothie', 15)
	];

	/** @type {Product[]} */
	const products = [
		{
			barcode: '8076800195057',
			name: 'Barilla Spaghetti n.5',
			ingredientId: id('spaghetti'),
			quantity: 500,
			updatedAt: daysAgo(12)
		}
	];

	/** @type {ShoppingItem[]} */
	const shopping = [
		{
			id: id('shopping-paper-towels'),
			name: 'Paper towels',
			ingredientId: null,
			quantity: 1,
			updatedAt: daysAgo(0)
		},
		{
			id: id('shopping-dish-soap'),
			name: 'Dish soap',
			ingredientId: null,
			quantity: 0,
			updatedAt: daysAgo(0)
		},
		{
			id: id('shopping-eggs'),
			name: 'Eggs',
			ingredientId: id('eggs'),
			quantity: 12,
			updatedAt: daysAgo(0)
		}
	];

	return {
		ingredients,
		recipes,
		pantry: stock.pantry,
		pantryLog: [...stock.log, ...history.log],
		menu,
		sessions: history.sessions,
		products,
		shopping,
		lastPantryCheckAt: daysAgo(CHECK_DAYS)
	};
}
