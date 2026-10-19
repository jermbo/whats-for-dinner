// The packages of an open line: one count for the sealed packages of each date, and one bar for
// each open package. A sealed package has nothing to drag, so it is a number, and you seldom need
// the date of each sealed can apart. But you open a line to set what is left, so a line with no
// open package shows its first sealed package as a bar.

import { isCount, isFraction, isMetric, measure, showAmount, showMeasure } from '../units';
import { isEmpty } from './empty-row';
import { makeStock } from './food-item';
import type { Stock } from './types';

// A row of the note, with its number in the table, so that a change finds it.
export type Package = { stock: Stock; at: number };

export type SealedCount = { useBy: string | null; ats: number[]; sizeText: string };

// The bar of one package. The numbers are in the unit of its size: 1 for a gallon jug.
export type PackageBar = {
	at: number;
	useBy: string | null;
	unit: string | null;
	size: number;
	left: number;
	step: number;
};

const byDate = (a: Package, b: Package) =>
	(a.stock.useBy ?? '9999').localeCompare(b.stock.useBy ?? '9999') || a.at - b.at;

const isSealed = ({ amount, size }: Stock) =>
	amount !== null && size !== null && measure(amount).value >= measure(size).value;

// Loose food has no packages, so its row is always a bar.
export function openLineOf(packages: Package[], loose: boolean) {
	const counted = packages.filter(({ stock }) => stock.amount && stock.size && !isEmpty(stock));
	const sorted = [...counted].sort(byDate);
	const sealed: SealedCount[] = [];
	for (const { stock, at } of sorted) {
		if (loose || !isSealed(stock)) continue;
		const count = sealed.find(
			(one) => one.useBy === stock.useBy && one.sizeText === stock.sizeText
		);
		if (count) count.ats.push(at);
		else sealed.push({ useBy: stock.useBy, ats: [at], sizeText: stock.sizeText });
	}
	const bars = sorted.filter(({ stock }) => loose || !isSealed(stock)).map(barOf);
	const first = sealed[0];
	if (!bars.length && first) {
		const one = sorted.find(({ at }) => at === first.ats[0]);
		if (one) bars.push(barOf(one));
		first.ats.shift();
		if (!first.ats.length) sealed.shift();
	}
	return { sealed, bars };
}

// A thumb on a phone hits about 40 stops on a bar. A round step gives "1.2 l", and not "1.42 l".
const STOPS = 40;
const ROUND = [0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000];

// The step of a bar, in the unit of its size. A metric step is round in grams or millilitres, so
// a jug of 3.79 l moves by 100 ml. A gallon moves by eighths, as its label reads.
export function stepOf(size: number, unit: string | null): number {
	const { kind, value: per } = measure({ factor: 1, unit, text: '' });
	if (isCount(kind)) return 1;
	if (isFraction(unit)) return 1 / 8;
	const scale = isMetric(unit) ? per : 1;
	const least = (size * scale) / STOPS;
	const round = ROUND.find((step) => step >= least && (step >= 1 || scale === 1)) ?? least;
	return round / scale;
}

// An amount of a bar as the label shows it: 300 ml, and not 0.3 l. Other units keep the unit of
// the package, with eighths as fractions.
export function showLeft(value: number, unit: string | null): string {
	if (!isMetric(unit)) return showAmount(value, unit);
	const { kind, value: per } = measure({ factor: 1, unit, text: '' });
	return showMeasure({ kind, value: value * per });
}

export function barOf({ stock, at }: Package): PackageBar {
	const unit = stock.size?.unit ?? null;
	const size = stock.size?.factor ?? 0;
	// The amount can be in a different unit of the size, such as millilitres after a meal.
	const per = measure({ factor: 1, unit, text: '' }).value;
	const left = stock.amount ? measure(stock.amount).value / per : 0;
	return { at, useBy: stock.useBy, unit, size, left: clean(left), step: stepOf(size, unit) };
}

const clean = (value: number) => Number(value.toFixed(6));

// The nearest step, and the middle of two steps goes up. Never less than 0, or more than the size.
export function snap(value: number, bar: PackageBar): number {
	const steps = Math.floor(value / bar.step + 0.5);
	return clean(Math.max(0, Math.min(bar.size, steps * bar.step)));
}

// The row of a bar after a drag: at 0 it is an empty row, and at its size it is sealed.
export function stockAt(stock: Stock, bar: PackageBar, left: number): Stock {
	const text = left > 0 ? showLeft(left, bar.unit) : '0';
	return makeStock(stock.place, text, stock.useBy ?? '', stock.sizeText);
}

// One more sealed package, with the size and the date of `like`.
export const sealedLike = (like: Stock, useBy: string | null = like.useBy) =>
	makeStock(like.place, like.sizeText, useBy ?? '', like.sizeText);

// "Add package" copies the last package of the place: the row with the newest date, or with no
// date, the last row of the table.
export function lastPackage(stocks: Stock[], place: string): Stock | null {
	const here = stocks.filter((stock) => stock.place === place && stock.size);
	const dated = here.filter((stock) => stock.useBy).sort((a, b) => (a.useBy ?? '').localeCompare(b.useBy ?? ''));
	return dated.at(-1) ?? here.at(-1) ?? null;
}
