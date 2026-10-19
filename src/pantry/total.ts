import {
	addTo,
	compares,
	isCount,
	isMetric,
	measure,
	sameUnit,
	showLike,
	showMeasure,
	type Measure
} from '../units';
import { changeRows, isEmpty, withFood } from './empty-row';
import { inUseOrder, isOpen } from './use-order';
import { withAmount } from './stock-amount';
import type { Stock } from './types';

// How much of a food item the pantry has, in one kind of measure. Grams count as millilitres.
export function available(stocks: Stock[], kind: string): number {
	return stocks
		.flatMap((stock) => (stock.amount ? [measure(stock.amount)] : []))
		.filter((quantity) => compares(quantity.kind, kind))
		.reduce((sum, quantity) => sum + quantity.value, 0);
}

// Adds the amounts of a food item. Kinds that do not compare stay apart: "1.5 kg + 2 bags". Rows
// with one unit keep it, as the packages say: "1 1/2 gal".
export function totalOf(stocks: Stock[]): string {
	const sums = new Map<string, number>();
	const units = new Map<string, (string | null)[]>();
	const noNumber: string[] = [];

	for (const stock of withFood(stocks)) {
		const { amount, amountText } = stock;
		if (!amount) {
			if (amountText) noNumber.push(amountText);
			continue;
		}
		const quantity = measure(amount);
		addTo(sums, quantity);
		units.set(quantity.kind, [...(units.get(quantity.kind) ?? []), amount.unit]);
	}

	const parts = [...sums].map(([kind, value]) => {
		const [unit, ...others] = units.get(kind) ?? [];
		const oneUnit = others.every((other) => sameUnit(other, unit ?? null));
		if (!oneUnit || isMetric(unit ?? null)) return showLabel({ kind, value });
		return showLike({ kind, value }, unit ?? null);
	});
	return [...parts, ...noNumber].join(' + ');
}

// A metric total as a label shows it: 425 g, and 3.2 kg with one decimal from 1000 g.
function showLabel({ kind, value }: Measure): string {
	if (kind !== 'mass' && kind !== 'volume') return showMeasure({ kind, value });
	const [small, large] = kind === 'mass' ? ['g', 'kg'] : ['ml', 'l'];
	if (value >= 1000) return `${Math.round(value / 100) / 10} ${large}`;
	return `${Math.round(value)} ${small}`;
}

// The first use-by date of a food item, or null. The date of an empty package does not count.
export function firstUseBy(stocks: Stock[]): string | null {
	const dates = withFood(stocks).flatMap((stock) => (stock.useBy ? [stock.useBy] : []));
	return dates.sort()[0] ?? null;
}

// Takes a quantity out of the packages of a food item, from as many as it needs, in the sequence of
// use. A package that gives all that it has is empty, and the write takes its row out.
export function takeOut(stocks: Stock[], need: Measure): Stock[] {
	const sequence = inUseOrder(stocks.map((stock, at) => ({ stock, at })));
	const changes: { at: number; stock: Stock }[] = [];
	let left = need.value;

	for (const { stock, at } of sequence) {
		if (left <= 0 || !stock.amount) continue;
		const has = measure(stock.amount);
		if (!compares(has.kind, need.kind) || has.value <= 0) continue;

		const taken = Math.min(left, has.value);
		left -= taken;
		changes.push({ at, stock: afterMeal(stock, has.value - taken) });
	}
	return changeRows(stocks, changes);
}

// A full package that gave food is 3/4 or less. Else a cup at a time rounds back to full, and the
// jug never changes.
function afterMeal(stock: Stock, value: number): Stock {
	const next = withAmount(stock, value);
	if (!next.size || isCount(measure(next.size).kind) || isOpen(next) || isEmpty(next)) return next;
	return withAmount(stock, measure(next.size).value * 0.75);
}
