// Food that a meal of the week needs, and that the pantry has past its use-by date. The list
// counts it as food that you have, because a date is not exact: eggs that are 2 days past their
// date can be good. So the plugin does not put it on the list. It asks you to look.

import { daysBetween } from '../dates';
import { firstUseBy } from '../pantry/total';
import type { FoodItem } from '../pantry/types';
import { rowFor, type Need, type ShoppingRow } from './shopping-list';

// A date before today is past. The date of today is not.
export function isPastDate(item: FoodItem, today: string): boolean {
	const useBy = firstUseBy(item.stocks);
	return useBy !== null && daysBetween(today, useBy) < 0;
}

// One row for each such food item. You put it on the list to replace the food, so the row has all
// that the meals need, with no regard to the pantry.
export function pastDateRows(needs: Need[], today: string): ShoppingRow[] {
	return needs
		.filter(({ food }) => food !== null && isPastDate(food.item, today))
		.map((need) => {
			const all = [...need.sums].map(([kind, value]) => ({ kind, value }));
			return rowFor(need, all);
		});
}
