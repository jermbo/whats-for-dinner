// The lines of an item at put away: one for each package that you bought. The list asks for the
// amount that the meals need, and the pantry tells the packages, so put away divides the one by
// the other. You correct the number with one tap: "+ package" or "Not bought".

import { measure } from '../units';
import { parseAmount } from '../recipemd/amount';

// The number of lines: the amount of the list row divided by the last size, rounded up, and at
// least 1. With no last size, or with units that do not compare, it is 1 line.
export function packagesOf(listAmount: string, lastSize: string | null): number {
	const list = parseAmount(listAmount);
	const size = lastSize ? parseAmount(lastSize) : null;
	if (!list || !size || size.factor <= 0) return 1;
	const need = measure(list);
	const one = measure(size);
	if (need.kind !== one.kind) return 1;
	// "1.5 gal" and 1 gal is 2 lines, but a rounding error must not make 12 eggs 2 cartons.
	return Math.max(1, Math.ceil(need.value / one.value - 1e-9));
}

// A line of put away is one row of the receipt. Its key is the key of its item and its number
// among the rows of that item, so that the stage and the receipt find the same row.
export const lineKey = (item: string, at: number) => `${item}#${at}`;

export function partsOfLineKey(key: string): { item: string; at: number } {
	const cut = key.lastIndexOf('#');
	return { item: key.slice(0, cut), at: Number(key.slice(cut + 1)) };
}
