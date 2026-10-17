// A trip has two sources: the rows that the plugin calculates from the meals, and the open note,
// which has the cart and your extras. This file joins the two into the list and the cart.

import type { FoodNote } from '../note';
import { fillOf } from '../pantry/level';
import { showMeasure } from '../units';
import type { ShoppingRow } from './shopping-list';
import type { Item, TripTask } from './shopping-note';

// An item of the open note. Its key is the path of the note that its link goes to, so that it
// finds the row of the same note. An item with no link has its name as its key.
export type TripItem = TripTask & { key: string };

export const keyOf = (item: Item, pathOf: (link: string) => string) =>
	item.link === null ? item.name : pathOf(item.link);

// The rows that the plugin calculates from the meals of the week.
export type Calculated = {
	// What the pantry does not have. These rows are on the list.
	missing: ShoppingRow[];
	// The food that the pantry has past its use-by date, with all that the meals need. These rows
	// are not on the list: an item of the open note gets its amount from them.
	past: ShoppingRow[];
};

// If two tasks have the same item, the first one counts.
export function itemsOf(tasks: TripTask[], pathOf: (link: string) => string): TripItem[] {
	const items = new Map<string, TripItem>();
	for (const task of tasks) {
		const key = keyOf(task, pathOf);
		if (!items.has(key)) items.set(key, { ...task, key });
	}
	return [...items.values()];
}

// The note of such an item can be one that is not there yet: put away makes it.
export const isPantryItem = (item: TripItem, pantryFolder: string) =>
	item.link !== null && item.key.startsWith(`${pantryFolder}/`);

// The list has the rows that the plugin calculates, and your extras. An item of the cart is off
// the list.
export function listOf(
	calculated: Calculated,
	items: TripItem[],
	foods: FoodNote[]
): ShoppingRow[] {
	const inNote = new Set(items.map((item) => item.key));
	const extras = items
		.filter((item) => !item.inCart)
		.map((item) => ({ ...rowOf(item, calculated, foods), extra: true }));
	return [...calculated.missing.filter((row) => !inNote.has(row.key)), ...extras]
		.map(asStaple)
		.sort(byName);
}

// An item stays in the cart when no meal needs it any more: you took it, so you put it away.
export function cartOf(
	calculated: Calculated,
	items: TripItem[],
	foods: FoodNote[]
): ShoppingRow[] {
	return items
		.filter((item) => item.inCart)
		.map((item) => asStaple(rowOf(item, calculated, foods)))
		.sort(byName);
}

// The row with what makes its food item full again, if that is more than the row has.
export function withFill(row: ShoppingRow): ShoppingRow {
	const fill = row.food ? fillOf(row.food.item) : null;
	const short = row.buy.find((part) => part.kind === fill?.kind)?.value ?? 0;
	if (!fill || short >= fill.value) return row;

	const buy = [...row.buy.filter((part) => part.kind !== fill.kind), fill];
	return { ...row, buy, amount: buy.map(showMeasure).join(' + ') };
}

const byName = (a: ShoppingRow, b: ShoppingRow) => a.name.localeCompare(b.name);

// An item that the plugin calculates too has the amount and the meals of that row. Food that is
// past its date comes first: you put it in the note to replace it.
function rowOf(item: TripItem, { missing, past }: Calculated, foods: FoodNote[]): ShoppingRow {
	const row = [...past, ...missing].find((row) => row.key === item.key);
	if (row) return row;

	const food = foods.find((food) => food.path === item.key) ?? null;
	const none = { amount: '', buy: [], recipes: [], extra: false };
	return { key: item.key, name: item.name, food, ...none };
}

// A staple on the list fills. If the meals need more than that, their amount stays. The rule does
// not ask how the staple got on the list, so an amount does not change when you tap a row.
const asStaple = (row: ShoppingRow) => (row.food?.item.staple ? withFill(row) : row);
