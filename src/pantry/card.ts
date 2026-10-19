// The card of a food item: its packages in one fixed sequence, and what "Done" writes. You drag a
// package to a stop: a quarter of a measured package, or one of a counted package. The sequence
// stays while the card is open, so that a can that you drag to full does not move under your thumb.

import { isCount, measure, showAmount } from '../units';
import { isEmpty } from './empty-row';
import { makeStock } from './food-item';
import type { FoodItem, Stock } from './types';
import { inUseOrder } from './use-order';

// One package of the card. `at` is its row in the note, or null for a package that you added.
export type CardPackage = { key: string; at: number | null; stock: Stock };

const isCounted = (stock: Stock) => stock.size !== null && isCount(measure(stock.size).kind);

// The packages of this place first, and then the other places, each in the sequence of use. A row
// with a text such as "tap" has nothing to drag.
export function cardPackages(stocks: Stock[], place: string): CardPackage[] {
	const rows = stocks
		.map((stock, at) => ({ stock, at }))
		.filter(({ stock }) => stock.amount && stock.size && !isEmpty(stock));
	return [
		...inUseOrder(rows.filter(({ stock }) => stock.place === place)),
		...inUseOrder(rows.filter(({ stock }) => stock.place !== place))
	].map(({ stock, at }) => ({ key: `row ${at}`, at, stock }));
}

export const stopsOf = (stock: Stock) => (isCounted(stock) ? (stock.size?.factor ?? 1) : 4);

// The number of stops that the package fills: 1 for 1/4, 4 for full, and 4 for 4 eggs.
export function filledOf(stock: Stock): number {
	if (!stock.amount || !stock.size) return 0;
	const part = measure(stock.amount).value / measure(stock.size).value;
	return Math.round(part * stopsOf(stock));
}

export function withStop(stock: Stock, stop: number): Stock {
	const size = stock.size;
	if (!size) return stock;
	const text = isCounted(stock) ? String(stop) : showAmount((size.factor * stop) / 4, size.unit);
	return makeStock(stock.place, text, stock.useBy ?? '', stock.sizeText);
}

export const withPlace = (stock: Stock, place: string) =>
	makeStock(place, stock.amount?.text ?? stock.left, stock.useBy ?? '', stock.sizeText);

export const withUseBy = (stock: Stock, useBy: string) =>
	makeStock(stock.place, stock.amount?.text ?? stock.left, useBy, stock.sizeText);

// The size of the next package: the size of the food item, or of its newest package in this
// place, or of its newest package. Null: the food item has no size yet.
export function nextSize(item: FoodItem, place: string): string | null {
	if (item.size) return item.size.text;
	const counted = item.stocks.filter((stock) => stock.size && !isEmpty(stock));
	const newest = counted.filter((stock) => stock.place === place).at(-1) ?? counted.at(-1);
	return newest?.sizeText || null;
}

// A new package is full, in the place of the card, with no date.
export const fullPackage = (place: string, size: string) => makeStock(place, size, '', size);

// The rows that "Done" writes, or null when nothing changed. A package at 0 is empty, and the
// write takes its row out.
export function cardRows(stocks: Stock[], packages: CardPackage[], emptied: Set<string>): Stock[] | null {
	const rows = [...stocks];
	let changed = false;
	for (const { key, at, stock } of packages) {
		const next = emptied.has(key) ? withStop(stock, 0) : stock;
		if (at === null) {
			if (!emptied.has(key)) rows.push(next);
			changed ||= !emptied.has(key);
			continue;
		}
		const before = stocks[at];
		if (!before || sameRow(before, next)) continue;
		rows[at] = next;
		changed = true;
	}
	return changed ? rows : null;
}

const sameRow = (a: Stock, b: Stock) =>
	a.place === b.place && a.left === b.left && a.sizeText === b.sizeText && a.useBy === b.useBy;
