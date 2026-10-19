// Writes the packages of a food item into the text of its note. All other text of the note stays.

import { isEmpty } from './empty-row';
import { readStocks } from './food-item';
import { formatMarkdownTable, replaceTable } from './table';
import type { Stock } from './types';

const COLUMNS = ['Place', 'Left', 'Size', 'Use by'];

// A package with nothing left is not a package, so its row goes out.
export function showStocks(stocks: Stock[]): string {
	const rows = stocks
		.filter((stock) => !isEmpty(stock))
		.map((stock) => [stock.place, stock.left, stock.sizeText, stock.useBy ?? '']);
	return formatMarkdownTable(COLUMNS, rows);
}

export function replaceStocks(text: string, stocks: Stock[]): string {
	return replaceTable(text, showStocks(stocks));
}

// A new package is a new row. It never adds to a row that has food, because each package has its
// own date: 6 apples are a package of 6 next to the 2 that you have. The rows come from the text,
// so two writes one after the other do not lose a row.
export function addPackage(text: string, stock: Stock): string {
	return replaceStocks(text, withPackage(readStocks(text), stock));
}

export const withPackage = (stocks: Stock[], stock: Stock): Stock[] => [...stocks, stock];
