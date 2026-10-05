import { pantryScale, stockLevel } from './pantry-scale';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {import('$lib/types').StorageLocation} StorageLocation
 */

/**
 * @param {Ingredient} ingredient
 * @returns {StorageLocation}
 */
export function defaultLocation(ingredient) {
	return ingredient.perishable ? 'fridge' : 'pantry';
}

/**
 * The ingredients whose pantry item is at its low line or below it, or empty.
 * @param {PantryItem[]} pantry
 * @param {Map<string, Ingredient>} ingredientsById
 * @returns {Set<string>} The ingredient IDs.
 */
export function belowLine(pantry, ingredientsById) {
	/** @type {Set<string>} */
	const low = new Set();
	for (const item of pantry) {
		const ingredient = ingredientsById.get(item.ingredientId);
		if (ingredient && stockLevel(pantryScale(item, ingredient)) !== 'have') low.add(ingredient.id);
	}
	return low;
}

/**
 * True when the pantry has some of an item: a quantity above zero, or a state that is not out.
 * @param {PantryItem | undefined} item
 * @param {Pick<Ingredient, 'tracking'>} ingredient
 */
export function inStock(item, ingredient) {
	if (!item) return false;
	return ingredient.tracking === 'quantity' ? item.quantity > 0 : item.state !== 'out';
}
