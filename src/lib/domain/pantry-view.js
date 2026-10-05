import { LOCATIONS } from './options';
import { pantryScale, stockLevel } from './pantry-scale';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {import('$lib/types').StockState} StockState
 * @typedef {{ item: PantryItem, ingredient: Ingredient, level: StockState, fill: number }} PantryRow
 *   level: out, low, or have, from the low line of the item. fill: the level from 0 to 1.
 * @typedef {{ key: string, label: string, note: string, rows: PantryRow[] }} PantryGroup
 *   note: the small text at the right of the label, such as "1 low · 1 out".
 * @typedef {'place' | 'low'} PantryView
 */

/** The views of the pantry screen. */
export const PANTRY_VIEWS = /** @type {{ value: PantryView, label: string }[]} */ ([
	{ value: 'place', label: 'Place' },
	{ value: 'low', label: 'Low first' }
]);

/** The groups of the "Low first" view: the food to buy is at the top. */
const LEVELS = /** @type {{ value: StockState, label: string }[]} */ ([
	{ value: 'out', label: 'Out' },
	{ value: 'low', label: 'Low' },
	{ value: 'have', label: 'Enough' }
]);

/**
 * The pantry items with their ingredients, sorted by name.
 * @param {PantryItem[]} pantry
 * @param {Map<string, Ingredient>} ingredientsById
 * @param {string} [search]
 * @returns {PantryRow[]}
 */
export function pantryRows(pantry, ingredientsById, search = '') {
	const text = search.trim().toLowerCase();

	/** @type {PantryRow[]} */
	const rows = [];
	for (const item of pantry) {
		const ingredient = ingredientsById.get(item.ingredientId);
		if (!ingredient?.name.toLowerCase().includes(text)) continue;

		const scale = pantryScale(item, ingredient);
		rows.push({
			item,
			ingredient,
			level: stockLevel(scale),
			fill: scale.toFraction(scale.value)
		});
	}
	return rows.sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name));
}

/**
 * The number of rows that are low, and the number that are out.
 * @param {PantryRow[]} rows
 */
export function pantryCounts(rows) {
	return {
		low: rows.filter((row) => row.level === 'low').length,
		out: rows.filter((row) => row.level === 'out').length
	};
}

/**
 * One group for each location that has rows. The note tells how many rows need food.
 * @param {PantryRow[]} rows
 * @returns {PantryGroup[]}
 */
export function groupByLocation(rows) {
	return LOCATIONS.map(({ value, label }) => {
		const here = rows.filter((row) => row.item.location === value);
		const { low, out } = pantryCounts(here);
		const note = [low > 0 && `${low} low`, out > 0 && `${out} out`].filter(Boolean).join(' · ');
		return { key: value, label, note, rows: here };
	}).filter((group) => group.rows.length > 0);
}

/**
 * Out, then low, then enough. In a group, the emptiest row is first.
 * @param {PantryRow[]} rows Sorted by name.
 * @returns {PantryGroup[]}
 */
export function groupByLevel(rows) {
	return LEVELS.map(({ value, label }) => {
		const here = rows.filter((row) => row.level === value).sort((a, b) => a.fill - b.fill);
		return { key: value, label, note: String(here.length), rows: here };
	}).filter((group) => group.rows.length > 0);
}
