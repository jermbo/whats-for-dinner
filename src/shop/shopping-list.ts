// The rows that the plugin calculates: the plan minus the pantry. Two meals that need onions make
// one row.

import type { IngredientMatch } from '../match/match';
import { nameKey, showName } from '../match/names';
import type { FoodNote } from '../note';
import { notePathIn } from '../note-path';
import { available } from '../pantry/total';
import { addTo, showMeasure, type Measure } from '../units';

export type ShoppingRow = {
	// The path of the note of the item. Food that the pantry does not know has the path of a note
	// of the pantry folder that is not there yet. An item with no note has its name as its key.
	key: string;
	name: string;
	// What to buy, as text: "20 g", "1 can + 200 ml", or no text when the row has no amount.
	amount: string;
	// What to buy, as quantities. Put away adds these to the pantry.
	buy: Measure[];
	food: FoodNote | null;
	// The titles of the recipes that need this row.
	recipes: string[];
	// The row is on the list because you put it there: its item has a task with no mark.
	choice: boolean;
};

type Need = {
	name: string;
	food: FoodNote | null;
	sums: Map<string, number>;
	recipes: Set<string>;
};

export function shoppingList(
	meals: { title: string; ingredients: IngredientMatch[] }[],
	pantryFolder: string
) {
	const needs = new Map<string, Need>();
	const needOf = (key: string, name: string, food: FoodNote | null) => {
		const need = needs.get(key) ?? {
			name,
			food,
			sums: new Map<string, number>(),
			recipes: new Set<string>()
		};
		needs.set(key, need);
		return need;
	};

	for (const { title, ingredients } of meals) {
		for (const { ingredient, food, need } of ingredients) {
			const entry = food
				? needOf(food.path, food.item.name, food)
				: needOf(nameKey(ingredient.name), showName(ingredient.name), null);
			if (need) addTo(entry.sums, need);
			entry.recipes.add(title);
		}
	}

	const rows: ShoppingRow[] = [];
	for (const { name, food, sums, recipes } of needs.values()) {
		const stocks = food?.item.stocks ?? [];
		const short = new Map<string, number>();

		for (const [kind, value] of sums) {
			const has = available(stocks, kind);
			// The pantry has the food in a unit that does not compare: the plugin does not ask for more.
			if (has === 0 && stocks.length) continue;
			if (value > has) short.set(kind, value - has);
		}

		const buy = [...short].map(([kind, value]) => ({ kind, value }));
		if (buy.length || !stocks.length) {
			const amount = buy.map(showMeasure).join(' + ');
			const key = food?.path ?? notePathIn(pantryFolder, name);
			rows.push({ key, name, amount, buy, food, recipes: [...recipes], choice: false });
		}
	}
	return rows.sort((a, b) => a.name.localeCompare(b.name));
}
