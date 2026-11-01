// What an occasion puts on the list: the food of your dishes, each at its scale, from 7 days before
// the date. Mum buys her own pumpkins, so a dish of a different person puts nothing there.

import type { IngredientMatch } from '../match/match';
import type { Meal } from '../plan/types';
import type { RecipeEntry } from '../recipes/types';
import { mealNeeds } from '../shop/calculated-list';
import { shoppingList, type ShoppingRow } from '../shop/shopping-list';
import { addDays } from '../dates';
import { isActive, type Occasion } from './occasions';

// A plan in October must not put a turkey on each list for five weeks.
const DAYS_BEFORE = 7;

export type ListDish = { title: string; ingredients: IngredientMatch[] };

// Two pies need two times the food. The amounts of the recipe do not change.
export function scaleMatches(matches: IngredientMatch[], scale: number): IngredientMatch[] {
	if (scale === 1) return matches;
	return matches.map((match) =>
		match.need ? { ...match, need: { ...match.need, value: match.need.value * scale } } : match
	);
}

// Your dishes with a recipe and no mark. A row of the list names the occasion as its reason.
export function yourDishes(occasion: Occasion, recipes: RecipeEntry[]): ListDish[] {
	return occasion.dishes.flatMap((dish) => {
		const entry = dish.path ? recipes.find((recipe) => recipe.path === dish.path) : undefined;
		if (!entry || dish.person !== null || dish.ready) return [];
		return [{ title: occasion.name, ingredients: scaleMatches(entry.match.ingredients, dish.scale) }];
	});
}

// A note with no date never goes on the list by itself.
export const isOnTheList = (occasion: Occasion, today: string) =>
	occasion.date !== null && today >= addDays(occasion.date, -DAYS_BEFORE) && isActive(occasion, today);

export function listedDishes(occasions: Occasion[], recipes: RecipeEntry[], today: string): ListDish[] {
	return occasions
		.filter((occasion) => isOnTheList(occasion, today))
		.flatMap((occasion) => yourDishes(occasion, recipes));
}

export type ToBuyContext = {
	meals: Meal[];
	occasions: Occasion[];
	recipes: RecipeEntry[];
	today: string;
	pantryFolder: string;
};

// What the occasion needs to buy, as the list has it, or will have it from 7 days before: the
// week, the other occasions on the list, and your dishes of this one, minus the pantry.
export function toBuyOf(
	occasion: Occasion,
	{ meals, occasions, recipes, today, pantryFolder }: ToBuyContext
): ShoppingRow[] {
	const others = listedDishes(occasions.filter((one) => one.path !== occasion.path), recipes, today);
	const needs = mealNeeds(meals, pantryFolder, [...others, ...yourDishes(occasion, recipes)]);
	return shoppingList(needs).filter((row) => row.recipes.includes(occasion.name));
}
