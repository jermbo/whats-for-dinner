// Reads the note of a food item: the brands, the other names, the full amount, the low line, the
// kind of a staple, "never ask", and the purchase date are properties, and the table has one row for
// each place.

import { parseAmount } from '../recipemd/amount';
import { readKind } from './staple';
import { readTable } from './table';
import type { FoodItem, Stock } from './types';

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function readFoodItem(
	name: string,
	properties: Record<string, unknown>,
	body: string
): FoodItem {
	return {
		name,
		aliases: textList(properties.aliases),
		brands: textList(properties.brands),
		full: amountOf(properties.full),
		low: amountOf(properties.low),
		staple: readKind(properties.staple),
		neverAsk: String(properties.suggest ?? '').trim().toLowerCase() === 'never',
		bought: dateOf(properties.bought),
		stocks: readStocks(body)
	};
}

// A row of the table with no place is not a row of the pantry.
export function readStocks(text: string): Stock[] {
	return readTable(text)
		.filter((row) => row['place'])
		.map((row) => makeStock(row['place'], row['amount'] ?? '', row['use by'] ?? ''));
}

export function makeStock(place: string, amountText: string, useBy: string): Stock {
	return {
		place: place.trim(),
		amount: parseAmount(amountText),
		amountText: amountText.trim(),
		useBy: DATE.test(useBy.trim()) ? useBy.trim() : null
	};
}

const dateOf = (value: unknown) =>
	typeof value === 'string' && DATE.test(value.trim()) ? value.trim() : null;

// An amount can be text, such as "2 kg", or a number, such as 12.
function amountOf(value: unknown) {
	return typeof value === 'string' || typeof value === 'number' ? parseAmount(String(value)) : null;
}

// A property can be one text or a list of texts.
function textList(value: unknown): string[] {
	const list = Array.isArray(value) ? value : [value];
	return list
		.filter((item): item is string => typeof item === 'string')
		.map((item) => item.trim())
		.filter(Boolean);
}
