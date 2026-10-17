import { indexFoods, matchRecipe } from '../match/match';
import type { FoodNote, Note } from '../note';
import { readPrep } from '../recipes/prep';
import type { RecipeEntry } from './types';

const share = (entry: RecipeEntry) =>
	entry.match.ingredients.length ? entry.match.inPantry / entry.match.ingredients.length : 0;

export function ratingOf(properties: Record<string, unknown>): number | null {
	const rating = Number(properties.rating);
	return rating >= 1 && rating <= 5 ? Math.round(rating) : null;
}

export function recipesOf(
	notes: Note[],
	foods: FoodNote[],
	today: string,
	soonDays: number
): RecipeEntry[] {
	const index = indexFoods(foods);
	return notes
		.flatMap(({ path, result, rating }): RecipeEntry[] => {
			if (!result.ok) return [];
			const match = matchRecipe(result.recipe, index, today, soonDays);
			return [{ path, recipe: result.recipe, rating, match, prep: readPrep(result.recipe) }];
		})
		.sort(
			(a, b) =>
				Number(b.match.useSoon.length > 0) - Number(a.match.useSoon.length > 0) ||
				share(b) - share(a) ||
				a.recipe.title.localeCompare(b.recipe.title)
		);
}

export function rejectedRecipes(notes: Note[]) {
	return notes
		.flatMap(({ path, result }) => (result.ok ? [] : [{ path, reason: result.reason }]))
		.sort((a, b) => a.path.localeCompare(b.path));
}
