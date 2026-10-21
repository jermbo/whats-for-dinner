// The list that the plugin calculates for the week: what the meals that you did not cook need,
// minus the pantry, and the food of those meals that is past its date.

import type { Meal } from '../plan/types';
import { pastDateRows } from './past-date';
import { needsOf, shoppingList } from './shopping-list';

// A meal that you cooked took its food already, and a dish with no recipe note needs nothing. The
// food of a side has the main dish as its meal, so a row of the list names the meal.
export function mealNeeds(meals: Meal[], pantryFolder: string) {
	return needsOf(
		meals.flatMap(({ cooked, path, entry, sides }) => {
			if (cooked) return [];
			const title = entry?.recipe.title ?? (path.split('/').pop() ?? path).replace(/\.md$/, '');
			return [entry, ...sides.map((side) => side.entry)].flatMap((dish) =>
				dish ? [{ title, ingredients: dish.match.ingredients }] : []
			);
		}),
		pantryFolder
	);
}

export function calculatedList(needs: ReturnType<typeof needsOf>, today: string) {
	return {
		missing: shoppingList(needs),
		past: pastDateRows(needs, today)
	};
}
