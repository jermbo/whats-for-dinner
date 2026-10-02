import { db } from '$lib/db/db';
import { newId, now } from '$lib/db/ids';
import { round } from '$lib/util/format';
import { shortfall } from './availability';
import { stock } from './pantry';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {import('$lib/types').MenuItem} MenuItem
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {import('$lib/types').ShoppingItem} ShoppingItem
 * @typedef {{ ingredient: Ingredient, quantity: number, recipes: string[] }} Need
 */

/**
 * The shopping list: all ingredients of the meals on the menu, minus the pantry stock.
 * @param {MenuItem[]} menu
 * @param {Map<string, Recipe>} recipesById
 * @param {Map<string, Ingredient>} ingredientsById
 * @param {Map<string, PantryItem>} pantryByIngredient
 * @returns {Need[]}
 */
export function shoppingNeeds(menu, recipesById, ingredientsById, pantryByIngredient) {
	/** @type {Map<string, { total: number, recipes: string[] }>} */
	const totals = new Map();

	for (const item of menu) {
		const recipe = item.kind === 'recipe' ? recipesById.get(item.recipeId) : undefined;
		for (const row of recipe?.ingredients ?? []) {
			const entry = totals.get(row.ingredientId) ?? { total: 0, recipes: [] };
			entry.total += row.quantity;
			if (recipe && !entry.recipes.includes(recipe.name)) entry.recipes.push(recipe.name);
			totals.set(row.ingredientId, entry);
		}
	}

	/** @type {Need[]} */
	const needs = [];
	for (const [ingredientId, { total, recipes }] of totals) {
		const ingredient = ingredientsById.get(ingredientId);
		if (!ingredient) continue;
		const quantity = round(shortfall(ingredient, total, pantryByIngredient.get(ingredientId)));
		if (quantity > 0) needs.push({ ingredient, quantity, recipes });
	}

	return needs.sort(
		(a, b) =>
			a.ingredient.category.localeCompare(b.ingredient.category) ||
			a.ingredient.name.localeCompare(b.ingredient.name)
	);
}

/**
 * "Bought": the item goes into the pantry.
 * @param {Ingredient} ingredient
 * @param {number} quantity
 */
export function buy(ingredient, quantity) {
	return stock(ingredient, quantity, 'bought');
}

/**
 * Adds an item by hand. If the name is an ingredient, the item is linked to it.
 * @param {string} name
 * @param {number} quantity
 * @param {Ingredient[]} ingredients
 */
export function addManualItem(name, quantity, ingredients) {
	const text = name.trim();
	const match = ingredients.find((i) => i.name.toLowerCase() === text.toLowerCase());
	return db.shopping.add({
		id: newId(),
		name: match?.name ?? text,
		ingredientId: match?.id ?? null,
		quantity,
		updatedAt: now()
	});
}

/** @param {string} id */
export function removeManualItem(id) {
	return db.shopping.delete(id);
}

/**
 * @param {ShoppingItem} item
 * @param {Ingredient | undefined} ingredient
 * @param {number} quantity
 */
export function buyManualItem(item, ingredient, quantity) {
	return db.transaction('rw', db.shopping, db.pantry, db.pantryLog, async () => {
		if (ingredient) await stock(ingredient, quantity, 'bought');
		await db.shopping.delete(item.id);
	});
}
