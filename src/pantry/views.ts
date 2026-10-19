// The views of the pantry. A line is one food item in one place, because the place is what you
// forget when you shop. The packages of that place are in the line, so eight cans are one line.
// The total and the bar of a line are of all places, so that you see what you have.

import { daysBetween } from '../dates';
import type { FoodNote } from '../note';
import { isEmpty } from './empty-row';
import { barOf, levelOf, type Bar, type Level } from './level';
import { barParts, type BarPart } from './pantry-bar';
import { firstUseBy, totalOf } from './total';
import type { Numbered as Package } from './use-order';

export type StockRow = {
	key: string;
	food: FoodNote;
	place: string;
	// The rows of the food item in this place that are not empty.
	packages: Package[];
	// The total of the packages of all places, such as "1 1/4 gal", and their count.
	total: string;
	count: number;
	// One part of the bar for each package, the packages of this place first.
	parts: BarPart[];
	// The first use-by date of the packages, or null.
	useBy: string | null;
	// The level of the food item, and the part of it that this line shows. Null when the plugin
	// cannot count the amount.
	level: Level | null;
	bar: Bar | null;
};
export type StockGroup = { title: string; rows: StockRow[] };

export type Sort = 'place' | 'low' | 'soon' | 'name';
export type Only = 'low' | 'soon' | 'out';

export function stockRows(foods: FoodNote[]): StockRow[] {
	return foods.flatMap((food) => {
		const level = levelOf(food.item);
		const rows = food.item.stocks.map((stock, at) => ({ stock, at }));
		const full = rows.filter(({ stock }) => !isEmpty(stock));
		const places = [...new Set(full.map(({ stock }) => stock.place))];
		return places.map((place) => {
			const packages = full.filter(({ stock }) => stock.place === place);
			const stocks = packages.map(({ stock }) => stock);
			return {
				key: `${food.path}#${place}`,
				food,
				place,
				packages,
				total: totalOf(food.item.stocks),
				count: full.length,
				parts: barParts(food.item.stocks, place),
				useBy: firstUseBy(stocks),
				level,
				bar: barOf(stocks, level)
			};
		});
	});
}

// A line is low when its food item is low, with all places together.
export const isLow = (row: StockRow) => row.bar?.isLow ?? false;

const byFood = (a: StockRow, b: StockRow) => a.food.item.name.localeCompare(b.food.item.name);
const byDate = (a: StockRow, b: StockRow) =>
	(a.useBy ?? '9999').localeCompare(b.useBy ?? '9999') || byFood(a, b);

// The days until the first use-by date of a line. Null when it has no date.
export const daysLeft = (row: StockRow, today: string) =>
	row.useBy ? daysBetween(today, row.useBy) : null;

// Food with a use-by date in `soonDays` days, or less, is food to use soon.
export const isSoon = (row: StockRow, today: string, soonDays: number) =>
	(daysLeft(row, today) ?? 9999) <= soonDays;

// The text that you type finds a food item by its name, its other names, or the names of its brands.
export function isFound(food: FoodNote, text: string): boolean {
	const words = text.trim().toLowerCase();
	const { name, aliases, brands } = food.item;
	const names = [name, ...aliases, ...brands.map((brand) => brand.name)];
	return !words || names.some((one) => one.toLowerCase().includes(words));
}

// One group for each place, so that you see the downstairs pantry and the outside fridge.
export function byPlace(rows: StockRow[]): StockGroup[] {
	const places = [...new Set(rows.map((row) => row.place))].sort();
	return places.map((place) => ({
		title: place,
		rows: rows.filter((row) => row.place === place).sort(byDate)
	}));
}

// The food to use first is at the top.
export function bySoon(rows: StockRow[], today: string, soonDays: number): StockGroup[] {
	const dated = rows.filter((row) => row.useBy).sort(byDate);
	const groups = [
		{ title: 'Use first', rows: dated.filter((row) => isSoon(row, today, soonDays)) },
		{ title: 'Later', rows: dated.filter((row) => !isSoon(row, today, soonDays)) },
		{ title: 'No date', rows: rows.filter((row) => !row.useBy).sort(byFood) }
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
