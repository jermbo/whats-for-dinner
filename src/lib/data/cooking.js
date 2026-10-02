import { db } from '$lib/db/db';
import { newId, now } from '$lib/db/ids';
import { changeQuantity } from './pantry';

/**
 * @typedef {import('$lib/types').MenuItem} MenuItem
 * @typedef {import('$lib/types').CookSession} CookSession
 * @typedef {import('$lib/types').Deduction} Deduction
 */

const TABLES = [db.recipes, db.ingredients, db.pantry, db.pantryLog, db.menu, db.sessions];

/**
 * "Cooked means deducted": subtracts the ingredients, removes the meal from the menu,
 * and makes the cook session record.
 * @param {MenuItem} item
 * @returns {Promise<string>} The ID of the cook session.
 */
export function cook(item) {
	return db.transaction('rw', TABLES, async () => {
		const recipe = await db.recipes.get(item.recipeId);
		if (!recipe) throw new Error('The recipe of this meal does not exist.');

		const sessionId = newId();
		/** @type {Deduction[]} */
		const deductions = [];

		// Leftovers use no ingredients. A 'state' ingredient does not change.
		const rows = item.kind === 'recipe' ? recipe.ingredients : [];
		for (const row of rows) {
			const ingredient = await db.ingredients.get(row.ingredientId);
			if (ingredient?.tracking !== 'quantity') continue;
			const applied = await changeQuantity(row.ingredientId, -row.quantity, 'cooked', {
				sessionId
			});
			if (applied !== 0) deductions.push({ ingredientId: row.ingredientId, amount: -applied });
		}

		const time = now();
		await db.menu.delete(item.id);
		await db.sessions.add({
			id: sessionId,
			recipeId: recipe.id,
			recipeName: recipe.name,
			kind: item.kind,
			menuItem: item,
			cookedAt: time,
			rating: null,
			note: '',
			deductions,
			leftoverMenuId: null,
			updatedAt: time
		});
		return sessionId;
	});
}

/**
 * Puts the quantities back and puts the meal back on the menu.
 * @param {CookSession} session
 */
export function undoCook(session) {
	return db.transaction('rw', TABLES, async () => {
		for (const { ingredientId, amount } of session.deductions) {
			await changeQuantity(ingredientId, amount, 'undo', { sessionId: session.id });
		}
		if (session.leftoverMenuId) await db.menu.delete(session.leftoverMenuId);
		await db.menu.put(session.menuItem);
		await db.sessions.delete(session.id);
	});
}

/**
 * @param {string} id
 * @param {{ rating?: number | null, note?: string }} changes
 */
export function updateSession(id, changes) {
	return db.sessions.update(id, { ...changes, updatedAt: now() });
}

/**
 * Adds or removes the "leftover" meal that a cook session made.
 * @param {CookSession} session
 * @param {boolean} hasLeftovers
 */
export function setLeftovers(session, hasLeftovers) {
	return db.transaction('rw', db.menu, db.sessions, async () => {
		const time = now();
		if (session.leftoverMenuId) await db.menu.delete(session.leftoverMenuId);

		const leftoverMenuId = hasLeftovers ? newId() : null;
		if (leftoverMenuId) {
			await db.menu.add({
				id: leftoverMenuId,
				kind: 'leftover',
				recipeId: session.recipeId,
				addedAt: time,
				prepDoneAt: null,
				updatedAt: time
			});
		}
		await db.sessions.update(session.id, { leftoverMenuId, updatedAt: time });
	});
}
