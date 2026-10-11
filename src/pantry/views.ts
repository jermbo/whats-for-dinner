// The views of the pantry. A row is one food item in one place, because the place is what you
// forget when you shop.

import { daysBetween } from '../dates';
import { SOON_DAYS } from '../match/match';
import type { FoodNote } from '../note';
import type { Stock } from './types';

export type StockRow = { key: string; food: FoodNote; stock: Stock; at: number };
export type StockGroup = { title: string; rows: StockRow[] };

export function stockRows(foods: FoodNote[]): StockRow[] {
	return foods.flatMap((food) =>
		food.item.stocks.map((stock, at) => ({ key: `${food.path}#${at}`, food, stock, at }))
	);
}

const byFood = (a: StockRow, b: StockRow) => a.food.item.name.localeCompare(b.food.item.name);
const byDate = (a: StockRow, b: StockRow) =>
	(a.stock.useBy ?? '9999').localeCompare(b.stock.useBy ?? '9999') || byFood(a, b);

// The days until the use-by date. Null when the row has no date.
export const daysLeft = (stock: Stock, today: string) =>
	stock.useBy ? daysBetween(today, stock.useBy) : null;

export const isSoon = (stock: Stock, today: string) => (daysLeft(stock, today) ?? 9999) <= SOON_DAYS;

// One group for each place, so that you see the downstairs pantry and the outside fridge.
export function byPlace(rows: StockRow[]): StockGroup[] {
	const places = [...new Set(rows.map((row) => row.stock.place))].sort();
	return places.map((place) => ({
		title: place,
		rows: rows.filter((row) => row.stock.place === place).sort(byDate)
	}));
}

// The food to use first is at the top.
export function bySoon(rows: StockRow[], today: string): StockGroup[] {
	const dated = rows.filter((row) => row.stock.useBy).sort(byDate);
	const groups = [
		{ title: 'Use first', rows: dated.filter((row) => isSoon(row.stock, today)) },
		{ title: 'Later', rows: dated.filter((row) => !isSoon(row.stock, today)) },
		{ title: 'No date', rows: rows.filter((row) => !row.stock.useBy).sort(byFood) }
	];
	return groups.filter((group) => group.rows.length);
}

export function byName(rows: StockRow[]): StockGroup[] {
	return rows.length ? [{ title: 'A to Z', rows: [...rows].sort(byFood) }] : [];
}
