/**
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {{ ingredient: Ingredient, amount: number }} CookAmount
 * @typedef {CookAmount & { takes: number }} CookTake
 */

/**
 * The amount of each ingredient that one cook of a meal uses. "Cooked" subtracts these amounts.
 * Leftovers use no ingredients. A 'state' ingredient has no amount. An ingredient that is in the
 * recipe two times gets one row with the sum.
 * @param {import('$lib/types').MenuKind} kind
 * @param {Recipe} recipe
 * @param {Map<string, Ingredient>} ingredientsById
 * @param {Map<string, number>} [changes] The amounts that the owner changed, by ingredient ID.
 *   A changed amount replaces the amount of the recipe.
 * @returns {CookAmount[]}
 */
export function cookAmounts(kind, recipe, ingredientsById, changes = new Map()) {
	if (kind !== 'recipe') return [];

	/** @type {Map<string, CookAmount>} */
	const amounts = new Map();
	for (const row of recipe.ingredients) {
		const ingredient = ingredientsById.get(row.ingredientId);
		if (ingredient?.tracking !== 'quantity') continue;
		const known = amounts.get(ingredient.id);
		if (known) known.amount += row.quantity;
		else amounts.set(ingredient.id, { ingredient, amount: row.quantity });
	}

	return [...amounts.values()].map((row) => ({
		...row,
		amount: changes.get(row.ingredient.id) ?? row.amount
	}));
}

/**
 * What each amount takes from the pantry. The pantry stops at zero, so an amount that is more
 * than the stock takes only the stock.
 * @param {CookAmount[]} amounts
 * @param {Map<string, PantryItem>} pantryByIngredient
 * @returns {CookTake[]}
 */
export function cookTakes(amounts, pantryByIngredient) {
	return amounts.map((row) => ({
		...row,
		takes: Math.min(row.amount, pantryByIngredient.get(row.ingredient.id)?.quantity ?? 0)
	}));
}
