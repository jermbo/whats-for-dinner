// Compares the ingredients of a recipe with the pantry.

import { daysBetween } from '../dates';
import type { FoodNote } from '../note';
import { available, firstUseBy } from '../pantry/total';
import type { Ingredient, IngredientGroup, Recipe } from '../recipemd/types';
import { measure, type Measure } from '../units';
import { nameKey } from './names';

// The kitchen always has these. They are not in the pantry and not on the shopping list.
const ALWAYS_THERE = new Set(['water']);

// enough: the pantry has the amount. unknown: the pantry has the food, but the units do not
// compare. short: the pantry has less than the amount. missing: the pantry has none.
export type Status = 'enough' | 'unknown' | 'short' | 'missing';

export type IngredientMatch = {
	ingredient: Ingredient;
	// The food items with the name of the ingredient, as their name or as one of their other names.
	candidates: FoodNote[];
	// The candidate that the plugin uses: the one with the most of the food.
	food: FoodNote | null;
	status: Status;
	need: Measure | null;
};

export type RecipeMatch = {
	ingredients: IngredientMatch[];
	inPantry: number;
	// The names of the food items of this recipe that you must use soon.
	useSoon: string[];
};

export type FoodIndex = Map<string, FoodNote[]>;

export function indexFoods(foods: FoodNote[]): FoodIndex {
	const index: FoodIndex = new Map();
	for (const food of foods) {
		const keys = new Set([food.item.name, ...food.item.aliases].map(nameKey));
		for (const key of keys) index.set(key, [...(index.get(key) ?? []), food]);
	}
	return index;
}

export function allIngredients(recipe: Recipe): Ingredient[] {
	const inGroups = (groups: IngredientGroup[]): Ingredient[] =>
		groups.flatMap((group) => [...group.ingredients, ...inGroups(group.groups)]);
	return [...recipe.ingredients, ...inGroups(recipe.groups)];
}

function matchIngredient(ingredient: Ingredient, index: FoodIndex): IngredientMatch {
	const key = nameKey(ingredient.name);
	const candidates = index.get(key) ?? [];
	const need = ingredient.amount ? measure(ingredient.amount) : null;
	const stocked = candidates.filter((food) => food.item.stocks.length);

	if (!stocked.length && ALWAYS_THERE.has(key)) {
		return { ingredient, candidates, food: null, status: 'enough', need };
	}

	if (!stocked.length) {
		return { ingredient, candidates, food: candidates[0] ?? null, status: 'missing', need };
	}
	// An ingredient with no amount, such as salt, needs only that the pantry has the food.
	if (!need) return { ingredient, candidates, food: stocked[0], status: 'enough', need };

	const has = (food: FoodNote) => available(food.item.stocks, need.kind);
	const food = [...stocked].sort((a, b) => has(b) - has(a))[0];
	const status = has(food) >= need.value ? 'enough' : has(food) > 0 ? 'short' : 'unknown';
	return { ingredient, candidates, food, status, need };
}

export const isInPantry = (match: IngredientMatch) =>
	match.status === 'enough' || match.status === 'unknown';

// Food with a use-by date in `soonDays` days, or less, is food to use soon.
export function matchRecipe(
	recipe: Recipe,
	index: FoodIndex,
	today: string,
	soonDays: number
): RecipeMatch {
	const ingredients = allIngredients(recipe).map((ingredient) =>
		matchIngredient(ingredient, index)
	);

	const useSoon = new Set<string>();
	for (const { food, status } of ingredients) {
		const useBy = food && status !== 'missing' ? firstUseBy(food.item.stocks) : null;
		if (food && useBy && daysBetween(today, useBy) <= soonDays) useSoon.add(food.item.name);
	}

	return { ingredients, inPantry: ingredients.filter(isInPantry).length, useSoon: [...useSoon] };
}
