import { addTo, measure, showMeasure, type Measure } from '../units';
import { withAmount } from './stock-amount';
import type { Stock } from './types';

// How much of a food item the pantry has, in one kind of measure.
export function available(stocks: Stock[], kind: string): number {
	return stocks
		.flatMap((stock) => (stock.amount ? [measure(stock.amount)] : []))
		.filter((quantity) => quantity.kind === kind)
		.reduce((sum, quantity) => sum + quantity.value, 0);
}

// Adds the amounts of a food item. Kinds that do not compare stay apart: "1.5 kg + 2 bags".
export function totalOf(stocks: Stock[]): string {
	const sums = new Map<string, number>();
	const noNumber: string[] = [];

	for (const { amount, amountText } of stocks) {
		if (amount) addTo(sums, measure(amount));
		else if (amountText) noNumber.push(amountText);
	}

	const parts = [...sums].map(([kind, value]) => showMeasure({ kind, value }));
	return [...parts, ...noNumber].join(' + ');
}

// The first use-by date of a food item, or null.
export function firstUseBy(stocks: Stock[]): string | null {
	const dates = stocks.flatMap((stock) => (stock.useBy ? [stock.useBy] : []));
	return dates.sort()[0] ?? null;
}

// Takes a quantity out of the rows of a food item. The row with the first use-by date goes first.
export function takeOut(stocks: Stock[], need: Measure): Stock[] {
	const sequence = stocks
		.map((stock, at) => ({ stock, at }))
		.sort((a, b) => (a.stock.useBy ?? '9999').localeCompare(b.stock.useBy ?? '9999'));
	const result: (Stock | null)[] = [...stocks];
	let left = need.value;

	for (const { stock, at } of sequence) {
		if (left <= 0 || !stock.amount) continue;
		const has = measure(stock.amount);
		if (has.kind !== need.kind || has.value <= 0) continue;

		const taken = Math.min(left, has.value);
		left -= taken;
		result[at] = withAmount(stock, has.value - taken);
	}
	return result.filter((stock) => stock !== null);
}
