// The food that goes out of the pantry at the end of a meal: the ingredients that the plugin can
// count, the new rows of their food items, and the food items to check.

import type { IngredientMatch } from '../match/match';
import { showName } from '../match/names';
import type { FoodNote } from '../note';
import { takeOut } from '../pantry/total';
import type { Stock } from '../pantry/types';
import type { Measure } from '../units';
import { optionsOf } from './pick-food';

// An ingredient that the plugin can take out of the pantry: it has an amount, and one or more
// food items have an amount that compares.
export type Counted = { name: string; need: Measure; options: FoodNote[]; first: FoodNote };

// `others` has the names of the ingredients that the plugin cannot count. `check` has the paths of
// the food items that a meal could not take food from.
export type MealCount = { counted: Counted[]; others: string[]; check: string[] };

// Food that the pantry counts, but in an amount that compares with nothing, such as 1 onion
// against a bag of 1 kg. Water with the row "tap" has no amount, so it is never to check.
const isCounted = (food: FoodNote) => food.item.stocks.some((stock) => stock.amount?.factor);

// `picked` has the food item that "Get out" selected for each ingredient, by its place in the
// matches.
export function countMeal(matches: IngredientMatch[], picked: (string | null)[]): MealCount {
	const counted: Counted[] = [];
	const others: string[] = [];
	const check: string[] = [];
	for (const [at, match] of matches.entries()) {
		const { ingredient, food, need } = match;
		const options = need ? optionsOf(match) : [];
		if (need && options.length) {
			const first =
				options.find((option) => option.path === picked[at]) ??
				options.find((option) => option.path === food?.path) ??
				options[0];
			counted.push({ name: showName(ingredient.name), need, options, first });
		} else {
			others.push(showName(ingredient.name));
			if (need && food && isCounted(food)) check.push(food.path);
		}
	}
	return { counted, others, check };
}

// The new rows of each food item that the meal used, by the path of its note. `used` tells, for
// each counted ingredient, if you used it.
export function stocksAfterMeal(counted: Counted[], used: boolean[]): Map<string, Stock[]> {
	// Two ingredients can use the same food item, so each one starts with the rows that are left.
	const stocks = new Map<string, Stock[]>();
	counted.forEach((row, at) => {
		if (!used[at]) return;
		const food = row.first;
		stocks.set(food.path, takeOut(stocks.get(food.path) ?? food.item.stocks, row.need));
	});
	return stocks;
}
