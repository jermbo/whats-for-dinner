import { round } from '$lib/util/format';
import { shortfall } from './availability';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {import('$lib/types').MenuItem} MenuItem
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {import('$lib/types').Purchase} Purchase
 * @typedef {import('$lib/types').ShoppingItem} ShoppingItem
 * @typedef {{ total: number, recipes: string[], recipeIds: string[] }} MenuTotal
 * @typedef {{ ingredient: Ingredient, quantity: number, recipeIds: string[] }} Need
 *
 * @typedef {{
 *   key: string,
 *   name: string,
 *   ingredient: Ingredient | null,
 *   quantity: number,
 *   recipeIds: string[],
 *   item: ShoppingItem | null
 * }} ListRow
 *   One item of the shopping list. quantity: what the menu needs and the pantry does not have,
 *   zero for an item that only the owner added. recipeIds: the meals that need it.
 *   item: the record of the item that the owner added by hand.
 *
 * @typedef {{ name: string, rows: ListRow[] }} Aisle
 * @typedef {{ item: MenuItem, recipe: Recipe, toBuy: number }} ShopMeal
 */

/** The aisle of an item that is not an ingredient, such as soap. */
const OTHER = 'Other';

/**
 * What the meals on the menu use of each ingredient, and those meals.
 * Leftovers use no ingredients.
 * @param {MenuItem[]} menu
 * @param {Map<string, Recipe>} recipesById
 * @returns {Map<string, MenuTotal>} By ingredient ID.
 */
export function menuTotals(menu, recipesById) {
	/** @type {Map<string, MenuTotal>} */
	const totals = new Map();

	for (const item of menu) {
		const recipe = item.kind === 'recipe' ? recipesById.get(item.recipeId) : undefined;
		for (const row of recipe?.ingredients ?? []) {
			const entry = totals.get(row.ingredientId) ?? { total: 0, recipes: [], recipeIds: [] };
			entry.total += row.quantity;
			if (recipe && !entry.recipeIds.includes(recipe.id)) {
				entry.recipes.push(recipe.name);
				entry.recipeIds.push(recipe.id);
			}
			totals.set(row.ingredientId, entry);
		}
	}
	return totals;
}

/**
 * What the menu needs and the pantry does not have: all ingredients of the meals on the menu,
 * minus the pantry stock. The cart does not count: an item in the cart is not in the pantry.
 * @param {MenuItem[]} menu
 * @param {Map<string, Recipe>} recipesById
 * @param {Map<string, Ingredient>} ingredientsById
 * @param {Map<string, PantryItem>} pantryByIngredient
 * @returns {Need[]}
 */
export function shoppingNeeds(menu, recipesById, ingredientsById, pantryByIngredient) {
	/** @type {Need[]} */
	const needs = [];
	for (const [ingredientId, { total, recipeIds }] of menuTotals(menu, recipesById)) {
		const ingredient = ingredientsById.get(ingredientId);
		if (!ingredient) continue;
		const quantity = round(shortfall(ingredient, total, pantryByIngredient.get(ingredientId)));
		if (quantity > 0) needs.push({ ingredient, quantity, recipeIds });
	}
	return needs;
}

/**
 * The shopping list: what the menu needs, plus the items that the owner added by hand.
 * An ingredient is one row, also when the menu needs it and the owner added it.
 * @param {Need[]} needs
 * @param {ShoppingItem[]} items The items that the owner added by hand.
 * @param {Map<string, Ingredient>} ingredientsById
 * @returns {ListRow[]}
 */
export function shoppingList(needs, items, ingredientsById) {
	/** @type {Map<string, ListRow>} */
	const rows = new Map();

	for (const { ingredient, quantity, recipeIds } of needs) {
		rows.set(ingredient.id, {
			key: ingredient.id,
			name: ingredient.name,
			ingredient,
			quantity,
			recipeIds,
			item: null
		});
	}

	for (const item of items) {
		const ingredient = (item.ingredientId && ingredientsById.get(item.ingredientId)) || null;
		const row = ingredient && rows.get(ingredient.id);
		if (row) {
			row.item = item;
		} else {
			const key = ingredient?.id ?? item.id;
			rows.set(key, { key, name: item.name, ingredient, quantity: 0, recipeIds: [], item });
		}
	}

	return [...rows.values()];
}

/**
 * The purchase in the cart that is for a row of the list, if there is one.
 * @param {ListRow} row
 * @param {Purchase[]} cart
 */
export function inCart(row, cart) {
	return cart.find((purchase) =>
		row.ingredient
			? purchase.ingredientId === row.ingredient.id
			: purchase.shoppingItemId === row.item?.id
	);
}

/**
 * The rows in groups, in the sequence of a store. The rows of a group are sorted by name.
 * @param {ListRow[]} rows
 * @param {string[]} order The categories, in the sequence of the store of the owner.
 * @returns {Aisle[]}
 */
export function aisles(rows, order) {
	/** @type {Map<string, ListRow[]>} */
	const groups = new Map();
	for (const row of rows) {
		const name = row.ingredient?.category ?? OTHER;
		groups.set(name, [...(groups.get(name) ?? []), row]);
	}

	/** A category that the app does not know is last. */
	const place = (/** @type {string} */ name) =>
		order.includes(name) ? order.indexOf(name) : order.length;

	return [...groups]
		.map(([name, group]) => ({
			name,
			rows: group.sort((a, b) => a.name.localeCompare(b.name))
		}))
		.sort((a, b) => place(a.name) - place(b.name));
}

/**
 * The meals on the menu that have ingredients, each with the number of its items that are
 * not in the cart. A meal with zero is "ready": you have all its items.
 * @param {MenuItem[]} menu
 * @param {Map<string, Recipe>} recipesById
 * @param {ListRow[]} needed The rows of the list that are not in the cart.
 * @returns {ShopMeal[]}
 */
export function shopMeals(menu, recipesById, needed) {
	/** @type {ShopMeal[]} */
	const meals = [];
	for (const item of menu) {
		const recipe = item.kind === 'recipe' ? recipesById.get(item.recipeId) : undefined;
		if (!recipe || recipe.ingredients.length === 0) continue;
		const toBuy = needed.filter((row) => row.recipeIds.includes(recipe.id)).length;
		meals.push({ item, recipe, toBuy });
	}
	return meals.sort((a, b) => a.item.addedAt.localeCompare(b.item.addedAt));
}
