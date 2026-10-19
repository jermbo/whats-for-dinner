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

const GALLON = 3785.41;

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
	cup: 240,
	// The American volumes are parts of one gallon, so that 4 qt is 1 gal. The gallon is close,
	// not exact: "close is good" for a jug in the fridge.
	'fl oz': GALLON / 128,
	'fluid ounce': GALLON / 128,
	pt: GALLON / 8,
	pint: GALLON / 8,
	qt: GALLON / 4,
	quart: GALLON / 4,
	gal: GALLON,
	gallon: GALLON
};

// You read these units in fractions on the package: "3/8 gal", and not "0.38 gal".
const FRACTION_UNITS = new Set([
	'gal',
	'gallon',
	'qt',
	'quart',
	'pt',
	'pint',
	'cup',
	'tsp',
	'teaspoon',
	'tbsp',
	'tablespoon'
]);

// Units that are not metric. A row in one of them keeps it in a total, because "112.5 oz" is what
// the cans say, and "3.19 kg" is not.
const METRIC = new Set([
	'g',
	'gram',
	'kg',
	'kilogram',
	'ml',
	'millilitre',
	'milliliter',
	'cl',
	'dl',
	'l',
	'litre',
	'liter'
]);

export const isMetric = (unit: string | null) => METRIC.has(unitKey(unit ?? ''));

export const isFraction = (unit: string | null) => FRACTION_UNITS.has(unitKey(unit ?? ''));

// A count is in whole things, such as cans and eggs. Mass and volume are not.
export const isCount = (kind: string) => kind.startsWith('count:');

// A spoon of sugar must count against a bag in grams. 1 ml is 1 g for each food: rough, but always
// the same, and a cook does not weigh a spoon. So a mass and a volume compare with no calculation.
export const compares = (a: string, b: string) => a === b || (!isCount(a) && !isCount(b));

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

// "Fl. oz." and "fl  oz" are "fl oz", and "Cups" is "cup".
const unitKey = (unit: string) =>
	singular(unit.toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim());

// A word that is a unit, such as "g", "cups", or "cans". "pinches" is "pinch".
export function isUnit(word: string): boolean {
	const unit = unitKey(word);
	return unit in GRAMS || unit in MILLILITRES || COUNT_UNITS.has(unit);
}

export function measure(amount: Amount): Measure {
	const unit = unitKey(amount.unit ?? '');
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

// A number in a unit: eighths of a fraction unit as a fraction, and each other number with 2
// decimals at most. 0.375 gal is "3/8", 1.5 gal is "1 1/2", and 7.5 oz is "7.5".
export function showNumber(value: number, unit: string | null): string {
	const eighths = Math.round(value * 8);
	const isEighth = Math.abs(value * 8 - eighths) < 1e-6;
	if (!unit || !FRACTION_UNITS.has(unitKey(unit)) || !isEighth || eighths % 8 === 0) {
		return round(value);
	}
	const whole = Math.floor(eighths / 8);
	const part = eighths % 8;
	const divisor = part % 4 === 0 ? 4 : part % 2 === 0 ? 2 : 1;
	const fraction = `${part / divisor}/${8 / divisor}`;
	return whole ? `${whole} ${fraction}` : fraction;
}

// An amount as text, such as "3/8 gal" or "6".
export const showAmount = (value: number, unit: string | null) =>
	`${showNumber(value, unit)} ${unit ?? ''}`.trim();

// A number that the note can keep in its unit: round with 2 decimals, or an eighth of a fraction
// unit. If not, a change of the row goes into grams or millilitres.
export function isRoundIn(value: number, unit: string | null): boolean {
	const text = showNumber(value, unit);
	return Math.abs(Number(text) - value) < 1e-9 || text.includes('/');
}

// A measure in the unit of a row, such as "1 1/2 gal". A metric unit and a count keep the rule of
// `showMeasure`, so that 1000 g is "1 kg".
export function showLike(quantity: Measure, unit: string | null): string {
	const key = unitKey(unit ?? '');
	if (!key || isCount(quantity.kind) || METRIC.has(key)) return showMeasure(quantity);
	const per = measure({ factor: 1, unit, text: '' });
	if (per.kind !== quantity.kind) return showMeasure(quantity);
	return showAmount(quantity.value / per.value, unit);
}

// Two units are one unit when they are the same word: "cans" and "can", "Gal" and "gal".
export const sameUnit = (a: string | null, b: string | null) => unitKey(a ?? '') === unitKey(b ?? '');

// Adds a measure to the sums, with one sum for each kind.
export function addTo(sums: Map<string, number>, { kind, value }: Measure) {
	sums.set(kind, (sums.get(kind) ?? 0) + value);
}
