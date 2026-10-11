// The filters and the sequences of the recipe list.

import type { RecipeEntry } from '../kitchen-state.svelte';
import { showName } from '../match/names';

export type Sort = 'match' | 'type' | 'rating' | 'name';

// The type of a recipe is its first tag: "dinner" in "dinner, chicken, one pot".
export const typeOf = (entry: RecipeEntry) => entry.recipe.tags[0]?.toLowerCase() ?? 'other';

// You can cook a recipe now when the pantry has each ingredient.
export const isReady = (entry: RecipeEntry) =>
	entry.match.ingredients.length > 0 && entry.match.inPantry === entry.match.ingredients.length;

// The text that you type finds a recipe by its name or by the name of one of its ingredients.
export function isFound({ recipe, match }: RecipeEntry, text: string): boolean {
	const words = text.trim().toLowerCase();
	const names = [recipe.title, ...match.ingredients.map(({ ingredient }) => ingredient.name)];
	return !words || names.some((name) => showName(name).toLowerCase().includes(words));
}

// The types follow the meals of a day. A type that is not a meal comes after them, by name.
const MEALS = ['breakfast', 'lunch', 'dinner', 'side', 'snack', 'dessert'];
const place = (type: string) => (MEALS.includes(type) ? MEALS.indexOf(type) : MEALS.length);
const byType = (a: string, b: string) => place(a) - place(b) || a.localeCompare(b);

export function typesOf(entries: RecipeEntry[]): string[] {
	return [...new Set(entries.map(typeOf))].sort(byType);
}

// The entries come in the sequence "best for the pantry". Each other sequence keeps that one for
// entries that are equal.
export function inSequence(entries: RecipeEntry[], sort: Sort): RecipeEntry[] {
	const sorted = [...entries];
	if (sort === 'type') sorted.sort((a, b) => byType(typeOf(a), typeOf(b)));
	if (sort === 'rating') sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
	if (sort === 'name') sorted.sort((a, b) => a.recipe.title.localeCompare(b.recipe.title));
	return sorted;
}
