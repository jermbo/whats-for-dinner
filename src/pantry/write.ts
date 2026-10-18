// Writes the rows of a food item into the text of its note. All other text of the note stays.

import { measure } from '../units';
import { isEmpty } from './empty-row';
import { makeStock, readStocks } from './food-item';
import { amountText } from './stock-amount';
import { formatMarkdownTable, replaceTable } from './table';
import type { Stock } from './types';

const COLUMNS = ['Place', 'Amount', 'Size', 'Use by'];

export function showStocks(stocks: Stock[]): string {
	const rows = stocks.map((stock) => [
		stock.place,
		stock.amountText,
		stock.sizeText,
		stock.useBy ?? ''
	]);
	return formatMarkdownTable(COLUMNS, rows);
}

export function replaceStocks(text: string, stocks: Stock[]): string {
	return replaceTable(text, showStocks(stocks));
}

// A new package is a new row, or it takes the empty row of its place: the empty row is the slot of
// that place. It never adds to a row that has food, because each package has its own date. The
// rows come from the text, so two writes one after the other do not lose a row.
export function addPackage(text: string, stock: Stock): string {
	return replaceStocks(text, withPackage(readStocks(text), stock));
}

export function withPackage(stocks: Stock[], stock: Stock): Stock[] {
	const at = stocks.findIndex((row) => row.place === stock.place && isEmpty(row));
	return at === -1 ? [...stocks, stock] : stocks.map((row, index) => (index === at ? stock : row));
}

const kindOf = (stock: Stock) => (stock.amount ? measure(stock.amount).kind : null);
const valueOf = (stock: Stock) => (stock.amount ? measure(stock.amount).value : 0);

// Loose food has no packages: 6 apples go into the 2 apples of the fridge. The size of the row is
// its new amount, so its bar is full.
export function addLoose(text: string, stock: Stock): string {
	const stocks = readStocks(text);
	const at = stocks.findIndex(
		(row) => row.place === stock.place && kindOf(row) !== null && kindOf(row) === kindOf(stock)
	);
	if (at === -1) {
		stocks.push(stock);
		return replaceStocks(text, stocks);
	}
	const row = stocks[at];
	const sum = amountText(isEmpty(row) ? stock : row, valueOf(row) + valueOf(stock));
	// The date of an empty row does not count, so the new food gives its date.
	const useBy = isEmpty(row) ? stock.useBy : (row.useBy ?? stock.useBy);
	stocks[at] = makeStock(row.place, sum, useBy ?? '', sum);
	return replaceStocks(text, stocks);
}
