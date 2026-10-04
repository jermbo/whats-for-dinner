/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').StorageLocation} StorageLocation
 */

/**
 * @param {Ingredient} ingredient
 * @returns {StorageLocation}
 */
export function defaultLocation(ingredient) {
	return ingredient.perishable ? 'fridge' : 'pantry';
}
