// The vault keeps each row of the pantry in one unit system, so that each row compares with each
// recipe. An amount that you type goes into that system here, before it becomes a row.

import { parseAmount } from '../recipemd/amount';
import { isCount, measure, sameUnit, showAmount, showMeasure, type Measure } from '../units';

export type UnitSystem = 'metric' | 'imperial';

const UNITS: Record<UnitSystem, string[]> = {
	metric: ['g', 'kg', 'ml', 'l'],
	imperial: ['oz', 'lb', 'fl oz', 'cup', 'qt', 'gal']
};

const EXAMPLE: Record<UnitSystem, string> = { metric: '250 g', imperial: '8 oz' };

// What the field says to an amount that the vault does not permit, such as "1 jar".
export const refusal = (system: UnitSystem) =>
	`Give the weight or the volume from the label, such as ${EXAMPLE[system]}, or a plain count, such as 6.`;

// The text of the row, or null when the vault does not permit the amount: a container word, such
// as "1 jar", compares with nothing. "8 oz" is "227 g" in a metric vault.
export function entryIn(system: UnitSystem, text: string): string | null {
	const typed = text.trim();
	const amount = parseAmount(typed);
	// Text with no number, such as "tap", is a row that the plugin cannot count. It stays.
	if (!amount) return typed;

	const quantity = measure(amount);
	if (isCount(quantity.kind)) return quantity.kind === 'count:' ? typed : null;
	if (UNITS[system].some((unit) => sameUnit(amount.unit, unit))) return typed;
	return showIn(system, quantity);
}

// An amount with a plus, such as "425 g + 200 ml" at put away, is a list of amounts. Null when
// one of them is not permitted.
export function entriesIn(system: UnitSystem, text: string): string | null {
	const parts = text.split('+').map((part) => entryIn(system, part));
	return parts.every((part) => part !== null) ? parts.join(' + ') : null;
}

const per = (unit: string) => measure({ factor: 1, unit, text: unit }).value;

// Metric rounds to a whole gram or millilitre, as a label does. Imperial mass stays in ounces,
// because an American label says "17.6 oz", and not "1.1 lb".
function showIn(system: UnitSystem, { kind, value }: Measure): string {
	if (system === 'metric') return showMeasure({ kind, value: Math.round(value) });
	if (kind === 'mass') return showAmount(round(value / per('oz')), 'oz');
	if (value >= per('gal')) return showAmount(round(value / per('gal')), 'gal');
	if (value >= per('qt')) return showAmount(round(value / per('qt')), 'qt');
	return showAmount(round(value / per('fl oz')), 'fl oz');
}

const round = (value: number) => Math.round(value * 100) / 100;
