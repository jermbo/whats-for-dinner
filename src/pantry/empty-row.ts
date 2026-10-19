// An empty package: one with nothing left. It is not a package any more, so its row goes out of the
// note at the next write, and a food item with no other package is out.

import type { FoodItem, Stock } from './types';

export const isEmpty = (stock: Stock) => stock.amount !== null && stock.amount.factor <= 0;

export const isOut = (item: FoodItem) => item.stocks.every(isEmpty);

// The rows that are not empty. Their dates count, and they show in the Pantry part.
export const withFood = (stocks: Stock[]) => stocks.filter((stock) => !isEmpty(stock));

// Puts new rows in, one after the other. A row that becomes empty stays until the write, so that
// the number of each other row does not change.
export function changeRows(stocks: Stock[], changes: { at: number; stock: Stock }[]): Stock[] {
	const rows = [...stocks];
	for (const { at, stock } of changes) rows[at] = stock;
	return rows;
}
