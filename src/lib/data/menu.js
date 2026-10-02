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
 * @param {string} recipeId
 * @param {import('$lib/types').MenuKind} [kind]
 * @returns {Promise<string>} The ID of the new menu item.
 */
export function addToMenu(recipeId, kind = 'recipe') {
	const time = now();
	return db.menu.add({
		id: newId(),
		kind,
		recipeId,
		addedAt: time,
		prepDoneAt: null,
		updatedAt: time
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
