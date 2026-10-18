// A row of the pantry after food went in or out.
//
// The row keeps its unit when the new amount is round in that unit: 2 kg less 300 g is "1.7 kg",
// and 1 gal less 1/8 gal is "7/8 gal". If not, the amount is in grams or millilitres, so that a
// small amount is not lost: 1 kg less 4 g is "996 g", and not "1 kg" again.

import { isCount, isRoundIn, measure, showAmount } from '../units';
import { makeStock } from './food-item';
import type { Stock } from './types';

// A row shows 2 decimals. Less than this is nothing.
const NOTHING = 0.005;

// `value` is the new amount in the measure of the row: grams, millilitres, or a count. The row
// keeps its place, its size, and its date. With nothing left, it is an empty row.
export function withAmount(stock: Stock, value: number): Stock {
	return makeStock(stock.place, amountText(stock, value), stock.useBy ?? '', stock.sizeText);
}

// The text of an amount in the unit of the row, or in grams or millilitres.
export function amountText(stock: Stock, value: number): string {
	const unit = stock.amount?.unit ?? stock.size?.unit ?? null;
	if (!stock.amount || value < NOTHING) return '0';

	const { kind, value: perUnit } = measure({ factor: 1, unit, text: '' });
	const inUnit = value / perUnit;
	if (isCount(kind) || isRoundIn(inUnit, unit)) return showAmount(inUnit, unit);
	return showAmount(value, kind === 'mass' ? 'g' : 'ml');
}
