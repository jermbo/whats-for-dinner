// The stores of your trips: each store that a receipt has, from A to Z. One tap on the screen of
// put away then gives the store of a trip, and a price tells where you paid it.

import type { Receipt } from './read-receipt';

export function storesOf(receipts: Receipt[]): string[] {
	const stores = new Set(receipts.map(({ store }) => store).filter(Boolean));
	return [...stores].sort((a, b) => a.localeCompare(b));
}
