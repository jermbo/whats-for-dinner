// The empty row: a package that is used up. Its row stays, with nothing left, so that it keeps the
// place and the size for the next put away. One is enough for each place: more is noise.

import type { FoodItem, Stock } from './types';

export const isEmpty = (stock: Stock) => stock.amount !== null && stock.amount.factor <= 0;

// An empty row must not hide food that you need, so a food item with only empty rows is out.
export const isOut = (item: FoodItem) => item.stocks.every(isEmpty);

// The rows that are not empty. Their dates count, and they show in the Pantry part.
export const withFood = (stocks: Stock[]) => stocks.filter((stock) => !isEmpty(stock));

// Puts new rows in, one after the other. A row that becomes empty goes out of the table when its
// place has an empty row already, so the row that was empty first stays.
export function changeRows(stocks: Stock[], changes: { at: number; stock: Stock }[]): Stock[] {
	const rows: (Stock | null)[] = [...stocks];
	for (const { at, stock } of changes) {
		const another = rows.some(
			(row, index) => index !== at && row !== null && isEmpty(row) && row.place === stock.place
		);
		rows[at] = isEmpty(stock) && another ? null : stock;
	}
	return rows.filter((row) => row !== null);
}
