// The units that the size of a package can have. A container word, such as "1 jar", compares with
// nothing, and a typo, such as "1 gall", is not a unit. Each unit of the list converts, so the
// vault needs no unit system.

import { parseAmount } from '../recipemd/amount';
import { isCount, measure, sameUnit } from '../units';

export const UNITS = ['tsp', 'tbsp', 'cup', 'fl oz', 'pt', 'qt', 'gal', 'ml', 'l', 'oz', 'lb', 'g', 'kg'];

// What the field says to an amount that the list does not permit.
export const refusal = `Give the size from the label in ${UNITS.join(', ')}, or a plain count, such as 6.`;

// The text of the row, or null when the list does not permit the amount. Text with no number, such
// as "tap", is a row that the plugin cannot count, so it stays.
export function entryOf(text: string): string | null {
	const typed = text.trim();
	const amount = parseAmount(typed);
	if (!amount) return typed;

	const { kind } = measure(amount);
	if (isCount(kind)) return kind === 'count:' ? typed : null;
	return UNITS.some((unit) => sameUnit(amount.unit, unit)) ? typed : null;
}

// An amount with a plus, such as "425 g + 200 ml" at put away, is a list of amounts. Null when
// one of them is not permitted.
export function entriesOf(text: string): string | null {
	const parts = text.split('+').map((part) => entryOf(part));
	return parts.every((part) => part !== null) ? parts.join(' + ') : null;
}
