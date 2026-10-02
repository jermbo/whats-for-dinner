import { db } from '$lib/db/db';
import { newId, now } from '$lib/db/ids';
import { round } from '$lib/util/format';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {import('$lib/types').Cause} Cause
 * @typedef {import('$lib/types').StockState} StockState
 * @typedef {import('$lib/types').StorageLocation} StorageLocation
 */

/**
 * @param {Ingredient} ingredient
 * @returns {StorageLocation}
 */
export function defaultLocation(ingredient) {
	return ingredient.perishable ? 'fridge' : 'pantry';
}

/** @param {string} ingredientId */
function find(ingredientId) {
	return db.pantry.where('ingredientId').equals(ingredientId).first();
}

/**
 * @param {string} ingredientId
 * @param {StorageLocation} location
 * @returns {Promise<PantryItem>}
 */
async function create(ingredientId, location) {
	/** @type {PantryItem} */
	const item = {
		id: newId(),
		ingredientId,
		quantity: 0,
		fullQuantity: 0,
		state: 'out',
		location,
		updatedAt: now()
	};
	await db.pantry.add(item);
	return item;
}

/**
 * Every pantry change goes into the log with its cause.
 * @param {string} ingredientId
 * @param {Cause} cause
 * @param {number} delta
 * @param {StockState | null} state
 * @param {string | null} sessionId
 */
function log(ingredientId, cause, delta, state, sessionId) {
	return db.pantryLog.add({ id: newId(), ingredientId, cause, delta, state, sessionId, at: now() });
}

/**
 * Adds to or subtracts from a quantity. The quantity stops at zero.
 * @param {string} ingredientId
 * @param {number} delta
 * @param {Cause} cause
 * @param {{ sessionId?: string | null, location?: StorageLocation }} [options]
 * @returns {Promise<number>} The change that was applied.
 */
export function changeQuantity(ingredientId, delta, cause, options = {}) {
	return db.transaction('rw', db.pantry, db.pantryLog, async () => {
		let item = await find(ingredientId);
		if (!item && delta <= 0) return 0;
		item ??= await create(ingredientId, options.location ?? 'pantry');

		const quantity = round(Math.max(0, item.quantity + delta));
		const applied = round(quantity - item.quantity);
		await db.pantry.update(item.id, {
			quantity,
			fullQuantity: Math.max(item.fullQuantity, quantity),
			updatedAt: now()
		});
		await log(ingredientId, cause, applied, null, options.sessionId ?? null);
		return applied;
	});
}

/**
 * @param {string} ingredientId
 * @param {number} quantity
 * @param {Cause} cause
 */
export function setQuantity(ingredientId, quantity, cause) {
	return db.transaction('rw', db.pantry, db.pantryLog, async () => {
		const current = (await find(ingredientId))?.quantity ?? 0;
		return changeQuantity(ingredientId, quantity - current, cause);
	});
}

/**
 * @param {string} ingredientId
 * @param {StockState} state
 * @param {Cause} cause
 * @param {StorageLocation} [location]
 */
export function setState(ingredientId, state, cause, location = 'pantry') {
	return db.transaction('rw', db.pantry, db.pantryLog, async () => {
		const item = (await find(ingredientId)) ?? (await create(ingredientId, location));
		await db.pantry.update(item.id, { state, updatedAt: now() });
		await log(ingredientId, cause, 0, state, null);
	});
}

/**
 * Puts an ingredient into the pantry, in the way that the ingredient is tracked.
 * @param {Ingredient} ingredient
 * @param {number} quantity
 * @param {Cause} cause
 */
export function stock(ingredient, quantity, cause) {
	const location = defaultLocation(ingredient);
	return ingredient.tracking === 'quantity'
		? changeQuantity(ingredient.id, quantity, cause, { location })
		: setState(ingredient.id, 'have', cause, location);
}

/**
 * @param {string} id
 * @param {StorageLocation} location
 */
export function setLocation(id, location) {
	return db.pantry.update(id, { location, updatedAt: now() });
}

/**
 * Removes an item that is gone. The cause is 'used' or 'thrown'.
 * @param {PantryItem} item
 * @param {Cause} cause
 */
export function removeItem(item, cause) {
	return db.transaction('rw', db.pantry, db.pantryLog, async () => {
		await db.pantry.delete(item.id);
		await log(item.ingredientId, cause, -item.quantity, 'out', null);
	});
}
