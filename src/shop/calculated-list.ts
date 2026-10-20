// The list that the plugin calculates for the week: what the meals that you did not cook need,
// minus the pantry, and the food of those meals that is past its date.

import type { Meal } from '../plan/types';
import { pastDateRows } from './past-date';
import { needsOf, shoppingList } from './shopping-list';

// A meal that you cooked took its food already, and a meal with no recipe note needs nothing.
export function mealNeeds(meals: Meal[], pantryFolder: string) {
	return needsOf(
		meals.flatMap(({ cooked, entry }) =>
			cooked || !entry ? [] : [{ title: entry.recipe.title, ingredients: entry.match.ingredients }]
		),
		pantryFolder
	);
}

export function calculatedList(needs: ReturnType<typeof needsOf>, today: string) {
	return {
		missing: shoppingList(needs),
		past: pastDateRows(needs, today)
	};
}
