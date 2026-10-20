import type { FoodNote } from '../note';
import { cartItemOf, type CartItem, type Facts } from '../shop/facts';
import { lastRows } from '../shop/last-receipt';
import type { Receipt } from '../shop/read-receipt';
import { lineOf, type ReceiptLine } from '../shop/receipt';
import { isAllDone, isLineOf } from '../shop/receipt-line';
import type { calculatedList } from '../shop/calculated-list';
import { suggestionsOf } from '../shop/suggestions';
import { storeOrderOf } from '../shop/store-order';
import { storesOf } from '../shop/stores';
import { cartOf, isPantryItem, listOf, type TripItem } from '../shop/trip';

export function cartItems(
	calculated: ReturnType<typeof calculatedList>,
	trip: TripItem[],
	foods: FoodNote[],
	receipts: Receipt[],
	pathOf: (link: string) => string,
	active: { lines: ReceiptLine[] } | null
) {
	const bought = lastRows(receipts, pathOf);
	const inCart = trip.filter((item) => !active || !isAllDone(active.lines, item, pathOf));
	return {
		bought,
		list: listOf(calculated, trip, foods, bought),
		cart: cartOf(calculated, inCart, foods, bought)
	};
}

export function putAwayCartItems(
	cart: ReturnType<typeof cartOf>,
	trip: TripItem[],
	bought: ReturnType<typeof lastRows>,
	pantryFolder: string,
	active: { lines: ReceiptLine[] } | null,
	pathOf: (link: string) => string,
	now: { today: string; newPlace: string }
): CartItem[] {
	return cart.map((row): CartItem => {
		const item = trip.find((item) => item.key === row.key);
		const inPantry = item !== undefined && isPantryItem(item, pantryFolder);
		const known = { row, inPantry, last: bought.get(row.key) ?? null, brand: item?.brand ?? '' };
		const proposed = cartItemOf(known, now);
		// The receipt keeps the work: once the item has rows, each row that is not done is a line.
		const rows = item && active ? active.lines.filter((line) => isLineOf(line, item, pathOf)) : [];
		if (!rows.length) return proposed;
		const lines = rows.flatMap((line, at) => (line.done ? [] : [{ at, start: line.facts }]));
		return { ...proposed, start: lines[0]?.start ?? proposed.start, lines };
	});
}

export function tripSuggestions(
	foods: FoodNote[],
	when: { today: string; soonDays: number },
	skipped: string[],
	trip: TripItem[],
	missingKeys: string[]
) {
	return suggestionsOf(foods, when, {
		hidden: new Set([...skipped, ...trip.map((item) => item.key), ...missingKeys])
	});
}

export function fallbackPutAwayFacts(
	item: TripItem,
	pantryFolder: string,
	newPlace: string
): Facts {
	const intoPantry = isPantryItem(item, pantryFolder);
	return {
		intoPantry,
		amount: '1',
		place: newPlace,
		useBy: '',
		price: '',
		onSale: false,
		brand: ''
	};
}

export { storesOf, storeOrderOf };
