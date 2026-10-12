// The views of the pantry. A row is one food item in one place, because the place is what you
// forget when you shop.

import { daysBetween } from '../dates';
import type { FoodNote } from '../note';
import { barOf, levelOf, type Bar, type Level } from './level';
import type { Stock } from './types';

export type StockRow = {
	key: string;
	food: FoodNote;
	stock: Stock;
	at: number;
	// The level of the food item, and the part of it that this row shows. Null when the plugin
	// cannot count the amount.
	level: Level | null;
	bar: Bar | null;
};
export type StockGroup = { title: string; rows: StockRow[] };

export type Sort = 'place' | 'low' | 'soon' | 'name';
export type Only = 'low' | 'soon' | 'out';

export function stockRows(foods: FoodNote[], lowPercent: number): StockRow[] {
	return foods.flatMap((food) => {
		const level = levelOf(food.item, lowPercent);
		return food.item.stocks.map((stock, at) => ({
			key: `${food.path}#${at}`,
			food,
			stock,
			at,
			level,
			bar: barOf(stock, level)
		}));
	});
}

// A row is low when its food item is below the low line, with all places together.
export const isLow = (row: StockRow) => row.bar?.isLow ?? false;

const byFood = (a: StockRow, b: StockRow) => a.food.item.name.localeCompare(b.food.item.name);
const byDate = (a: StockRow, b: StockRow) =>
	(a.stock.useBy ?? '9999').localeCompare(b.stock.useBy ?? '9999') || byFood(a, b);

// The days until the use-by date. Null when the row has no date.
export const daysLeft = (stock: Stock, today: string) =>
	stock.useBy ? daysBetween(today, stock.useBy) : null;

// Food with a use-by date in `soonDays` days, or less, is food to use soon.
export const isSoon = (stock: Stock, today: string, soonDays: number) =>
	(daysLeft(stock, today) ?? 9999) <= soonDays;

// The text that you type finds a food item by its name, its other names, or its brands.
export function isFound(food: FoodNote, text: string): boolean {
	const words = text.trim().toLowerCase();
	const { name, aliases, brands } = food.item;
	return !words || [name, ...aliases, ...brands].some((one) => one.toLowerCase().includes(words));
}

// One group for each place, so that you see the downstairs pantry and the outside fridge.
export function byPlace(rows: StockRow[]): StockGroup[] {
	const places = [...new Set(rows.map((row) => row.stock.place))].sort();
	return places.map((place) => ({
		title: place,
		rows: rows.filter((row) => row.stock.place === place).sort(byDate)
	}));
}

// The food to use first is at the top.
export function bySoon(rows: StockRow[], today: string, soonDays: number): StockGroup[] {
	const dated = rows.filter((row) => row.stock.useBy).sort(byDate);
	const groups = [
		{ title: 'Use first', rows: dated.filter((row) => isSoon(row.stock, today, soonDays)) },
		{ title: 'Later', rows: dated.filter((row) => !isSoon(row.stock, today, soonDays)) },
		{ title: 'No date', rows: rows.filter((row) => !row.stock.useBy).sort(byFood) }
	];
	return groups.filter((group) => group.rows.length);
}

// The food that is most empty is at the top.
export function byLow(rows: StockRow[]): StockGroup[] {
	const filled = (row: StockRow) => (row.level ? row.level.has / row.level.full : 1);
	const emptyFirst = (a: StockRow, b: StockRow) => filled(a) - filled(b) || byFood(a, b);
	const counted = rows.filter((row) => row.bar).sort(emptyFirst);
	const groups = [
		{ title: 'Low', rows: counted.filter(isLow) },
		{ title: 'Enough', rows: counted.filter((row) => !isLow(row)) },
		{ title: 'Not counted', rows: rows.filter((row) => !row.bar).sort(byFood) }
	];
	return groups.filter((group) => group.rows.length);
}

export function byName(rows: StockRow[]): StockGroup[] {
	return rows.length ? [{ title: 'A to Z', rows: [...rows].sort(byFood) }] : [];
}
