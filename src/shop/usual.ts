// The amount that you usually buy of an item: the newest amount of its receipts in the unit of its
// food item. You buy the same box or bag each time, so the last purchase is the best guess, for the
// list and for put away.

import { levelOf } from '../pantry/level';
import type { FoodItem } from '../pantry/types';
import { parseAmount } from '../recipemd/amount';
import { measure, type Measure } from '../units';

// `amounts` are the amounts of the receipts of the item, with the newest first. Null: no receipt
// has an amount in the unit of the food item.
export function usualOf(item: FoodItem | null, amounts: string[]): string | null {
	return amounts.find((amount) => countsFor(item, amount)) ?? null;
}

// An amount in a different unit does not add to the level: "1" bag of oats does not add to grams,
// so the oats stay low after the trip. A food item that the pantry cannot count, and an item that
// is not in the pantry, take each amount.
export function countsFor(item: FoodItem | null, text: string): boolean {
	const kind = item ? levelOf(item)?.kind : undefined;
	return kind === undefined || measuresOf(text).some((part) => part.kind === kind);
}

// An amount with a plus, such as "1 can + 200 ml", is two quantities. A part with no number is none.
export function measuresOf(text: string): Measure[] {
	return text.split('+').flatMap((part) => {
		const amount = parseAmount(part.trim());
		return amount ? [measure(amount)] : [];
	});
}
