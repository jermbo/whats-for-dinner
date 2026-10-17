import { keyOf, type TripItem } from './trip';
import type { ReceiptLine } from './receipt';

// A row of the receipt names its item by its link, as a task does. The row of an item of your own
// that went into the pantry links to its food item note, so it also finds its item by the name.
export function isLineOf(
	line: ReceiptLine,
	item: TripItem,
	pathOf: (link: string) => string
): boolean {
	return keyOf(line, pathOf) === item.key || line.name === item.name;
}
