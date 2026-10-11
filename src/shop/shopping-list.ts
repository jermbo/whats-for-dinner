// The shopping list is the plan minus the pantry. Two meals that need onions make one row. Food
// that is low can go on the list too, so that you buy it before a recipe needs it.

import type { IngredientMatch } from '../match/match';
import { nameKey, showName } from '../match/names';
import type { FoodNote } from '../note';
import { levelOf } from '../pantry/level';
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
	// The row is on the list because the food item is low or out.
	low: boolean;
};

// A food item to buy with no meal that needs it: it is below its low line, or it is out. `fill` is
// what makes it full again. It is null when the plugin cannot count the food item.
export type LowFood = { food: FoodNote; fill: Measure | null };

export function lowFoods(foods: FoodNote[], lowPercent: number): LowFood[] {
	return foods.flatMap((food) => {
		const level = levelOf(food.item, lowPercent);
		const isOut = !food.item.stocks.length;
		if (!isOut && !level?.isLow) return [];
		return [{ food, fill: level && { kind: level.kind, value: level.full - level.has } }];
	});
}

type Need = {
	name: string;
	food: FoodNote | null;
	sums: Map<string, number>;
	recipes: Set<string>;
	fill: Measure | null;
	low: boolean;
};

export function shoppingList(
	meals: { title: string; ingredients: IngredientMatch[] }[],
	low: LowFood[] = []
) {
	const needs = new Map<string, Need>();
	const needOf = (key: string, name: string, food: FoodNote | null) => {
		const need = needs.get(key) ?? {
			name,
			food,
			sums: new Map<string, number>(),
			recipes: new Set<string>(),
			fill: null,
			low: false
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

	for (const { food, fill } of low) {
		const entry = needOf(food.path, food.item.name, food);
		entry.fill = fill;
		entry.low = true;
	}

	const rows: ShoppingRow[] = [];
	for (const [key, { name, food, sums, recipes, fill, low }] of needs) {
		const stocks = food?.item.stocks ?? [];
		const short = new Map<string, number>();

		for (const [kind, value] of sums) {
			const has = available(stocks, kind);
			// The pantry has the food in a unit that does not compare: the plugin does not ask for more.
			if (has === 0 && stocks.length) continue;
			if (value > has) short.set(kind, value - has);
		}
		// Low food fills to its full amount. If the meals need more than that, their amount stays.
		if (fill) short.set(fill.kind, Math.max(short.get(fill.kind) ?? 0, fill.value));

		const buy = [...short].map(([kind, value]) => ({ kind, value }));
		if (buy.length || !stocks.length) {
			const amount = buy.map(showMeasure).join(' + ');
			rows.push({ key, name, amount, buy, food, recipes: [...recipes], low });
		}
	}
	return rows.sort((a, b) => a.name.localeCompare(b.name));
}
