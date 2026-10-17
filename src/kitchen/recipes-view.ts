import { lastRating } from '../cook/record';
import { indexFoods, matchRecipe } from '../match/match';
import type { FoodNote, Note } from '../note';
import { readPrep } from '../recipes/prep';
import type { RecipeEntry } from './types';

const share = (entry: RecipeEntry) =>
	entry.match.ingredients.length ? entry.match.inPantry / entry.match.ingredients.length : 0;

export function recipesOf(
	notes: Note[],
	foods: FoodNote[],
	today: string,
	soonDays: number
): RecipeEntry[] {
	const index = indexFoods(foods);
	return notes
		.flatMap(({ path, result }): RecipeEntry[] => {
			if (!result.ok) return [];
			const { recipe } = result;
			const match = matchRecipe(recipe, index, today, soonDays);
			const rating = lastRating(recipe.instructions);
			return [{ path, recipe, rating, match, prep: readPrep(recipe) }];
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
