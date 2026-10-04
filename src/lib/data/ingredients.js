import { db } from '$lib/db/db';
import { newId, now } from '$lib/util/ids';

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
