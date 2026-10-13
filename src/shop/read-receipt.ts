// Reads a receipt: a note of the shopping folder with a table that has the column "Item". The
// receipts are the history of your trips, and you can correct one by hand. So each cell is text,
// and the plugin finds each column by its name.

import { readTable } from '../pantry/table';
import { readItem, type Item } from './shopping-note';

// One row of a receipt. A cell with no text has no value.
export type ReceiptRow = Item & {
	amount: string;
	price: string;
	place: string;
	// The use-by date as year-month-day. Text that is not a date counts as no text.
	useBy: string;
};

export type Receipt = {
	// The name of the note. Two receipts of one day have their sequence from it.
	name: string;
	// The day of the trip as year-month-day. Null: the note has no date, and its name has none.
	day: string | null;
	// The store of the trip, or no text.
	store: string;
	rows: ReceiptRow[];
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const DATE_AT_START = /^\d{4}-\d{2}-\d{2}/;

// Null: the note is not a receipt.
export function readReceipt(
	name: string,
	properties: Record<string, unknown>,
	body: string
): Receipt | null {
	const table = readTable(body);
	if (!table.some((cells) => 'item' in cells)) return null;

	const rows = table.flatMap((cells): ReceiptRow[] => {
		const item = readItem(cells['item']);
		if (!item) return [];
		const useBy = cells['use by'] ?? '';
		return [
			{
				...item,
				amount: cells['amount'] ?? '',
				price: cells['price'] ?? '',
				place: cells['place'] ?? '',
				useBy: DATE.test(useBy) ? useBy : ''
			}
		];
	});
	return { name, day: dayOf(name, properties.date), store: textOf(properties.store), rows };
}

// You can give a receipt a different name, so the property comes first. A receipt that you wrote
// by hand can have only its name.
function dayOf(name: string, date: unknown): string | null {
	const text = textOf(date);
	return DATE.test(text) ? text : (DATE_AT_START.exec(name)?.[0] ?? null);
}

const textOf = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
