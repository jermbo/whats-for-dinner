// The lines of the receipt when the stage Put away opens. The receipt keeps the work, so a line
// that is done, or that is of an item that is still in the cart, stays. An item that left the cart
// loses its lines, and an item of the cart with no line gets its lines.

import type { ReceiptLine } from './receipt';
import { isAllDone, isLineOf } from './receipt-line';
import type { TripItem } from './trip';

// `linesOfItem` gives the lines that the stage proposes for an item. Null: the lines do not change.
export function startLines(
	lines: ReceiptLine[],
	trip: TripItem[],
	linesOfItem: (item: TripItem) => ReceiptLine[],
	pathOf: (link: string) => string
): ReceiptLine[] | null {
	const cart = trip.filter((item) => item.inCart && !isAllDone(lines, item, pathOf));
	const kept = lines.filter(
		(line) => line.done || cart.some((item) => isLineOf(line, item, pathOf))
	);
	const added = cart.filter((item) => !lines.some((line) => isLineOf(line, item, pathOf)));
	if (kept.length === lines.length && !added.length) return null;
	return [...kept, ...added.flatMap(linesOfItem)];
}
