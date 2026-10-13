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
	// What to buy, as quantities. Put away proposes these for the pantry.
	buy: Measure[];
	food: FoodNote | null;
	// The titles of the recipes that need this row.
	recipes: string[];
	// The row is on the list because you put it there: its item has a task with no mark.
	choice: boolean;
};

// What the meals need of one item, with no regard to the pantry.
export type Need = {
	key: string;
	name: string;
	food: FoodNote | null;
	// One sum for each kind of measure. An ingredient with no amount adds nothing.
	sums: Map<string, number>;
	recipes: string[];
};

export function needsOf(
	meals: { title: string; ingredients: IngredientMatch[] }[],
	pantryFolder: string
): Need[] {
	const needs = new Map<string, Need>();
	const needOf = (id: string, name: string, food: FoodNote | null) => {
		const need = needs.get(id) ?? {
			key: food?.path ?? notePathIn(pantryFolder, name),
			name,
			food,
			sums: new Map<string, number>(),
			recipes: []
		};
		needs.set(id, need);
		return need;
	};

	for (const { title, ingredients } of meals) {
		for (const { ingredient, food, need } of ingredients) {
			const entry = food
				? needOf(food.path, food.item.name, food)
				: needOf(nameKey(ingredient.name), showName(ingredient.name), null);
			if (need) addTo(entry.sums, need);
			if (!entry.recipes.includes(title)) entry.recipes.push(title);
		}
	}
	return [...needs.values()];
}

export function shoppingList(needs: Need[]): ShoppingRow[] {
	const rows: ShoppingRow[] = [];
	for (const need of needs) {
		const stocks = need.food?.item.stocks ?? [];
		const short: Measure[] = [];

		for (const [kind, value] of need.sums) {
			const has = available(stocks, kind);
			// The pantry has the food in a unit that does not compare: the plugin does not ask for more.
			if (has === 0 && stocks.length) continue;
			if (value > has) short.push({ kind, value: value - has });
		}

		if (short.length || !stocks.length) rows.push(rowFor(need, short));
	}
	return rows.sort((a, b) => a.name.localeCompare(b.name));
}

// The row of a need, with what to buy of it.
export function rowFor({ key, name, food, recipes }: Need, buy: Measure[]): ShoppingRow {
	const amount = buy.map(showMeasure).join(' + ');
	return { key, name, amount, buy, food, recipes, choice: false };
}
