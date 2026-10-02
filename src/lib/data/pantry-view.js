import { LOCATIONS } from './options';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {{ item: PantryItem, ingredient: Ingredient }} PantryRow
 * @typedef {{ location: string, label: string, rows: PantryRow[] }} PantryGroup
 */

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
		if (ingredient?.name.toLowerCase().includes(text)) rows.push({ item, ingredient });
	}
	return rows.sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name));
}

/**
 * One group for each location that has rows.
 * @param {PantryRow[]} rows
 * @returns {PantryGroup[]}
 */
export function groupByLocation(rows) {
	return LOCATIONS.map(({ value, label }) => ({
		location: value,
		label,
		rows: rows.filter((row) => row.item.location === value)
	})).filter((group) => group.rows.length > 0);
}

/**
 * The pantry as the pantry screen shows it: one group for each location, sorted by name.
 * @param {PantryItem[]} pantry
 * @param {Map<string, Ingredient>} ingredientsById
 * @param {string} [search]
 * @returns {PantryGroup[]}
 */
export function pantryGroups(pantry, ingredientsById, search = '') {
	return groupByLocation(pantryRows(pantry, ingredientsById, search));
}
