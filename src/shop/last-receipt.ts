// The last receipt of an item is the newest receipt with a row for it. It tells what you bought
// and what you paid the last time, and the screen of put away starts from it.

import type { Receipt, ReceiptRow } from './read-receipt';
import { keyOf } from './trip';

// A row of a receipt, with the day of its trip.
export type LastRow = ReceiptRow & { day: string };

// The last row of each item, by the key of the item. `pathOf` gives the note that a link goes to,
// so that a row finds its item as a task of the shopping note does.
export function lastRows(
	receipts: Receipt[],
	pathOf: (link: string) => string
): Map<string, LastRow> {
	const rows = new Map<string, LastRow>();
	// From the oldest receipt to the newest, so that a newer row replaces an older one.
	for (const { day, rows: ofTrip } of oldestFirst(receipts)) {
		for (const row of ofTrip) rows.set(keyOf(row, pathOf), { ...row, day });
	}
	return rows;
}

// A receipt with no day has no place in the sequence.
function oldestFirst(receipts: Receipt[]) {
	return receipts
		.flatMap((receipt) => (receipt.day ? [{ ...receipt, day: receipt.day }] : []))
		.sort((a, b) => a.day.localeCompare(b.day) || a.name.localeCompare(b.name));
}
