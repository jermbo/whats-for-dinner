import type { Amount } from './recipemd/types';

// A quantity that the plugin can add and compare. The kind is "mass" (in grams), "volume" (in
// millilitres), or a count of one unit, such as "count:can". A count with no unit is "count:".
export type Measure = { kind: string; value: number };

const GRAMS: Record<string, number> = {
	g: 1,
	gram: 1,
	kg: 1000,
	kilogram: 1000,
	oz: 28.35,
	ounce: 28.35,
	lb: 453.6,
	pound: 453.6
};

const MILLILITRES: Record<string, number> = {
	ml: 1,
	millilitre: 1,
	milliliter: 1,
	cl: 10,
	dl: 100,
	l: 1000,
	litre: 1000,
	liter: 1000,
	tsp: 5,
	teaspoon: 5,
	tbsp: 15,
	tablespoon: 15,
	cup: 240
};

// A count is in whole things, such as cans and eggs. Mass and volume are not.
export const isCount = (kind: string) => kind.startsWith('count:');

const round = (value: number) => String(Number(value.toFixed(2)));

// "2 cans" and "1 can" have the same unit. The screen shows the unit again, with `plural`.
function singular(word: string): string {
	if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
	if (/(ch|sh|x|ss|o)es$/.test(word)) return word.slice(0, -2);
	if (word.length > 2 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
	return word;
}

const plural = (word: string) => (/(ch|sh|x|ss|o)$/.test(word) ? `${word}es` : `${word}s`);

// The words that count things of one kind. "2 cans of beans" has a unit, and "2 eggs" has none.
// A count can have any word as its unit, so intake knows only these, to tell a unit from a name.
const COUNT_UNITS = new Set([
	'bag',
	'bottle',
	'box',
	'bunch',
	'can',
	'clove',
	'cube',
	'dash',
	'handful',
	'head',
	'jar',
	'pack',
	'package',
	'packet',
	'piece',
	'pinch',
	'sheet',
	'slice',
	'sprig',
	'stalk',
	'stick'
]);

// A word that is a unit, such as "g", "cups", or "cans". "pinches" is "pinch".
export function isUnit(word: string): boolean {
	const unit = singular(word.toLowerCase().replace(/\.$/, '').trim());
	return unit in GRAMS || unit in MILLILITRES || COUNT_UNITS.has(unit);
}

export function measure(amount: Amount): Measure {
	const unit = singular((amount.unit ?? '').toLowerCase().replace(/\.$/, '').trim());
	if (unit in GRAMS) return { kind: 'mass', value: amount.factor * GRAMS[unit] };
	if (unit in MILLILITRES) return { kind: 'volume', value: amount.factor * MILLILITRES[unit] };
	return { kind: `count:${unit}`, value: amount.factor };
}

export function showMeasure({ kind, value }: Measure): string {
	if (kind === 'mass') return value >= 1000 ? `${round(value / 1000)} kg` : `${round(value)} g`;
	if (kind === 'volume') return value >= 1000 ? `${round(value / 1000)} l` : `${round(value)} ml`;

	const unit = kind.slice('count:'.length);
	if (!unit) return round(value);
	return `${round(value)} ${value === 1 ? unit : plural(unit)}`;
}

// Adds a measure to the sums, with one sum for each kind.
export function addTo(sums: Map<string, number>, { kind, value }: Measure) {
	sums.set(kind, (sums.get(kind) ?? 0) + value);
}
