// The facts of an item at put away: what goes into the pantry, and what you paid. You have them
// only in the moment in which you put the item away, so the screen of put away asks for them.
// The plugin proposes each fact that it knows, so that the usual item needs no entry.

import { addDays, daysBetween } from '../dates';
import { makeStock } from '../pantry/food-item';
import type { Stock } from '../pantry/types';
import type { LastRow } from './last-receipt';
import { readPrice, showPrice } from './price';
import type { ShoppingRow } from './shopping-list';
import { countsFor } from './usual';

export type Facts = {
	// The item goes into the pantry. Food of the pantry always does. An item of your own does when
	// you put "Into the pantry" on.
	intoPantry: boolean;
	amount: string;
	place: string;
	// The use-by date as year-month-day, or no text.
	useBy: string;
	// What you paid for the full amount, as you typed it.
	price: string;
	onSale: boolean;
};

// An item of the cart on the screen of put away, with the facts that it starts with.
export type CartItem = {
	key: string;
	name: string;
	start: Facts;
	// The amounts that one tap selects: the amount that the item starts with, and what you bought
	// before.
	amounts: string[];
	// The place comes from the setting "Place for new food", because the item has no row and no
	// receipt. It is the only place that the plugin guesses, so it needs your look.
	placeIsGuess: boolean;
	// The last receipt has an amount, a place, and a price, so the line needs no look.
	known: boolean;
};

// What the plugin knows about an item of the cart, before you give its facts.
export type Known = {
	// The row of the item in the cart: its amount on the list, and its food item.
	row: ShoppingRow;
	// The link of the item goes into the pantry folder.
	inPantry: boolean;
	// The row of the item in its last receipt, or null.
	last: LastRow | null;
};

// The day, and the place of a food item that has no row.
type Now = { today: string; newPlace: string };

// The screen of put away opens with each fact filled in, so that you only check the line.
export function cartItemOf(known: Known, now: Now): CartItem {
	const { row, last } = known;
	const start = startFactsOf(known, now);
	const fits = (amount: string) => countsFor(row.food?.item ?? null, amount);
	return {
		key: row.key,
		name: row.name,
		start,
		amounts: [...new Set([start.amount, ...(last?.amounts ?? []).filter(fits)])].slice(0, 3),
		placeIsGuess: !last?.place && !row.food?.item.stocks[0]?.place,
		known: Boolean(last?.amounts.length && last.place && readPrice(last.regular) !== null)
	};
}

// A fact of the last receipt comes first: you usually buy the same amount, for about the same
// price, and you put it in the same place. The row of the cart already has the amount that you
// usually buy, so put away and the list agree. An item always starts with an amount and a place, so
// that no line needs an entry before the button. A sale ends, so "Sale" starts off, and the
// price is the regular price.
function startFactsOf({ row, inPantry, last }: Known, { today, newPlace }: Now): Facts {
	return {
		intoPantry: inPantry,
		amount: row.amount || row.food?.item.full?.text || '1',
		place: last?.place || row.food?.item.stocks[0]?.place || newPlace,
		useBy: last ? useByAfter(last, today) : '',
		price: showPrice(last?.regular ?? ''),
		onSale: false
	};
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

// The rows that the item adds to its food item.
export function stocksOf(facts: Facts): Stock[] {
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
