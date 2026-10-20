// The facts of an item at put away: what goes into the pantry, and what you paid. You have them
// only in the moment in which you put the item away, so the screen of put away asks for them.
// The plugin proposes each fact that it knows, so that the usual item needs no entry.

import { addDays, daysBetween } from '../dates';
import type { Brand } from '../pantry/brands';
import { makeStock } from '../pantry/food-item';
import { brandAt, brandCell } from './bought-brand';
import { regularOfBrand, type RegularRow } from './brand-price';
import type { Stock } from '../pantry/types';
import type { LastRow } from './last-receipt';
import { readPrice, showPrice } from './price';
import type { ShoppingRow } from './shopping-list';
import { packagesOf } from './package-lines';
import { countsFor } from './usual';

export type Facts = {
	// The item goes into the pantry. Food of the pantry always does. An item of your own does when
	// you put "Into the pantry" on.
	intoPantry: boolean;
	amount: string;
	place: string;
	// The use-by date as year-month-day, or no text.
	useBy: string;
	// What you paid for one package, as you typed it.
	price: string;
	onSale: boolean;
	// The bought brand, as the cell of the receipt has it, or no text. Only the receipt keeps it.
	brand: string;
};

// One package of an item: its number among the rows of the item in the receipt, and its facts.
export type PackageStart = { at: number; start: Facts };

// An item of the cart on the screen of put away, with the facts that it starts with.
export type CartItem = {
	key: string;
	name: string;
	// The facts of one package, as the plugin proposes them.
	start: Facts;
	// The lines of the item: one for each package that is not in the pantry yet.
	lines: PackageStart[];
	// The amounts that one tap selects: the amount that the item starts with, and what you bought
	// before.
	amounts: string[];
	// The place comes from the setting "Place for new food", because the item has no row and no
	// receipt. It is the only place that the plugin guesses, so it needs your look.
	placeIsGuess: boolean;
	// The last receipt has an amount, a place, and a price, so the line needs no look.
	known: boolean;
	// The brands of its food item. Null: the item has no food item note.
	brands: Brand[] | null;
	// The regular rows of its receipts, the newest first, for the price of each brand.
	regulars: RegularRow[];
};

// What the plugin knows about an item of the cart, before you give its facts.
export type Known = {
	// The row of the item in the cart: its amount on the list, and its food item.
	row: ShoppingRow;
	// The link of the item goes into the pantry folder.
	inPantry: boolean;
	// The row of the item in its last receipt, or null.
	last: LastRow | null;
	// The brand after the link of its cart task, or no text.
	brand: string;
};

// The day, and the place of a food item that has no row.
type Now = { today: string; newPlace: string };

// The screen of put away opens with each fact filled in, so that you only check the line.
export function cartItemOf(known: Known, now: Now): CartItem {
	const { row, last } = known;
	const start = startFactsOf(known, now);
	const fits = (amount: string) => countsFor(row.food?.item ?? null, amount);
	const count = packagesOf(row.amount, lastSizeOf(known));
	return {
		key: row.key,
		name: row.name,
		start,
		lines: Array.from({ length: count }, (_, at) => ({ at, start })),
		amounts: [...new Set([start.amount, ...(last?.amounts ?? []).filter(fits)])].slice(0, 3),
		placeIsGuess: !last?.place && !row.food?.item.stocks[0]?.place,
		known: Boolean(last?.amounts.length && last.place && readPrice(last.regular) !== null),
		brands: row.food?.item.brands ?? null,
		regulars: last?.regulars ?? []
	};
}

// The last size: the amount of the newest receipt row, in the unit of the food item.
function lastSizeOf({ row, last }: Known): string | null {
	if (!last?.amount) return null;
	return countsFor(row.food?.item ?? null, last.amount) ? last.amount : null;
}

// The price of a line with this brand: the regular price of the brand, or of any brand.
export const priceOfBrand = (item: CartItem, brand: string) =>
	showPrice(regularOfBrand(item.regulars, item.brands ?? [], brand));

// A fact of the last receipt comes first: you usually buy the same package, for about the same
// price, and you put it in the same place. So a line starts with the last size, and with no last
// size, with the amount of the list row. An item always starts with an amount and a place, so
// that no line needs an entry before the button. A sale ends, so "Sale" starts off, and the
// price is the regular price of the brand.
function startFactsOf(known: Known, { today, newPlace }: Now): Facts {
	const { row, inPantry, last } = known;
	const brands = row.food?.item.brands ?? [];
	const brand = startBrandOf(brands, known.brand, last);
	return {
		intoPantry: inPantry,
		amount: lastSizeOf(known) || row.amount || row.food?.item.stocks.at(-1)?.sizeText || '1',
		place: last?.place || row.food?.item.stocks[0]?.place || newPlace,
		useBy: last ? useByAfter(last, today) : '',
		price: showPrice(regularOfBrand(last?.regulars ?? [], brands, brand)),
		onSale: false,
		brand
	};
}

// You took the brand in the store, so the cart task comes first. Then you usually buy the brand of
// the last time. A food item with one brand has that brand. A cell that is no brand of the food item
// counts as no brand.
function startBrandOf(brands: Brand[], task: string, last: LastRow | null): string {
	const named = [task, last?.brand ?? '']
		.map((cell) => brandAt(cell, brands))
		.find((at) => at !== null);
	const at = named ?? (brands.length === 1 ? 0 : null);
	return at === null ? '' : brandCell(brands[at]);
}

// The food gets the days that it had the last time: eggs that had 3 weeks get 3 weeks from today.
function useByAfter({ day, useBy }: LastRow, today: string): string {
	if (!useBy) return '';
	const days = daysBetween(day, useBy);
	// A date before the day of the trip is an error in the receipt. It gives no date.
	return days < 0 ? '' : addDays(today, days);
}

// The amount that goes into the pantry and into the receipt.
export const amountOf = (facts: Facts) => partsOf(facts).join(' + ');

// The rows that the item adds to its food item. An item that does not go into the pantry, such as
// batteries, adds none.
export function stocksOf(facts: Facts): Stock[] {
	if (!facts.intoPantry) return [];
	return partsOf(facts).map((part) => makeStock(facts.place, part, facts.useBy));
}

// An amount with a plus, such as "1 can + 200 ml", has two kinds of unit, so it is two amounts.
// A field with no text is 1, as an item with no amount on the list.
function partsOf(facts: Facts): string[] {
	const parts = facts.amount
		.split('+')
		.map((part) => part.trim())
		.filter(Boolean);
	return parts.length ? parts : ['1'];
}
