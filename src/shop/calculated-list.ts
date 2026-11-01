// The list that the plugin calculates for the week: what the meals that you did not cook need,
// and what the occasions add, minus the pantry, and the food of those meals that is past its date.

import { showName } from '../match/names';
import type { ListDish } from '../occasion/occasion-list';
import type { Meal } from '../plan/types';
import { pastDateRows } from './past-date';
import { needsOf, shoppingList } from './shopping-list';

// A meal that you cooked took its food already, and a dish with no recipe note needs nothing. The
// food of a side has the main dish as its meal, so a row of the list names the meal.
export function mealDishes(meals: Meal[]): ListDish[] {
	return meals.flatMap(({ cooked, path, entry, sides }) => {
		if (cooked) return [];
		const title = showName(entry?.recipe.title ?? (path.split('/').pop() ?? path).replace(/\.md$/, ''));
		return [entry, ...sides.map((side) => side.entry)].flatMap((dish) =>
			dish ? [{ title, ingredients: dish.match.ingredients }] : []
		);
	});
}

// The week and the occasions take food from the same shelves, so their needs add up first.
export function mealNeeds(meals: Meal[], pantryFolder: string, occasions: ListDish[] = []) {
	return needsOf([...mealDishes(meals), ...occasions], pantryFolder);
}

export function calculatedList(needs: ReturnType<typeof needsOf>, today: string) {
	return {
		missing: shoppingList(needs),
		past: pastDateRows(needs, today)
	};
}
