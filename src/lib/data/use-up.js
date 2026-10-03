import { round } from '$lib/util/format';
import { missingFor } from './availability';
import { daysInStock } from './freshness';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {import('$lib/types').PantryChange} PantryChange
 * @typedef {import('$lib/types').Recipe} Recipe
 *
 * @typedef {{
 *   ingredient: Ingredient,
 *   item: PantryItem,
 *   days: number,
 *   free: number,
 *   planned: string[]
 * }} SoonItem
 *   days: the days since the new stock. free: the amount that no meal on the menu uses
 *   (1 or 0 for a "have, low, or out" item). planned: the meals on the menu that use it.
 *
 * @typedef {{ recipe: Recipe, uses: SoonItem[], missing: number, score: number }} UseUpIdea
 *   uses: the food to use first that the recipe uses. missing: the ingredients to buy.
 */

/** The age that counts the most. An item that is older counts the same. */
const MAX_DAYS = 14;

/**
 * The food to use first: the perishable items in stock, out of the freezer, the oldest stock
 * first. An item that the meals on the menu use completely comes last: it is "planned".
 * Assumption: the age of the stock tells the urgency. The ingredients have no shelf life yet.
 * @param {PantryItem[]} pantry
 * @param {Map<string, Ingredient>} ingredientsById
 * @param {Map<string, PantryChange[]>} changesByIngredient The log, oldest first.
 * @param {Map<string, { total: number, recipes: string[] }>} totals What the menu uses.
 * @param {number} time
 * @returns {SoonItem[]}
 */
export function useSoon(pantry, ingredientsById, changesByIngredient, totals, time) {
	/** @type {SoonItem[]} */
	const items = [];
	for (const item of pantry) {
		const ingredient = ingredientsById.get(item.ingredientId);
		if (!ingredient?.perishable || item.location === 'freezer') continue;

		const counted = ingredient.tracking === 'quantity';
		const have = counted ? item.quantity : Number(item.state !== 'out');
		if (have <= 0) continue;

		const use = totals.get(ingredient.id);
		const free = counted ? Math.max(0, round(have - (use?.total ?? 0))) : Number(!use);
		const days = daysInStock(changesByIngredient.get(ingredient.id) ?? [], item, time);
		items.push({ ingredient, item, days, free, planned: use?.recipes ?? [] });
	}

	return items.sort(
		(a, b) =>
			Number(a.free === 0) - Number(b.free === 0) ||
			b.days - a.days ||
			a.ingredient.name.localeCompare(b.ingredient.name)
	);
}

/**
 * The recipes that use up the most of the food to use first. Each item counts, and an older item
 * counts more. Then a recipe that the pantry can make comes before a recipe that needs shopping.
 * @param {Recipe[]} recipes The recipes to look at. A reference recipe is not an idea.
 * @param {SoonItem[]} soon
 * @param {Map<string, Ingredient>} ingredientsById
 * @param {Map<string, PantryItem>} pantryByIngredient
 * @returns {UseUpIdea[]}
 */
export function useUpIdeas(recipes, soon, ingredientsById, pantryByIngredient) {
	const open = new Map(
		soon.filter((item) => item.free > 0).map((item) => [item.ingredient.id, item])
	);

	return recipes
		.filter((recipe) => recipe.ingredients.length > 0)
		.map((recipe) => {
			const uses = recipe.ingredients
				.map((row) => open.get(row.ingredientId))
				.filter((item) => item !== undefined);
			const missing = missingFor(recipe, ingredientsById, pantryByIngredient).length;
			const rescue = uses.reduce((sum, item) => sum + 1 + Math.min(item.days, MAX_DAYS) / 7, 0);
			const have = (recipe.ingredients.length - missing) / recipe.ingredients.length;
			return { recipe, uses, missing, score: rescue * 3 + have * 2 - missing * 0.5 };
		})
		.sort((a, b) => b.score - a.score || a.recipe.name.localeCompare(b.recipe.name));
}
