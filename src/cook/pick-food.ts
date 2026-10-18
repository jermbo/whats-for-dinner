// "Pasta" fits elbow pasta and shell pasta. The page "Get out" selects one of them before you tap,
// so that the food is used wisely: you only check the selection.

import type { IngredientMatch } from '../match/match';
import type { FoodNote } from '../note';
import { isOut } from '../pantry/empty-row';
import { available, firstUseBy } from '../pantry/total';

// The food items that a line can use: each food item of its name that the pantry has. With an
// amount, only the rows that compare with it count, so that the last page can take the food out.
// "Get out" and the last page both use this, so that they show the same options.
export function optionsOf({ candidates, need }: IngredientMatch): FoodNote[] {
	if (!need) return candidates.filter((food) => !isOut(food.item));
	return candidates.filter((food) => available(food.item.stocks, need.kind) > 0);
}

// Three rules, in this sequence. Each rule keeps the food items that are best for it, and a rule
// that keeps one food item decides.
export function pickFood(match: IngredientMatch): FoodNote | null {
	const { need } = match;
	const has = (food: FoodNote) => (need ? available(food.item.stocks, need.kind) : 0);

	const rules: ((foods: FoodNote[]) => FoodNote[])[] = [
		// The food item with the earliest use-by date. No date comes after each date.
		(foods) => best(foods, (food) => firstUseBy(food.item.stocks) ?? '9999', (a, b) => a < b),
		// The food item that the recipe uses up, so that no small rest stays in the cupboard.
		(foods) => {
			const usedUp = foods.filter((food) => need && has(food) > 0 && need.value >= has(food));
			return usedUp.length ? usedUp : foods;
		},
		// The food item that the pantry has the most of.
		(foods) => best(foods, has, (a, b) => a > b)
	];

	let foods = optionsOf(match);
	for (const rule of rules) {
		if (foods.length <= 1) break;
		foods = rule(foods);
	}
	return foods[0] ?? null;
}

// The food items with the best value. `better` tells if the first value is better.
function best<T>(foods: FoodNote[], value: (food: FoodNote) => T, better: (a: T, b: T) => boolean) {
	let top = foods.slice(0, 1);
	for (const food of foods.slice(1)) {
		if (better(value(food), value(top[0]))) top = [food];
		else if (!better(value(top[0]), value(food))) top.push(food);
	}
	return top;
}
