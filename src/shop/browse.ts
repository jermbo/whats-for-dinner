// The filters and the sequences of the shopping list.

import type { ShoppingRow } from './shopping-list';

export type Sort = 'name' | 'meal';
export type Only = 'meal' | 'extra';
export type ShopGroup = { title: string; rows: ShoppingRow[] };

export const isForMeal = (row: ShoppingRow) => row.recipes.length > 0;

// The text that you type finds a row by its name, by a different name or a brand of its food
// item, or by a meal that needs it. Thus "taco" shows all that the tacos need.
export function isFound(row: ShoppingRow, text: string): boolean {
	const words = text.trim().toLowerCase();
	const { aliases = [], brands = [] } = row.food?.item ?? {};
	const names = [row.name, ...aliases, ...brands, ...row.recipes];
	return !words || names.some((name) => name.toLowerCase().includes(words));
}

// One group for each meal, so that you see what a meal needs. A row that two meals need is in
// the two groups. Extras have their own group, and an extra that a meal needs is in the two.
export function byMeal(rows: ShoppingRow[]): ShopGroup[] {
	const titles = [...new Set(rows.flatMap((row) => row.recipes))].sort((a, b) =>
		a.localeCompare(b)
	);
	const groups = titles.map((title) => ({
		title,
		rows: rows.filter((row) => row.recipes.includes(title))
	}));
	const extras = rows.filter((row) => row.extra);
	return extras.length ? [...groups, { title: 'Extras', rows: extras }] : groups;
}
