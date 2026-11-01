// When a step of put away ends the trip. The trip ends when no line of the cart is left to put
// away.

import type { CartItem } from './facts';
import { lineKey } from './package-lines';
import { isLineOf } from './receipt-line';
import type { ReceiptLine } from './receipt';
import type { TripItem } from './trip';

// Only the key and the lines of each item of the cart tell what is left.
type CartLines = Pick<CartItem, 'key'> & { lines: { at: number }[] };

const keysOf = (cart: CartLines[]) =>
	cart.flatMap((item) => item.lines.map(({ at }) => lineKey(item.key, at)));

// Put away of these lines leaves no line of the cart.
export function isAllPutAway(cart: CartLines[], given: Map<string, unknown>): boolean {
	return keysOf(cart).every((key) => given.has(key));
}

// "Not bought" of this line ends the trip, when it is the last line, and a different line is in the
// pantry already. With no line in the pantry, the trip is not a trip yet.
export function isLastNotBought(cart: CartLines[], key: string, hasPutAway: boolean): boolean {
	return hasPutAway && keysOf(cart).every((other) => other === key);
}

// The item has a second row in the receipt, so "Not bought" takes out only one row.
export function hasOtherLines(
	lines: ReceiptLine[],
	item: TripItem,
	pathOf: (link: string) => string
): boolean {
	return lines.filter((line) => isLineOf(line, item, pathOf)).length > 1;
}
