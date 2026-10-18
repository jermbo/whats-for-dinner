// What intake knows from the recipes of the vault: their tags, and their titles.

import type { Recipe } from '../recipemd/types';

// Each tag of the recipes, one time, from A to Z. Capital and small letters are the same.
export function tagsOf(recipes: Recipe[]): string[] {
	const tags = new Map<string, string>();
	for (const tag of recipes.flatMap((recipe) => recipe.tags)) {
		if (!tags.has(tag.toLowerCase())) tags.set(tag.toLowerCase(), tag);
	}
	return [...tags.values()].sort((a, b) => a.localeCompare(b));
}

// The title of a recipe of the vault that is the same as this title, or null. Two versions of a
// recipe can both be correct, so this only tells you.
export function titleInUse(title: string, recipes: Recipe[]): string | null {
	const wanted = title.trim().toLowerCase();
	if (!wanted) return null;
	return recipes.find((recipe) => recipe.title.trim().toLowerCase() === wanted)?.title ?? null;
}
