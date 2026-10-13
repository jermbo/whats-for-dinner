// A trip has two sources: the rows that the plugin calculates from the meals, and the open note,
// which has the cart and your choices. This file joins the two into the list and the cart.

import type { FoodNote } from '../note';
import { fillOf } from '../pantry/level';
import { showMeasure } from '../units';
import type { ShoppingRow } from './shopping-list';
import type { TripTask } from './shopping-note';

// An item of the open note. Its key is the path of the note that its link goes to, so that it
// finds the row of the same note. An item with no link has its name as its key.
export type TripItem = TripTask & { key: string };

// If two tasks have the same item, the first one counts.
export function itemsOf(tasks: TripTask[], pathOf: (link: string) => string): TripItem[] {
	const items = new Map<string, TripItem>();
	for (const task of tasks) {
		const key = task.link === null ? task.name : pathOf(task.link);
		if (!items.has(key)) items.set(key, { ...task, key });
	}
	return [...items.values()];
}

// The note of such an item can be one that is not there yet: put away makes it.
export const isPantryItem = (item: TripItem, pantryFolder: string) =>
	item.link !== null && item.key.startsWith(`${pantryFolder}/`);

// The list has the rows that the plugin calculates, and your choices. An item of the cart is off
// the list.
export function listOf(rows: ShoppingRow[], items: TripItem[], foods: FoodNote[]): ShoppingRow[] {
	const inNote = new Set(items.map((item) => item.key));
	const choices = items
		.filter((item) => !item.inCart)
		.map((item) => ({ ...rowOf(item, rows, foods), choice: true }));
	return [...rows.filter((row) => !inNote.has(row.key)), ...choices].map(withFill).sort(byName);
}

// An item stays in the cart when no meal needs it any more: you took it, so you put it away.
export function cartOf(rows: ShoppingRow[], items: TripItem[], foods: FoodNote[]): ShoppingRow[] {
	return items
		.filter((item) => item.inCart)
		.map((item) => withFill(rowOf(item, rows, foods)))
		.sort(byName);
}

const byName = (a: ShoppingRow, b: ShoppingRow) => a.name.localeCompare(b.name);

// An item that the plugin calculates too has the amount and the meals of that row.
function rowOf(item: TripItem, rows: ShoppingRow[], foods: FoodNote[]): ShoppingRow {
	const row = rows.find((row) => row.key === item.key);
	if (row) return row;

	const food = foods.find((food) => food.path === item.key) ?? null;
	const none = { amount: '', buy: [], recipes: [], choice: false };
	return { key: item.key, name: item.name, food, ...none };
}

// A staple on the list fills: its row has what makes the food item full again. If the meals need
// more than that, their amount stays. The rule does not ask how the staple got on the list, so an
// amount does not change when you tap a row.
function withFill(row: ShoppingRow): ShoppingRow {
	const fill = row.food?.item.staple ? fillOf(row.food.item) : null;
	const short = row.buy.find((part) => part.kind === fill?.kind)?.value ?? 0;
	if (!fill || short >= fill.value) return row;

	const buy = [...row.buy.filter((part) => part.kind !== fill.kind), fill];
	return { ...row, buy, amount: buy.map(showMeasure).join(' + ') };
}
