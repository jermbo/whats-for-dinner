/**
 * @typedef {import('$lib/types').Recipe} Recipe
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
export function missingFor(recipe, ingredientsById, pantryByIngredient) {
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
