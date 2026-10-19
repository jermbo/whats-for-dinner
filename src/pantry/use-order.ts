// The sequence in which the packages of a food item are used: the open package first, so that the
// carton with 4 eggs goes before a new carton. Then the first use-by date, and a package with no
// date is last. Then the row that is higher in the table.

import { measure } from '../units';
import { isEmpty } from './empty-row';
import type { Stock } from './types';

// A row of the note, with its number in the table, so that a change finds it.
export type Numbered = { stock: Stock; at: number };

// A package is open when it has less than its size.
export function isOpen(stock: Stock): boolean {
	if (!stock.amount || !stock.size || isEmpty(stock)) return false;
	return measure(stock.amount).value < measure(stock.size).value;
}

export function inUseOrder<T extends Numbered>(packages: T[]): T[] {
	return [...packages].sort(
		(a, b) =>
			Number(isOpen(b.stock)) - Number(isOpen(a.stock)) ||
			(a.stock.useBy ?? '9999').localeCompare(b.stock.useBy ?? '9999') ||
			a.at - b.at
	);
}
