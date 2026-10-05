import { LOCATIONS } from './options';
import { pantryScale, stockLevel } from './pantry-scale';
import { daysLeft, soonGroup } from './use-by';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {import('$lib/types').StockState} StockState
 * @typedef {{
 *   item: PantryItem,
 *   ingredient: Ingredient,
 *   level: StockState,
 *   fill: number,
 *   left: number | null
 * }} PantryRow
 *   level: out, low, or have, from the low line of the item. fill: the level from 0 to 1.
 *   left: the days until the use-by date. Null: the food keeps, or the item is empty.
 * @typedef {{ key: string, label: string, note: string, rows: PantryRow[] }} PantryGroup
 *   note: the small text at the right of the label, such as "1 low · 1 out".
 * @typedef {'place' | 'low' | 'soon'} PantryView
 */

/** The views of the pantry screen. */
export const PANTRY_VIEWS = /** @type {{ value: PantryView, label: string }[]} */ ([
	{ value: 'place', label: 'Place' },
	{ value: 'low', label: 'Low first' },
	{ value: 'soon', label: 'Use soon' }
]);

/** The groups of the "Low first" view: the food to buy is at the top. */
const LEVELS = /** @type {{ value: StockState, label: string }[]} */ ([
	{ value: 'out', label: 'Out' },
	{ value: 'low', label: 'Low' },
	{ value: 'have', label: 'Enough' }
]);

/** The groups of the "Use soon" view: the food that spoils first is at the top. */
const SOON = /** @type {{ value: ReturnType<typeof soonGroup>, label: string }[]} */ ([
	{ value: 'today', label: 'Today' },
	{ value: 'week', label: 'This week' },
	{ value: 'keeps', label: 'Keeps' }
]);

/**
 * The pantry items with their ingredients, sorted by name.
 * @param {PantryItem[]} pantry
 * @param {Map<string, Ingredient>} ingredientsById
 * @param {number} time
 * @param {string} [search]
 * @returns {PantryRow[]}
 */
export function pantryRows(pantry, ingredientsById, time, search = '') {
	const text = search.trim().toLowerCase();

	/** @type {PantryRow[]} */
	const rows = [];
	for (const item of pantry) {
		const ingredient = ingredientsById.get(item.ingredientId);
		if (!ingredient?.name.toLowerCase().includes(text)) continue;

		const scale = pantryScale(item, ingredient);
		const level = stockLevel(scale);
		rows.push({
			item,
			ingredient,
			level,
			fill: scale.toFraction(scale.value),
			// An empty item has no food that can spoil.
			left: level === 'out' ? null : daysLeft(item, time)
		});
	}
	return rows.sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name));
}

/**
 * The number of rows that are low, and the number that are out.
 * @param {PantryRow[]} rows
 */
function pantryCounts(rows) {
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
function groupByLevel(rows) {
	return LEVELS.map(({ value, label }) => {
		const here = rows.filter((row) => row.level === value).sort((a, b) => a.fill - b.fill);
		return { key: value, label, note: String(here.length), rows: here };
	}).filter((group) => group.rows.length > 0);
}

/**
 * Today, then this week, then the food that keeps. In a group, the food with the fewest days
 * is first.
 * @param {PantryRow[]} rows Sorted by name.
 * @returns {PantryGroup[]}
 */
function groupBySoon(rows) {
	return SOON.map(({ value, label }) => {
		const here = rows
			.filter((row) => soonGroup(row.left) === value)
			.sort((a, b) => (a.left ?? Infinity) - (b.left ?? Infinity));
		return { key: value, label, note: String(here.length), rows: here };
	}).filter((group) => group.rows.length > 0);
}

/**
 * The number of rows that the owner must use today.
 * @param {PantryRow[]} rows
 */
function useTodayCount(rows) {
	return rows.filter((row) => soonGroup(row.left) === 'today').length;
}

/**
 * The rows below the low line that are not on the shopping list and not in the cart: the food
 * that "Add to Shop" sends to the list.
 * @param {PantryRow[]} rows
 * @param {Set<string>} listed The IDs of the ingredients on the shopping list or in the cart.
 */
export function rowsToShop(rows, listed) {
	return rows.filter((row) => row.level !== 'have' && !listed.has(row.ingredient.id));
}

/**
 * The rows with a use-by date in this week, the fewest days first.
 * @param {PantryRow[]} rows
 */
export function soonRows(rows) {
	return rows
		.filter((row) => soonGroup(row.left) !== 'keeps')
		.sort((a, b) => (a.left ?? 0) - (b.left ?? 0));
}

/**
 * The groups of a view.
 * @param {PantryView} view
 * @param {PantryRow[]} rows Sorted by name.
 * @returns {PantryGroup[]}
 */
export function pantryGroups(view, rows) {
	if (view === 'low') return groupByLevel(rows);
	return view === 'soon' ? groupBySoon(rows) : groupByLocation(rows);
}

/**
 * The counts that the title shows for a view: the answer to the question of that view.
 * @param {PantryView} view
 * @param {PantryRow[]} rows The rows of the full pantry.
 * @returns {{ count: number, label: string }[]}
 */
export function viewCounts(view, rows) {
	if (view === 'soon') return [{ count: useTodayCount(rows), label: 'today' }];
	const { low, out } = pantryCounts(rows);
	return [
		{ count: low, label: 'low' },
		{ count: out, label: 'out' }
	];
}
