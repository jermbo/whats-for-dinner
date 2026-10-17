// The order of a store: where each item was on the newest receipt of that store. You walk through a
// store in the same order each time, and a tap moves its task to the end of the open note, so the
// last receipt is the best map. No aisle to type, and no AI.

import type { Receipt } from './read-receipt';
import { keyOf } from './trip';

// The place of each item, by its key, as a part of the length of its receipt: 0 is the first row,
// and near 1 is the last. So a short receipt and a long receipt have one scale.
export function storeOrderOf(
	receipts: Receipt[],
	store: string,
	pathOf: (link: string) => string
): Map<string, number> {
	const order = new Map<string, number>();
	if (!store) return order;

	const ofStore = receipts
		.filter((receipt) => receipt.store === store && receipt.day)
		.sort((a, b) => (b.day ?? '').localeCompare(a.day ?? '') || b.name.localeCompare(a.name));
	for (const { rows } of ofStore) {
		rows.forEach((row, at) => {
			const key = keyOf(row, pathOf);
			if (!order.has(key)) order.set(key, at / rows.length);
		});
	}
	return order;
}
