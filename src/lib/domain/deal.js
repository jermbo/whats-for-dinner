// The rules of the dealer: which recipes it shows, and the facts of each card.
import { cookMinutes, isQuick } from './recipes';

/**
 * @typedef {import('$lib/types').CookSession} CookSession
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {import('./use-up').UseUpIdea} UseUpIdea
 * @typedef {{ uses: boolean, quick: boolean, fresh: boolean }} DealFilters
 *   uses: "Uses what I have". quick: "Quick". fresh: "New to me".
 */

/**
 * The cards of the dealer: the ideas that pass each filter that is on. With food selected,
 * only the recipes that use that food.
 * "Uses what I have" is a recipe that uses food to use first, or that needs no shopping.
 * @param {UseUpIdea[]} ideas The best idea first.
 * @param {DealFilters} filters
 * @param {Map<string, CookSession>} lastByRecipe The last cook session of each recipe.
 * @param {Set<string>} selected The IDs of the food that the owner selected.
 */
export function dealDeck(ideas, filters, lastByRecipe, selected) {
	return ideas.filter((idea) => {
		const last = lastByRecipe.get(idea.recipe.id);
		if (filters.uses && idea.uses.length === 0 && idea.missing > 0) return false;
		if (filters.quick && !isQuick(cookMinutes(idea.recipe, last))) return false;
		if (filters.fresh && last) return false;
		return selected.size === 0 || idea.uses.some((item) => selected.has(item.ingredient.id));
	});
}

/**
 * The facts of a recipe on its card: the last rating, or "New", and the minutes.
 * @param {Recipe} recipe
 * @param {CookSession | undefined} last The last cook session of the recipe.
 */
export function dealFacts(recipe, last) {
	const minutes = cookMinutes(recipe, last);
	const cooked = last?.rating ? `Last ${last.rating}/5` : 'Cooked before';
	return [last ? cooked : 'New', minutes ? `${minutes} min` : ''].filter(Boolean).join(' · ');
}
