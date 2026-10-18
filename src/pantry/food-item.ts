// Reads the note of a food item: the other names, the full amount, the low line, the kind of a
// staple, "never ask", "loose", and the purchase date are properties. The table has one row for
// each package, and the section "Brands" has the brands.

import { parseAmount } from '../recipemd/amount';
import type { Amount } from '../recipemd/types';
import { measure } from '../units';
import { readBrands } from './brands';
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
		brands: readBrands(body),
		full: amountOf(properties.full),
		low: amountOf(properties.low),
		staple: readKind(properties.staple),
		neverAsk: String(properties.suggest ?? '').trim().toLowerCase() === 'never',
		loose: properties.loose === true || String(properties.loose).trim().toLowerCase() === 'true',
		bought: dateOf(properties.bought),
		stocks: readStocks(body)
	};
}

// A row of the table with no place is not a row of the pantry.
export function readStocks(text: string): Stock[] {
	return readTable(text)
		.filter((row) => row['place'])
		.map((row) =>
			makeStock(row['place'], row['amount'] ?? '', row['use by'] ?? '', row['size'] ?? '')
		);
}

export function makeStock(place: string, amountText: string, useBy: string, sizeText = ''): Stock {
	const given = parseAmount(amountText);
	const size = sizeOf(given, parseAmount(sizeText));
	// "0" has no unit, but it is nothing of its package: 0 gal for a jug.
	const amount = given && given.factor <= 0 && size ? { ...given, factor: 0, unit: size.unit } : given;
	return {
		place: place.trim(),
		amount,
		amountText: amountText.trim(),
		size,
		sizeText: size?.text ?? '',
		useBy: DATE.test(useBy.trim()) ? useBy.trim() : null
	};
}

// Each row has a size, so that its bar has an end. A size that is missing, has no number, or does
// not compare gives the row its own amount as its size, and a package is never more than full.
function sizeOf(amount: Amount | null, size: Amount | null): Amount | null {
	if (!amount) return null;
	const hasSize = size !== null && size.factor > 0;
	if (amount.factor <= 0) return hasSize ? size : amount;
	if (!hasSize) return amount;
	const left = measure(amount);
	const full = measure(size);
	if (left.kind !== full.kind) return amount;
	return left.value > full.value ? amount : size;
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
