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

type ActiveReceipt = { lines: ReceiptLine[] } | null;

export type TripSources = {
	trip: TripItem[];
	foods: FoodNote[];
	receipts: Receipt[];
	active: ActiveReceipt;
	pathOf: (link: string) => string;
};

export function cartItems(
	calculated: ReturnType<typeof calculatedList>,
	{ trip, foods, receipts, active, pathOf }: TripSources
) {
	const bought = lastRows(receipts, pathOf);
	const inCart = trip.filter((item) => !active || !isAllDone(active.lines, item, pathOf));
	return {
		bought,
		list: listOf(calculated, trip, foods, bought),
		cart: cartOf(calculated, inCart, foods, bought)
	};
}

export type PutAwaySources = Pick<TripSources, 'trip' | 'active' | 'pathOf'> & {
	bought: ReturnType<typeof lastRows>;
	pantryFolder: string;
	now: { today: string; newPlace: string };
};

export function putAwayCartItems(
	cart: ReturnType<typeof cartOf>,
	{ trip, bought, pantryFolder, active, pathOf, now }: PutAwaySources
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

// A food that you skipped, or that is on the trip or on the list already, is no suggestion.
export type NotSuggested = { skipped: string[]; trip: TripItem[]; missingKeys: string[] };

export function tripSuggestions(
	foods: FoodNote[],
	when: { today: string; soonDays: number },
	{ skipped, trip, missingKeys }: NotSuggested
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
