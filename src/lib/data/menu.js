import { db } from '$lib/db/db';
import { newId, now } from '$lib/util/ids';
import { dropFinishedPhoto } from './finished-photos';

/**
 * Adds a recipe to the menu. A recipe is on the menu one time only: when it is there already,
 * nothing changes. Leftovers are a different meal, so they can be on the menu with the recipe.
 * @param {string} recipeId
 * @param {import('$lib/types').MenuKind} [kind]
 * @returns {Promise<string>} The ID of the menu item, new or the one that was there.
 */
export function addToMenu(recipeId, kind = 'recipe') {
	return db.transaction('rw', db.menu, async () => {
		if (kind === 'recipe') {
			const items = await db.menu.where('recipeId').equals(recipeId).toArray();
			const there = items.find((item) => item.kind === 'recipe');
			if (there) return there.id;
		}

		const time = now();
		const id = newId();
		await db.menu.add({ id, kind, recipeId, addedAt: time, prepDoneAt: null, updatedAt: time });
		return id;
	});
}

/**
 * Removes a meal from the menu. A cook session that is open for the meal is not history yet,
 * so it goes with the meal.
 * @param {string} id
 */
export function removeFromMenu(id) {
	return db.transaction('rw', db.menu, db.sessions, db.recipes, db.photos, async () => {
		const open = await db.sessions.where('cookedAt').equals('').toArray();
		for (const session of open.filter((session) => session.menuItem.id === id)) {
			await dropFinishedPhoto(session);
			await db.sessions.delete(session.id);
		}
		await db.menu.delete(id);
	});
}

/** @param {string} id */
export function markPrepDone(id) {
	const time = now();
	return db.menu.update(id, { prepDoneAt: time, updatedAt: time });
}
