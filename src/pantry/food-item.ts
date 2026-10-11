// Reads the note of a food item: the brands are a property, and the table has one row for each place.

import { parseAmount } from '../recipemd/amount';
import { readTable } from './table';
import type { FoodItem, Stock } from './types';

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function readFoodItem(
	name: string,
	properties: Record<string, unknown>,
	body: string
): FoodItem {
	return { name, brands: textList(properties.brands), stocks: readStocks(body) };
}

function readStocks(body: string): Stock[] {
	return readTable(body)
		.filter((row) => row['place'])
		.map((row) => {
			const amountText = row['amount'] ?? '';
			const useBy = row['use by'] ?? '';
			return {
				place: row['place'],
				amount: parseAmount(amountText),
				amountText,
				useBy: DATE.test(useBy) ? useBy : null
			};
		});
}

// A property can be one text or a list of texts.
function textList(value: unknown): string[] {
	const list = Array.isArray(value) ? value : [value];
	return list
		.filter((item): item is string => typeof item === 'string')
		.map((item) => item.trim())
		.filter(Boolean);
}
