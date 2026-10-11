// Writes the rows of a food item into the text of its note. All other text of the note stays.

import { makeStock } from './food-item';
import { findTable, readTable } from './table';
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

// Adds one row. The rows come from the text, so two writes one after the other do not lose a row.
export function addStock(text: string, stock: Stock): string {
	const stocks = readTable(text)
		.filter((row) => row['place'])
		.map((row) => makeStock(row['place'], row['amount'] ?? '', row['use by'] ?? ''));
	return replaceStocks(text, [...stocks, stock]);
}
