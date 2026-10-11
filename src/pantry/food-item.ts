// Reads the note of a food item: the brands and the other names are properties, and the table has
// one row for each place.

import { parseAmount } from '../recipemd/amount';
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
		stocks: readTable(body)
			.filter((row) => row['place'])
			.map((row) => makeStock(row['place'], row['amount'] ?? '', row['use by'] ?? ''))
	};
}

export function makeStock(place: string, amountText: string, useBy: string): Stock {
	return {
		place: place.trim(),
		amount: parseAmount(amountText),
		amountText: amountText.trim(),
		useBy: DATE.test(useBy.trim()) ? useBy.trim() : null
	};
}

// A property can be one text or a list of texts.
function textList(value: unknown): string[] {
	const list = Array.isArray(value) ? value : [value];
	return list
		.filter((item): item is string => typeof item === 'string')
		.map((item) => item.trim())
		.filter(Boolean);
}
