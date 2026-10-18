import { addTo, measure, sameUnit, showLike, showMeasure, type Measure } from '../units';
import { changeRows, isEmpty, withFood } from './empty-row';
import { withAmount } from './stock-amount';
import type { Stock } from './types';

// How much of a food item the pantry has, in one kind of measure.
export function available(stocks: Stock[], kind: string): number {
	return stocks
		.flatMap((stock) => (stock.amount ? [measure(stock.amount)] : []))
		.filter((quantity) => quantity.kind === kind)
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
		return oneUnit ? showLike({ kind, value }, unit ?? null) : showMeasure({ kind, value });
	});
	return [...parts, ...noNumber].join(' + ');
}

// The first use-by date of a food item, or null. The date of an empty row does not count.
export function firstUseBy(stocks: Stock[]): string | null {
	const dates = withFood(stocks).flatMap((stock) => (stock.useBy ? [stock.useBy] : []));
	return dates.sort()[0] ?? null;
}

// A package is open when it has less than its size, so it goes before a sealed package.
export function isOpen(stock: Stock): boolean {
	if (!stock.amount || !stock.size || isEmpty(stock)) return false;
	return measure(stock.amount).value < measure(stock.size).value;
}

// The packages give in this sequence: the first use-by date first, and a package with no date
// last. With the same date, the open package first, and then the row that is higher in the table.
function giveOrder(a: { stock: Stock; at: number }, b: { stock: Stock; at: number }): number {
	const byDate = (a.stock.useBy ?? '9999').localeCompare(b.stock.useBy ?? '9999');
	const byState = Number(isOpen(b.stock)) - Number(isOpen(a.stock));
	return byDate || byState || a.at - b.at;
}

// Takes a quantity out of the packages of a food item, from as many as it needs. A package that
// gives all that it has is an empty row.
export function takeOut(stocks: Stock[], need: Measure): Stock[] {
	const sequence = stocks.map((stock, at) => ({ stock, at })).sort(giveOrder);
	const changes: { at: number; stock: Stock }[] = [];
	let left = need.value;

	for (const { stock, at } of sequence) {
		if (left <= 0 || !stock.amount) continue;
		const has = measure(stock.amount);
		if (has.kind !== need.kind || has.value <= 0) continue;

		const taken = Math.min(left, has.value);
		left -= taken;
		changes.push({ at, stock: withAmount(stock, has.value - taken) });
	}
	return changeRows(stocks, changes);
}
