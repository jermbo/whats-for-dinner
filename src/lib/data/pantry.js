import { db } from '$lib/db/db';
import { defaultLocation } from '$lib/domain/pantry';
import { round } from '$lib/util/format';
import { newId, now } from '$lib/util/ids';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {import('$lib/types').Cause} Cause
 * @typedef {import('$lib/types').StockState} StockState
 * @typedef {import('$lib/types').StorageLocation} StorageLocation
 */

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
 * Puts food into the pantry by hand, at the place that the owner selects.
 * @param {Ingredient} ingredient
 * @param {{ quantity: number, location: StorageLocation, full?: number }} food
 *   quantity: the amount to add. full: the quantity of a full gauge, for an item that is new.
 * @returns {Promise<string>} The ID of the pantry item.
 */
export function addByHand(ingredient, { quantity, location, full = 0 }) {
	return db.transaction('rw', db.pantry, db.pantryLog, async () => {
		const known = await find(ingredient.id);
		const item = known ?? (await create(ingredient.id, location));

		if (ingredient.tracking === 'quantity') {
			await changeQuantity(ingredient.id, quantity, 'corrected');
		} else {
			await setState(ingredient.id, 'have', 'corrected');
		}

		const fullQuantity = Math.max(known?.fullQuantity ?? full, item.quantity + quantity);
		await db.pantry.update(item.id, { location, fullQuantity, updatedAt: now() });
		return item.id;
	});
}

/**
 * @param {string} id
 * @param {StorageLocation} location
 */
export function setLocation(id, location) {
	return db.pantry.update(id, { location, updatedAt: now() });
}

/**
 * Makes an item empty. The item stays in the pantry as "none": a reminder to buy it again.
 * @param {Ingredient} ingredient
 * @param {'used' | 'thrown'} cause
 */
export function emptyItem(ingredient, cause) {
	return ingredient.tracking === 'quantity'
		? setQuantity(ingredient.id, 0, cause)
		: setState(ingredient.id, 'out', cause);
}

/**
 * Removes an item from the pantry completely: a food that the owner does not keep.
 * @param {PantryItem} item
 */
export function removeItem(item) {
	return db.transaction('rw', db.pantry, db.pantryLog, async () => {
		await db.pantry.delete(item.id);
		await log(item.ingredientId, 'corrected', -item.quantity, 'out', null);
	});
}
