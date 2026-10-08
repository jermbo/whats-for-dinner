import { recipeToCook } from './menu';

/**
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {import('$lib/types').MenuItem} MenuItem
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {{ ingredient: Ingredient, need: number, have: number }} Shortage
 */

/**
 * How much of an ingredient the pantry is short for one need.
 * A 'state' ingredient is short only when it is out or not in the pantry.
 * @param {Ingredient} ingredient
 * @param {number} need
 * @param {PantryItem | undefined} item
 * @returns {number} Zero when the pantry has enough.
 */
export function shortfall(ingredient, need, item) {
	if (ingredient.tracking === 'state') return !item || item.state === 'out' ? need || 1 : 0;
	return Math.max(0, need - (item?.quantity ?? 0));
}

/**
 * The ingredients that the pantry does not have for a recipe.
 * @param {Recipe} recipe
 * @param {Map<string, Ingredient>} ingredientsById
 * @param {Map<string, PantryItem>} pantryByIngredient
 * @returns {Shortage[]}
 */
function missingFor(recipe, ingredientsById, pantryByIngredient) {
	/** @type {Shortage[]} */
	const missing = [];
	for (const row of recipe.ingredients) {
		const ingredient = ingredientsById.get(row.ingredientId);
		if (!ingredient) continue;
		const item = pantryByIngredient.get(row.ingredientId);
		if (shortfall(ingredient, row.quantity, item) > 0) {
			missing.push({ ingredient, need: row.quantity, have: item?.quantity ?? 0 });
		}
	}
	return missing;
}

/**
 * How many ingredients of a recipe the pantry has, of how many the recipe needs.
 * A reference recipe has no ingredients: the count is 0 of 0.
 * @param {Recipe} recipe
 * @param {Map<string, Ingredient>} ingredientsById
 * @param {Map<string, PantryItem>} pantryByIngredient
 * @returns {{ have: number, need: number }}
 */
export function pantryCount(recipe, ingredientsById, pantryByIngredient) {
	const need = recipe.ingredients.filter((row) => ingredientsById.has(row.ingredientId)).length;
	const missing = missingFor(recipe, ingredientsById, pantryByIngredient).length;
	return { have: need - missing, need };
}

/**
 * A reference recipe has no ingredients, so the tool cannot know. It counts as "no".
 * @param {Recipe} recipe
 * @param {Map<string, Ingredient>} ingredientsById
 * @param {Map<string, PantryItem>} pantryByIngredient
 */
export function canMake(recipe, ingredientsById, pantryByIngredient) {
	return (
		recipe.ingredients.length > 0 &&
		missingFor(recipe, ingredientsById, pantryByIngredient).length === 0
	);
}

/**
 * How many ingredients of some recipes the pantry has, of how many the recipes need.
 * @param {Recipe[]} recipes
 * @param {Map<string, Ingredient>} ingredientsById
 * @param {Map<string, PantryItem>} pantryByIngredient
 * @returns {{ have: number, need: number }}
 */
export function coverage(recipes, ingredientsById, pantryByIngredient) {
	let have = 0;
	let need = 0;
	for (const recipe of recipes) {
		const count = pantryCount(recipe, ingredientsById, pantryByIngredient);
		have += count.have;
		need += count.need;
	}
	return { have, need };
}

/**
 * The meals on the menu that have ingredients, and how many of them the pantry can make in
 * full. A meal with no ingredients, such as leftovers, does not count.
 * @param {MenuItem[]} menu
 * @param {Map<string, Recipe>} recipesById
 * @param {Map<string, Ingredient>} ingredientsById
 * @param {Map<string, PantryItem>} pantryByIngredient
 * @returns {{ meals: number, complete: number }}
 */
export function mealsInFull(menu, recipesById, ingredientsById, pantryByIngredient) {
	let meals = 0;
	let complete = 0;
	for (const item of menu) {
		const recipe = recipeToCook(item, recipesById);
		if (!recipe || recipe.ingredients.length === 0) continue;
		meals += 1;
		if (canMake(recipe, ingredientsById, pantryByIngredient)) complete += 1;
	}
	return { meals, complete };
}
