// The bar of a line in the Pantry part: one part for each package of the food item, in all places,
// so that two gallons of milk look like two gallons. The packages of the place of the line come
// first, and the screen makes them dark.

import { measure, sameUnit } from '../units';
import { isEmpty } from './empty-row';
import type { Stock } from './types';
import { inUseOrder } from './use-order';

// `fill` is what is left, from 0 to 1. `weight` is the length of the part against the others.
export type BarPart = { key: string; here: boolean; fill: number; weight: number };

export function barParts(stocks: Stock[], place: string): BarPart[] {
	const packages = stocks
		.map((stock, at) => ({ stock, at }))
		.filter(({ stock }) => stock.amount && stock.size && !isEmpty(stock));
	const here = inUseOrder(packages.filter(({ stock }) => stock.place === place));
	const others = inUseOrder(packages.filter(({ stock }) => stock.place !== place));
	// A part is as long as its size. With different units, such as 1 gal and 64 fl oz, the parts are
	// the same length, because a jug and a bottle are each one thing in your hand.
	const unit = packages[0]?.stock.size?.unit ?? null;
	const oneUnit = packages.every(({ stock }) => sameUnit(stock.size?.unit ?? null, unit));

	return [...here, ...others].map(({ stock, at }) => {
		const size = stock.size ? measure(stock.size).value : 0;
		const left = stock.amount ? measure(stock.amount).value : 0;
		return {
			key: String(at),
			here: stock.place === place,
			fill: size > 0 ? Math.min(1, Math.max(0, left / size)) : 0,
			weight: oneUnit ? size : 1
		};
	});
}
