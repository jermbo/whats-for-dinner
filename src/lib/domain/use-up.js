import { round } from '$lib/util/format';
import { pantryCount } from './availability';
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
 * @typedef {{
 *   recipe: Recipe,
 *   uses: SoonItem[],
 *   count: { have: number, need: number },
 *   missing: number,
 *   score: number
 * }} UseUpIdea
 *   uses: the food to use first that the recipe uses. count: the ingredients that the pantry
 *   has, of those that the recipe needs. missing: the ingredients to buy.
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
export function foodToUseFirst(pantry, ingredientsById, changesByIngredient, totals, time) {
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
			const count = pantryCount(recipe, ingredientsById, pantryByIngredient);
			const missing = count.need - count.have;
			const rescue = uses.reduce((sum, item) => sum + 1 + Math.min(item.days, MAX_DAYS) / 7, 0);
			const have = count.need > 0 ? count.have / count.need : 0;
			return { recipe, uses, count, missing, score: rescue * 3 + have * 2 - missing * 0.5 };
		})
		.sort((a, b) => b.score - a.score || a.recipe.name.localeCompare(b.recipe.name));
}

/** An item that is in stock this many days is the first to use. */
export const URGENT_DAYS = 7;

/**
 * The food to use first that a recipe uses, the oldest stock first. A meal that uses it can
 * save it. Undefined: the recipe uses no food that is on the list.
 * @param {Recipe} recipe
 * @param {SoonItem[]} soon
 * @returns {SoonItem | undefined}
 */
export function oldestUse(recipe, soon) {
	const ids = new Set(recipe.ingredients.map((row) => row.ingredientId));
	return soon
		.filter((item) => ids.has(item.ingredient.id))
		.reduce(
			/** @param {SoonItem | undefined} best @param {SoonItem} item */
			(best, item) => (!best || item.days > best.days ? item : best),
			undefined
		);
}

/**
 * The age of a stock in words, for example "2 days in stock".
 * @param {number} days
 */
export function stockAge(days) {
	if (days === 0) return 'New today';
	return `${days} ${days === 1 ? 'day' : 'days'} in stock`;
}
