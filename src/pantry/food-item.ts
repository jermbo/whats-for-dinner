// Reads the note of a food item: the other names, the kind of a staple, "never ask", "check", and
// the purchase date are properties. The table has one row for each package, and the section "Brands"
// has the brands.

import { parseAmount } from '../recipemd/amount';
import type { Amount } from '../recipemd/types';
import { isCount, measure, showAmount } from '../units';
import { readBrands } from './brands';
import { levelText, nearestLevel, readLevel } from './left';
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
		staple: readKind(properties.staple),
		neverAsk: String(properties.suggest ?? '').trim().toLowerCase() === 'never',
		check: properties.check === true || String(properties.check).trim().toLowerCase() === 'true',
		size: typeof properties.size === 'string' || typeof properties.size === 'number' ? parseAmount(String(properties.size)) : null,
		bought: dateOf(properties.bought),
		stocks: readStocks(body)
	};
}

// A row of the table with no place is not a row of the pantry, and a row with nothing in `Left` is
// not a package.
export function readStocks(text: string): Stock[] {
	return readTable(text)
		.filter((row) => row['place'] && row['left'])
		.map((row) => {
			const sizeText = row['size'] ?? '';
			const amountText = amountOfLeft(row['left'] ?? '', parseAmount(sizeText));
			return makeStock(row['place'], amountText, row['use by'] ?? '', sizeText);
		});
}

// A level becomes its amount: 1/4 of 1 gal is "1/4 gal". A count, "0", and text such as "tap" stay.
function amountOfLeft(left: string, size: Amount | null): string {
	const level = readLevel(left);
	if (level === null) return left;
	return size && isMeasured(size) ? showAmount(size.factor * level, size.unit) : '';
}

const isMeasured = (amount: Amount) => !isCount(measure(amount).kind);

// `amountText` is an amount, such as "300 ml" from a form or a meal. A measured package keeps the
// nearest level of it, so the row says what the note says.
export function makeStock(place: string, amountText: string, useBy: string, sizeText = ''): Stock {
	const given = parseAmount(amountText);
	const size = sizeOf(given, parseAmount(sizeText));
	const { amount, left } = leftOf(given, size, amountText.trim());
	return {
		place: place.trim(),
		amount,
		amountText: amountText.trim(),
		left,
		size,
		sizeText: size?.text ?? '',
		useBy: DATE.test(useBy.trim()) ? useBy.trim() : null
	};
}

function leftOf(given: Amount | null, size: Amount | null, text: string) {
	if (!given) return { amount: null, left: text };
	if (!size) return { amount: given, left: text };
	const part = given.factor <= 0 ? 0 : measure(given).value / measure(size).value;

	if (!isMeasured(size)) {
		const count = Math.round(part * size.factor);
		return { amount: { factor: count, unit: size.unit, text: String(count) }, left: String(count) };
	}
	const level = nearestLevel(part);
	const factor = size.factor * level;
	const amount = { factor, unit: size.unit, text: showAmount(factor, size.unit) };
	return { amount, left: levelText(level) };
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

// A property can be one text or a list of texts.
function textList(value: unknown): string[] {
	const list = Array.isArray(value) ? value : [value];
	return list
		.filter((item): item is string => typeof item === 'string')
		.map((item) => item.trim())
		.filter(Boolean);
}
