// The level of a food item: what the pantry has, and whether it is low. All places count together,
// because "low" is a fact of the food item, not of one shelf.

import { compares, measure, type Measure } from '../units';
import { withFood } from './empty-row';
import type { FoodItem, Stock } from './types';

// The values have one kind of measure, such as "mass". `full` is the sum of the package sizes.
export type Level = { kind: string; has: number; full: number; low: number; isLow: boolean };

// A rounding error of a sum must not make a package at 1/4 more than 1/4.
const EPSILON = 1e-9;

export function levelOf(item: FoodItem): Level | null {
	const counted = withFood(item.stocks).filter((stock) => stock.amount && stock.size);
	const kind = counted[0]?.amount ? measure(counted[0].amount).kind : undefined;
	if (kind === undefined) return null;

	const packages = counted.filter(
		(stock) => stock.amount && compares(measure(stock.amount).kind, kind)
	);
	const has = sum(packages.map((stock) => valueOf(stock.amount)));
	const full = sum(packages.map((stock) => valueOf(stock.size)));
	if (full <= 0) return null;

	const largest = Math.max(...packages.map((stock) => valueOf(stock.size)));
	// A second package is the reserve, so a food item with two packages is not low.
	const [only] = packages;
	const isLow =
		packages.length === 1 && valueOf(only.amount) <= valueOf(only.size) / 4 + EPSILON;
	return { kind, has, full, low: largest / 4, isLow };
}

const valueOf = (amount: Stock['amount']) => (amount ? measure(amount).value : 0);
const sum = (values: number[]) => values.reduce((all, value) => all + value, 0);

// What a staple on the list asks for: one package, with the size of the newest package. Null: the
// food item has no package that the plugin can count.
export function fillOf(item: FoodItem): Measure | null {
	const newest = withFood(item.stocks).filter((stock) => stock.size).at(-1);
	return newest?.size ? measure(newest.size) : null;
}

// The parts of the bar of one line, each as a part of all package sizes: the food in this place, the
// food in the other places, and 1/4 of the largest package.
export type Bar = { here: number; others: number; low: number; isLow: boolean };

// The amount of one row, in the kind of measure of the level. A row that does not compare has 0.
export function partOf(stock: Stock, level: Level): number {
	const own = stock.amount ? measure(stock.amount) : null;
	return own && compares(own.kind, level.kind) ? own.value : 0;
}

// The bar of a line: all packages of the food item in one place.
export function barOf(stocks: Stock[], level: Level | null): Bar | null {
	const here = level ? stocks.reduce((all, stock) => all + partOf(stock, level), 0) : 0;
	if (!level || here <= 0) return null;
	return {
		here: here / level.full,
		others: (level.has - here) / level.full,
		low: level.low / level.full,
		isLow: level.isLow
	};
}
