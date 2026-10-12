// The list "Get out" of Cook Mode. It has the groups of the recipe, such as "Dry" and "Wet", so
// that you get out the food in the sequence in which the recipe uses it.

import type { IngredientMatch } from '../match/match';
import type { Ingredient, IngredientGroup, Recipe } from '../recipemd/types';

// `at` is the place of the ingredient in the matches. The marks "on the counter" use it.
export type GetOutRow = { at: number; match: IngredientMatch };
// The ingredients with no group have no title.
export type GetOutGroup = { title: string; rows: GetOutRow[] };

export function getOutGroups(recipe: Recipe, matches: IngredientMatch[]): GetOutGroup[] {
	const rowOf = new Map(matches.map((match, at) => [match.ingredient, { at, match }]));
	const rows = (ingredients: Ingredient[]) => ingredients.flatMap((one) => rowOf.get(one) ?? []);

	// A group in a group has the two titles: "Sauce · Dry".
	const inGroups = (groups: IngredientGroup[], above: string[]): GetOutGroup[] =>
		groups.flatMap((group) => {
			const titles = [...above, group.title];
			return [
				{ title: titles.join(' · '), rows: rows(group.ingredients) },
				...inGroups(group.groups, titles)
			];
		});

	const all = [{ title: '', rows: rows(recipe.ingredients) }, ...inGroups(recipe.groups, [])];
	return all.filter((group) => group.rows.length);
}
