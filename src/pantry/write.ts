// Writes the rows of a food item into the text of its note. All other text of the note stays.

import { measure } from '../units';
import { readStocks } from './food-item';
import { withAmount } from './stock-amount';
import { formatMarkdownTable, replaceTable } from './table';
import type { Stock } from './types';

const COLUMNS = ['Place', 'Amount', 'Use by'];

export function showStocks(stocks: Stock[]): string {
	const rows = stocks.map((stock) => [stock.place, stock.amountText, stock.useBy ?? '']);
	return formatMarkdownTable(COLUMNS, rows);
}

export function replaceStocks(text: string, stocks: Stock[]): string {
	return replaceTable(text, showStocks(stocks));
}

const kindOf = (stock: Stock) => (stock.amount ? measure(stock.amount).kind : null);
const valueOf = (stock: Stock) => (stock.amount ? measure(stock.amount).value : 0);

// Two amounts are one row when they are in the same place, have the same use-by date, and compare.
const isSameRow = (row: Stock, stock: Stock) =>
	row.place === stock.place &&
	row.useBy === stock.useBy &&
	kindOf(row) !== null &&
	kindOf(row) === kindOf(stock);

// One row is one food item in one place: 800 g for a place that has 200 g makes one row of 1000 g.
// The rows come from the text, so two writes one after the other do not lose a row.
export function addStock(text: string, stock: Stock): string {
	return addInto(text, stock, (row) => isSameRow(row, stock));
}

// Put away proposes the use-by date, so you did not choose to keep the new bag apart. It goes into
// the row of its place that has no date, and that row gets the date. The form of the Pantry part
// does not do this, because there you type a date on purpose.
export function putAwayStock(text: string, stock: Stock): string {
	return addInto(text, stock, (row) => {
		const noDate = row.useBy === null || stock.useBy === null;
		return isSameRow(row, noDate ? { ...stock, useBy: row.useBy } : stock);
	});
}

function addInto(text: string, stock: Stock, fits: (row: Stock) => boolean): string {
	const stocks = readStocks(text);
	const at = stocks.findIndex(fits);
	const sum = at === -1 ? null : withAmount(stocks[at], valueOf(stocks[at]) + valueOf(stock));

	if (sum) stocks[at] = { ...sum, useBy: stocks[at].useBy ?? stock.useBy };
	else stocks.push(stock);
	return replaceStocks(text, stocks);
}
