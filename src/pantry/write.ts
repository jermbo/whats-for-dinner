// Writes the rows of a food item into the text of its note. All other text of the note stays.

import { measure } from '../units';
import { readStocks } from './food-item';
import { withAmount } from './stock-amount';
import { findTable } from './table';
import type { Stock } from './types';

const COLUMNS = ['Place', 'Amount', 'Use by'];

export function showStocks(stocks: Stock[]): string {
	const rows = stocks.map((stock) => [stock.place, stock.amountText, stock.useBy ?? '']);
	const widths = COLUMNS.map((column, at) =>
		Math.max(column.length, ...rows.map((row) => row[at].length))
	);
	const line = (cells: string[]) =>
		`| ${cells.map((cell, at) => cell.padEnd(widths[at])).join(' | ')} |`;

	return [line(COLUMNS), line(widths.map((width) => '-'.repeat(width))), ...rows.map(line)].join(
		'\n'
	);
}

export function replaceStocks(text: string, stocks: Stock[]): string {
	const lines = text.split(/\r?\n/);
	const table = findTable(lines);
	if (!table) return `${text.trimEnd()}\n\n${showStocks(stocks)}\n`.trimStart();

	lines.splice(table.start, table.end - table.start, showStocks(stocks));
	return lines.join('\n');
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
	const stocks = readStocks(text);
	const at = stocks.findIndex((row) => isSameRow(row, stock));
	const sum = at === -1 ? null : withAmount(stocks[at], valueOf(stocks[at]) + valueOf(stock));

	if (sum) stocks[at] = sum;
	else stocks.push(stock);
	return replaceStocks(text, stocks);
}
