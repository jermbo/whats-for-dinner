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

/**
 * Sets the low line of an ingredient. With no value, the app uses a quarter of a full package.
 * @param {string} id
 * @param {number | undefined} lowAt
 */
export function setLowLine(id, lowAt) {
	return db.ingredients.update(id, { lowAt, updatedAt: now() });
}
