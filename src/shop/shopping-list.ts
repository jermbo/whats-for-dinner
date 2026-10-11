// The shopping list is the plan minus the pantry. Two meals that need onions make one row.

import type { IngredientMatch } from '../match/match';
import { nameKey, showName } from '../match/names';
import type { FoodNote } from '../note';
import { available } from '../pantry/total';
import { addTo, showMeasure, type Measure } from '../units';

export type ShoppingRow = {
	key: string;
	name: string;
	// What to buy, as text: "20 g", "1 can + 200 ml", or no text when the recipes give no amount.
	amount: string;
	// What to buy, as quantities. Put away adds these to the pantry.
	buy: Measure[];
	food: FoodNote | null;
	// The titles of the recipes that need this row.
	recipes: string[];
};

type Need = {
	name: string;
	food: FoodNote | null;
	sums: Map<string, number>;
	recipes: Set<string>;
};

export function shoppingList(meals: { title: string; ingredients: IngredientMatch[] }[]) {
	const needs = new Map<string, Need>();

	for (const { title, ingredients } of meals) {
		for (const { ingredient, food, need, status } of ingredients) {
			// Food that the kitchen always has, such as water.
			if (!food && status === 'enough') continue;
			const key = food ? food.path : nameKey(ingredient.name);
			const entry = needs.get(key) ?? {
				name: food ? food.item.name : showName(ingredient.name),
				food,
				sums: new Map<string, number>(),
				recipes: new Set<string>()
			};
			if (need) addTo(entry.sums, need);
			entry.recipes.add(title);
			needs.set(key, entry);
		}
	}

	const rows: ShoppingRow[] = [];
	for (const [key, { name, food, sums, recipes }] of needs) {
		const stocks = food?.item.stocks ?? [];
		const buy: Measure[] = [];

		for (const [kind, value] of sums) {
			const has = available(stocks, kind);
			// The pantry has the food in a unit that does not compare: the plugin does not ask for more.
			if (has === 0 && stocks.length) continue;
			if (value > has) buy.push({ kind, value: value - has });
		}

		if (buy.length || !stocks.length) {
			const amount = buy.map(showMeasure).join(' + ');
			rows.push({ key, name, amount, buy, food, recipes: [...recipes] });
		}
	}
	return rows.sort((a, b) => a.name.localeCompare(b.name));
}
