/**
 * @typedef {import('$lib/types').MenuItem} MenuItem
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {'ready' | 'todo' | 'waiting'} PrepState
 * @typedef {{ item: MenuItem, recipe: Recipe, state: PrepState, readyAt: number | null }} MenuEntry
 */

const HOUR = 60 * 60 * 1000;

/**
 * The recipes that are on the menu as a meal to cook. Leftovers do not count.
 * @param {MenuItem[]} menu
 * @returns {Set<string>} The recipe IDs.
 */
export function recipesOnMenu(menu) {
	return new Set(menu.filter((item) => item.kind === 'recipe').map((item) => item.recipeId));
}

/**
 * The recipes that Menu can propose: a recipe that is not on the menu, of a meal type that the
 * owner plans. A recipe of a different type stays in Recipes.
 * @param {Recipe[]} recipes
 * @param {Set<string>} onMenu The IDs of the recipes that are on the menu.
 * @param {import('$lib/types').MealType[]} mealTypes The meal types that the owner plans.
 */
export function recipesToPropose(recipes, onMenu, mealTypes) {
	return recipes.filter((recipe) => !onMenu.has(recipe.id) && mealTypes.includes(recipe.mealType));
}

/**
 * A meal is ready when it has no preparation, or when the lead time is over.
 * @param {MenuItem} item
 * @param {Recipe} recipe
 * @param {number} nowMs
 * @returns {{ state: PrepState, readyAt: number | null }}
 */
function prepStatus(item, recipe, nowMs) {
	if (item.kind === 'leftover' || recipe.prepSteps.length === 0) {
		return { state: 'ready', readyAt: null };
	}
	if (!item.prepDoneAt) return { state: 'todo', readyAt: null };

	const lead = Math.max(...recipe.prepSteps.map((step) => step.leadHours));
	const readyAt = Date.parse(item.prepDoneAt) + lead * HOUR;
	return { state: readyAt <= nowMs ? 'ready' : 'waiting', readyAt };
}

/**
 * Joins each menu item with its recipe and its preparation state. Oldest first.
 * @param {MenuItem[]} menu
 * @param {Map<string, Recipe>} recipesById
 * @param {number} nowMs
 * @returns {MenuEntry[]}
 */
export function menuEntries(menu, recipesById, nowMs) {
	/** @type {MenuEntry[]} */
	const entries = [];
	for (const item of menu) {
		const recipe = recipesById.get(item.recipeId);
		if (recipe) entries.push({ item, recipe, ...prepStatus(item, recipe, nowMs) });
	}
	return entries.sort((a, b) => a.item.addedAt.localeCompare(b.item.addedAt));
}

/** @param {MenuEntry} entry */
export function entryName(entry) {
	return entry.item.kind === 'leftover' ? `Leftovers: ${entry.recipe.name}` : entry.recipe.name;
}
