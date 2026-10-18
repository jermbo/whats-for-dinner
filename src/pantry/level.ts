// The level of a food item: what the pantry has, against the full amount and the low line. All
// places count together, because "low" is a fact of the food item, not of one shelf.

import { compares, measure, showLike, type Measure } from '../units';
import { available } from './total';
import type { FoodItem, Stock } from './types';

// With no low line of your own, the line is at this percentage of the full amount. The settings
// can give a different percentage.
const LOW_PERCENT = 25;

// The three values have one kind of measure, such as "mass".
export type Level = { kind: string; has: number; full: number; low: number; isLow: boolean };

export function levelOf(item: FoodItem, lowPercent = LOW_PERCENT): Level | null {
	const fullSet = item.full ? measure(item.full) : null;
	const kinds = item.stocks.flatMap((stock) => (stock.amount ? [measure(stock.amount).kind] : []));
	const kind = fullSet?.kind ?? kinds[0];
	if (kind === undefined) return null;
	// The full amount is "2 kg" and the rows are "3 bags": the plugin cannot count this food item.
	if (kinds.length && !kinds.some((one) => compares(one, kind))) return null;

	const has = available(item.stocks, kind);
	// The pantry can have more than it had before. Then that amount is the full amount.
	const full = Math.max(fullSet?.value ?? 0, has);
	if (full <= 0) return null;

	const lowSet = item.low ? measure(item.low) : null;
	const low =
		lowSet && compares(lowSet.kind, kind)
			? Math.min(lowSet.value, full)
			: (full * lowPercent) / 100;
	// Food at its low line is low: the line is where you want more.
	return { kind, has, full, low, isLow: has <= low };
}

// What makes a food item full again: the full amount less what the pantry has. Null: the food
// item is full, or the plugin cannot count it.
export function fillOf(item: FoodItem): Measure | null {
	const level = levelOf(item);
	if (!level || level.has >= level.full) return null;
	return { kind: level.kind, value: level.full - level.has };
}

// The parts of the bar of one line, each as a part of the full amount: the food in this place, the
// food in the other places, and the low line.
export type Bar = { here: number; others: number; low: number; isLow: boolean };

// The amount of one row, in the kind of measure of the level. A row that does not compare has 0.
export function partOf(stock: Stock, level: Level): number {
	const own = stock.amount ? measure(stock.amount) : null;
	return own && compares(own.kind, level.kind) ? own.value : 0;
}

// The bar of a line: all packages of the food item in one place.
export function barOf(stocks: Stock[], level: Level | null): Bar | null {
	const here = level ? stocks.reduce((sum, stock) => sum + partOf(stock, level), 0) : 0;
	if (!level || here <= 0) return null;
	return {
		here: here / level.full,
		others: (level.has - here) / level.full,
		low: level.low / level.full,
		isLow: level.isLow
	};
}

// The full amount to write after a change of the rows: the most that the pantry had of the food.
// Null when the note has that amount already.
export function fullAfter(item: FoodItem, stocks: Stock[]): Measure | null {
	const levels = [levelOf(item), levelOf({ ...item, stocks })].filter((level) => level !== null);
	const kind = levels.at(-1)?.kind;
	if (kind === undefined) return null;

	const most = Math.max(...levels.filter((level) => level.kind === kind).map((level) => level.full));
	// The note has the amount as round text, such as "1.23 kg". A difference that small is no change.
	const set = item.full ? measure(item.full) : null;
	return set?.kind === kind && set.value >= most * 0.99 ? null : { kind, value: most };
}

// The text of the full amount to write, in the unit of the note: "2 1/2 gal", and not "9.46 l".
export function fullTextAfter(item: FoodItem, stocks: Stock[]): string | null {
	const full = fullAfter(item, stocks);
	if (!full) return null;
	const unit = item.full?.unit ?? stocks.find((stock) => stock.amount?.unit)?.amount?.unit ?? null;
	return showLike(full, unit);
}
