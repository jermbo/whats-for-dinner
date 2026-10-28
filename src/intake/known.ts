// What intake knows from the recipes of the vault: their tags, and their titles.

import { showName } from '../match/names';
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
// recipe can both be correct, so this only tells you. A title that is a link is the same as its
// name: "[[Apple Pie]]" and "Apple Pie".
export function titleInUse(title: string, recipes: Recipe[]): string | null {
	const key = (text: string) => showName(text).trim().toLowerCase();
	const wanted = key(title);
	if (!wanted) return null;
	const found = recipes.find((recipe) => key(recipe.title) === wanted);
	return found ? showName(found.title) : null;
}
