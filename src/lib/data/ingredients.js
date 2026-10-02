import { db } from '$lib/db/db';
import { newId, now } from '$lib/db/ids';

/** @returns {import('$lib/types').Ingredient} */
export function blankIngredient() {
	return {
		id: '',
		name: '',
		category: 'Other',
		unit: 'g',
		tracking: 'quantity',
		perishable: false,
		updatedAt: ''
	};
}

/**
 * @param {import('$lib/types').Ingredient} ingredient
 * @returns {Promise<import('$lib/types').Ingredient>}
 */
export async function saveIngredient(ingredient) {
	const record = {
		...ingredient,
		id: ingredient.id || newId(),
		name: ingredient.name.trim(),
		updatedAt: now()
	};
	await db.ingredients.put(record);
	return record;
}
