// The last receipt of an item is the newest receipt with a row for it. It tells what you bought
// and what you paid the last time, and the screen of put away starts from it.

import { readPrice } from './price';
import type { Receipt, ReceiptRow } from './read-receipt';
import { keyOf } from './trip';

// A row of a receipt, with the day of its trip and what the older rows of the item tell.
export type LastRow = ReceiptRow & {
	day: string;
	// The price of the newest row with a price and no sale mark, or no text. A sale ends, so the
	// price of a sale is not the price that you can expect at the next trip.
	regular: string;
	// The amounts of the rows of the item, with the newest first, each one time.
	amounts: string[];
};

// The last row of each item, by the key of the item. `pathOf` gives the note that a link goes to,
// so that a row finds its item as a task of the shopping note does.
export function lastRows(
	receipts: Receipt[],
	pathOf: (link: string) => string
): Map<string, LastRow> {
	const rows = new Map<string, LastRow>();
	// From the oldest receipt to the newest, so that a newer row replaces an older one.
	for (const { day, rows: ofTrip } of oldestFirst(receipts)) {
		for (const row of ofTrip) {
			const key = keyOf(row, pathOf);
			const older = rows.get(key);
			const isRegular = !row.onSale && readPrice(row.price) !== null;
			rows.set(key, {
				...row,
				day,
				regular: isRegular ? row.price : (older?.regular ?? ''),
				amounts: [...new Set([row.amount, ...(older?.amounts ?? [])])].filter(Boolean)
			});
		}
	}
	return rows;
}

// A receipt with no day has no place in the sequence.
function oldestFirst(receipts: Receipt[]) {
	return receipts
		.flatMap((receipt) => (receipt.day ? [{ ...receipt, day: receipt.day }] : []))
		.sort((a, b) => a.day.localeCompare(b.day) || a.name.localeCompare(b.name));
}
