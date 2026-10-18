import type { FoodNote } from '../note';
import { cartItemOf, type CartItem, type Facts } from '../shop/facts';
import { lastRows } from '../shop/last-receipt';
import { pastDateRows } from '../shop/past-date';
import type { Receipt } from '../shop/read-receipt';
import { lineOf, type ReceiptLine } from '../shop/receipt';
import { isLineOf } from '../shop/receipt-line';
import { needsOf, shoppingList } from '../shop/shopping-list';
import { suggestionsOf } from '../shop/suggestions';
import { storeOrderOf } from '../shop/store-order';
import { storesOf } from '../shop/stores';
import { cartOf, isPantryItem, listOf, type TripItem } from '../shop/trip';
import type { Meal } from './types';

export function mealNeeds(meals: Meal[], pantryFolder: string) {
	return needsOf(
		meals.flatMap(({ cooked, entry }) =>
			cooked || !entry ? [] : [{ title: entry.recipe.title, ingredients: entry.match.ingredients }]
		),
		pantryFolder
	);
}

export function calculatedList(needs: ReturnType<typeof needsOf>, lowPercent: number, today: string) {
	return {
		missing: shoppingList(needs, lowPercent),
		past: pastDateRows(needs, today)
	};
}

export function receiptLineFor(
	active: { lines: ReceiptLine[] } | null,
	item: TripItem,
	pathOf: (link: string) => string
): ReceiptLine | undefined {
	return active?.lines.find((line) => isLineOf(line, item, pathOf));
}

export function cartItems(
	calculated: ReturnType<typeof calculatedList>,
	trip: TripItem[],
	foods: FoodNote[],
	receipts: Receipt[],
	pathOf: (link: string) => string,
	active: { lines: ReceiptLine[] } | null
) {
	const bought = lastRows(receipts, pathOf);
	const inCart = trip.filter((item) => !receiptLineFor(active, item, pathOf)?.done);
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
		const line = item && receiptLineFor(active, item, pathOf);
		return line ? { ...proposed, start: line.facts } : proposed;
	});
}

export function tripSuggestions(
	foods: FoodNote[],
	when: { today: string; soonDays: number; lowPercent: number },
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
