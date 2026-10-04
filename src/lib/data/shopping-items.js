import { db } from '$lib/db/db';
import { newId, now } from '$lib/util/ids';

/** @typedef {import('$lib/types').Ingredient} Ingredient */

/**
 * Adds an item by hand. If the name is an ingredient, the item is linked to it.
 * An item that is on the list already is not added again.
 * @param {string} name
 * @param {Ingredient[]} ingredients
 */
export function addManualItem(name, ingredients) {
	const text = name.trim();
	const match = ingredients.find((i) => i.name.toLowerCase() === text.toLowerCase());
	const label = match?.name ?? text;

	return db.transaction('rw', db.shopping, async () => {
		const same = await db.shopping
			.filter((item) => item.name.toLowerCase() === label.toLowerCase())
			.first();
		if (same) return;
		await db.shopping.add({
			id: newId(),
			name: label,
			ingredientId: match?.id ?? null,
			quantity: 0,
			updatedAt: now()
		});
	});
}

/** @param {string} id */
export function removeManualItem(id) {
	return db.shopping.delete(id);
}
