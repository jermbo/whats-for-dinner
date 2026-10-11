import type { Stock } from './types';

// Adds the amounts of a food item. Amounts with different units stay apart: "500 g + 1 kg".
export function totalOf(stocks: Stock[]): string {
	const sums = new Map<string, number>();
	const noNumber: string[] = [];

	for (const { amount, amountText } of stocks) {
		if (amount) {
			const unit = amount.unit ?? '';
			sums.set(unit, (sums.get(unit) ?? 0) + amount.factor);
		} else if (amountText) {
			noNumber.push(amountText);
		}
	}

	const parts = [...sums].map(([unit, sum]) => `${Number(sum.toFixed(2))} ${unit}`.trim());
	return [...parts, ...noNumber].join(' + ');
}

// The first use-by date of a food item, or null.
export function firstUseBy(stocks: Stock[]): string | null {
	const dates = stocks.flatMap((stock) => (stock.useBy ? [stock.useBy] : []));
	return dates.sort()[0] ?? null;
}
