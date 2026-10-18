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

// The numbers of the rows of an item in the table, in their sequence. A row is one package, so an
// item can have more than one.
export function rowsOf(
	lines: ReceiptLine[],
	item: TripItem,
	pathOf: (link: string) => string
): number[] {
	return lines.flatMap((line, index) => (isLineOf(line, item, pathOf) ? [index] : []));
}

// An item is out of the cart when each of its rows is in the pantry.
export function isAllDone(
	lines: ReceiptLine[],
	item: TripItem,
	pathOf: (link: string) => string
): boolean {
	const rows = rowsOf(lines, item, pathOf);
	return rows.length > 0 && rows.every((index) => lines[index].done);
}
