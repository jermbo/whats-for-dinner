import { formatQuantity, round } from '$lib/util/format';
import { STOCK_STATES, labelOf } from './options';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {import('$lib/types').LevelScale} LevelScale
 */

/** The states of a 'state' ingredient from empty to full, and the fill that shows each one. */
const STATES = /** @type {const} */ (['out', 'low', 'have']);
const STATE_FILLS = [0, 0.25, 1];

/** More blocks than this are too small for a finger. */
const MAX_BLOCKS = 12;

const STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];

/**
 * A step that gives approximately 20 stops on the row. The eye cannot see a smaller difference.
 * @param {number} max
 */
function stepFor(max) {
	return STEPS.findLast((step) => step <= max / 20) ?? 1;
}

/**
 * The stock state for a value on the scale of a 'state' ingredient.
 * @param {number} value
 */
export function stateAt(value) {
	return STATES[value] ?? 'out';
}

/**
 * Have, low, or out: three stops.
 * @param {PantryItem} item
 * @returns {LevelScale}
 */
function stateScale(item) {
	return {
		value: STATES.indexOf(item.state),
		max: STATES.length - 1,
		step: 1,
		blocks: 0,
		toFraction: (value) => STATE_FILLS[value] ?? 0,
		fromFraction: (fraction) => (fraction < 0.12 ? 0 : fraction < 0.6 ? 1 : 2),
		text: (value) => labelOf(STOCK_STATES, stateAt(value))
	};
}

/**
 * A weight, a volume, or a count. "Full" is the largest quantity that this item had.
 * @param {PantryItem} item
 * @param {Ingredient} ingredient
 * @returns {LevelScale}
 */
function quantityScale(item, ingredient) {
	const counted = ingredient.unit === 'count';
	const largest = Math.max(item.fullQuantity, item.quantity);
	const max = counted ? Math.ceil(largest) || 6 : largest || 500;
	const step = counted ? 1 : stepFor(max);

	return {
		value: item.quantity,
		max,
		step,
		blocks: counted && max <= MAX_BLOCKS ? max : 0,
		toFraction: (value) => Math.min(1, value / max),
		// A count rounds up: a block is full when the finger is on it.
		fromFraction: (fraction) =>
			counted
				? Math.max(0, Math.ceil(fraction * max - 0.001))
				: Math.min(max, round(Math.round((fraction * max) / step) * step)),
		text: (value) => formatQuantity(value, ingredient.unit)
	};
}

/**
 * The scale of the gauge for one pantry item.
 * @param {PantryItem} item
 * @param {Ingredient} ingredient
 * @returns {LevelScale}
 */
export function pantryScale(item, ingredient) {
	return ingredient.tracking === 'state' ? stateScale(item) : quantityScale(item, ingredient);
}
