// A row of the pantry after food went in or out.
//
// The row keeps its unit when the new amount is round in that unit: 2 kg less 300 g is "1.7 kg".
// If not, the amount is in grams or millilitres, so that a small amount is not lost: 1 kg less 4 g
// is "996 g", and not "1 kg" again.

import { isCount, measure } from '../units';
import { makeStock } from './food-item';
import type { Stock } from './types';

// A row shows 2 decimals. Less than this is nothing.
const NOTHING = 0.005;

const round = (value: number) => Number(value.toFixed(2));

// `value` is the new amount in the measure of the row: grams, millilitres, or a count. Null: the
// row has nothing left.
export function withAmount(stock: Stock, value: number): Stock | null {
	if (!stock.amount || value < NOTHING) return null;

	const { kind, value: perUnit } = measure({ ...stock.amount, factor: 1 });
	const inUnit = value / perUnit;
	const isRound = Math.abs(inUnit - round(inUnit)) < 1e-9;

	const text =
		isRound || isCount(kind)
			? `${round(inUnit)} ${stock.amount.unit ?? ''}`
			: `${round(value)} ${kind === 'mass' ? 'g' : 'ml'}`;
	return makeStock(stock.place, text, stock.useBy ?? '');
}
