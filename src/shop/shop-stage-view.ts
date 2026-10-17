import { byMeal, byStore, isForMeal, isFound, type Only, type ShopGroup, type Sort } from './browse';
import type { ShoppingRow } from './shopping-list';

export function filterShopRows(
	needed: ShoppingRow[],
	find: string,
	only: Set<Only>,
	mixed: boolean
): ShoppingRow[] {
	const mealOnly = mixed && only.has('meal');
	const extraOnly = mixed && only.has('extra');
	return needed.filter(
		(row) =>
			isFound(row, find) && (!mealOnly || isForMeal(row)) && (!extraOnly || row.extra)
	);
}

export function shopListGroups(
	shown: ShoppingRow[],
	sort: Sort,
	hasOrder: boolean,
	storeOrder: Map<string, number>
): ShopGroup[] {
	if (sort === 'meal') return byMeal(shown);
	const rows = sort === 'store' && hasOrder ? byStore(shown, storeOrder) : shown;
	return [{ title: '', rows }];
}

export function shopHasMixedList(needed: ShoppingRow[]): boolean {
	return needed.some(isForMeal) && needed.some((row) => row.extra);
}

export function regularPriceSum(
	rows: ShoppingRow[],
	regularOf: (key: string) => string,
	readPrice: (text: string) => number | null
): number {
	return rows.reduce((sum, row) => sum + (readPrice(regularOf(row.key)) ?? 0), 0);
}

export function anyRegularPrice(
	rows: ShoppingRow[],
	regularOf: (key: string) => string,
	readPrice: (text: string) => number | null
): boolean {
	return rows.some((row) => readPrice(regularOf(row.key)) !== null);
}
