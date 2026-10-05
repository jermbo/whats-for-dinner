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
		// An item that the pantry sent stays on the list now, also when it is not low.
		if (same?.fromPantry) await db.shopping.update(same.id, { fromPantry: false });
		if (same) return;
		await db.shopping.add({
			id: newId(),
			name: label,
			ingredientId: match?.id ?? null,
			quantity: 0,
			fromPantry: false,
			updatedAt: now()
		});
	});
}

/**
 * "Add to Shop": puts the food that is low in the pantry on the shopping list. An ingredient
 * that has an item on the list already keeps that item.
 * @param {Ingredient[]} ingredients
 * @returns {Promise<number>} The number of items that are new on the list.
 */
export function addLowItems(ingredients) {
	return db.transaction('rw', db.shopping, async () => {
		const there = new Set((await db.shopping.toArray()).map((item) => item.ingredientId));
		const fresh = ingredients.filter((ingredient) => !there.has(ingredient.id));
		const time = now();
		await db.shopping.bulkAdd(
			fresh.map((ingredient) => ({
				id: newId(),
				name: ingredient.name,
				ingredientId: ingredient.id,
				quantity: 0,
				fromPantry: true,
				updatedAt: time
			}))
		);
		return fresh.length;
	});
}

/** @param {string} id */
export function removeManualItem(id) {
	return db.shopping.delete(id);
}
