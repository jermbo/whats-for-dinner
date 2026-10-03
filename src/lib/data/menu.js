import { db } from '$lib/db/db';
import { newId, now } from '$lib/db/ids';

/**
 * @typedef {import('$lib/types').MenuItem} MenuItem
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {'ready' | 'todo' | 'waiting'} PrepState
 * @typedef {{ item: MenuItem, recipe: Recipe, state: PrepState, readyAt: number | null }} MenuEntry
 */

const HOUR = 60 * 60 * 1000;

/**
 * The recipes that are on the menu as a meal to cook. Leftovers do not count.
 * @param {MenuItem[]} menu
 * @returns {Set<string>} The recipe IDs.
 */
export function recipesOnMenu(menu) {
	return new Set(menu.filter((item) => item.kind === 'recipe').map((item) => item.recipeId));
}

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

/** @param {string} id */
export function removeFromMenu(id) {
	return db.menu.delete(id);
}

/** @param {string} id */
export function markPrepDone(id) {
	const time = now();
	return db.menu.update(id, { prepDoneAt: time, updatedAt: time });
}

/**
 * A meal is ready when it has no preparation, or when the lead time is over.
 * @param {MenuItem} item
 * @param {Recipe} recipe
 * @param {number} nowMs
 * @returns {{ state: PrepState, readyAt: number | null }}
 */
export function prepStatus(item, recipe, nowMs) {
	if (item.kind === 'leftover' || recipe.prepSteps.length === 0) {
		return { state: 'ready', readyAt: null };
	}
	if (!item.prepDoneAt) return { state: 'todo', readyAt: null };

	const lead = Math.max(...recipe.prepSteps.map((step) => step.leadHours));
	const readyAt = Date.parse(item.prepDoneAt) + lead * HOUR;
	return { state: readyAt <= nowMs ? 'ready' : 'waiting', readyAt };
}

/**
 * Joins each menu item with its recipe and its preparation state. Oldest first.
 * @param {MenuItem[]} menu
 * @param {Map<string, Recipe>} recipesById
 * @param {number} nowMs
 * @returns {MenuEntry[]}
 */
export function menuEntries(menu, recipesById, nowMs) {
	/** @type {MenuEntry[]} */
	const entries = [];
	for (const item of menu) {
		const recipe = recipesById.get(item.recipeId);
		if (recipe) entries.push({ item, recipe, ...prepStatus(item, recipe, nowMs) });
	}
	return entries.sort((a, b) => a.item.addedAt.localeCompare(b.item.addedAt));
}

/** @param {MenuEntry} entry */
export function entryName(entry) {
	return entry.item.kind === 'leftover' ? `Leftovers: ${entry.recipe.name}` : entry.recipe.name;
}
