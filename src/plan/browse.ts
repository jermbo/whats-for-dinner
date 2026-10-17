// The filters and the sequences of the plan. They work on the week: the meals that you did not
// cook.

import type { Meal } from '../kitchen/types';
import { isFound as isRecipeFound, isReady as isRecipeReady } from '../recipes/browse';

export type Sort = 'type' | 'match' | 'name';
export type Only = 'ready' | 'soon' | 'prep';

// The text finds a meal as it finds a recipe: by its name, or by the name of one of its
// ingredients. A meal with no recipe note has only the path of that note.
export const isFound = (meal: Meal, text: string) =>
	meal.entry
		? isRecipeFound(meal.entry, text)
		: meal.path.toLowerCase().includes(text.trim().toLowerCase());

export const isReady = (meal: Meal) => meal.entry !== null && isRecipeReady(meal.entry);

export const usesSoon = (meal: Meal) => (meal.entry?.match.useSoon.length ?? 0) > 0;

// A preparation waits until you confirm it.
export const needsPrep = (meal: Meal) => Boolean(meal.entry?.prep) && !meal.prepDone;

const titleOf = (meal: Meal) => meal.entry?.recipe.title ?? meal.path;

// The meals as one list. `rank` gives the place of a recipe in the sequence "best for the pantry".
// A meal with no recipe note has no place there, so it comes last.
export function inSequence(
	meals: Meal[],
	sort: Exclude<Sort, 'type'>,
	rank: (path: string) => number | undefined
): Meal[] {
	const byName = (a: Meal, b: Meal) => titleOf(a).localeCompare(titleOf(b));
	const place = (meal: Meal) => rank(meal.path) ?? Infinity;
	return [...meals].sort(sort === 'name' ? byName : (a, b) => place(a) - place(b) || byName(a, b));
}
