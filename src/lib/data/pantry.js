import { db } from '$lib/db/db';
import { defaultLocation, inStock } from '$lib/domain/pantry';
import { stateAt } from '$lib/domain/pantry-scale';
import { useByAfterStock, useByIn, usualDays } from '$lib/domain/use-by';
import { round } from '$lib/util/format';
import { newId, now } from '$lib/util/ids';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {import('$lib/types').Cause} Cause
 * @typedef {import('$lib/types').StockState} StockState
 * @typedef {import('$lib/types').StorageLocation} StorageLocation
 * @typedef {import('$lib/types').UseWithin} UseWithin
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
		useBy: null,
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
 * Sets an item to the value that the owner gave on its gauge. A smaller amount is an amount
 * that was used. In a pantry check, each change is a correction.
 * @param {PantryItem} item
 * @param {Ingredient} ingredient
 * @param {number} value A value on the scale of the gauge.
 * @param {boolean} [checking]
 */
export function setLevel(item, ingredient, value, checking = false) {
	if (ingredient.tracking === 'state') return setState(ingredient.id, stateAt(value), 'corrected');
	const cause = checking || value > item.quantity ? 'corrected' : 'used';
	return setQuantity(ingredient.id, value, cause);
}

/**
 * Gives an item its place and its use-by time after new stock came in. Call it in a transaction.
 * @param {Ingredient} ingredient
 * @param {PantryItem | undefined} before The item before the new stock. Not defined: a new item.
 * @param {StorageLocation} location
 * @param {number | null} days The days that the new stock keeps. Null: it keeps.
 */
async function freshen(ingredient, before, location, days) {
	const item = await find(ingredient.id);
	if (!item) return;
	const fresh = days === null ? null : useByIn(days, Date.now());
	const useBy = useByAfterStock(
		{ useBy: before?.useBy ?? null, location },
		inStock(before, ingredient),
		fresh
	);
	await db.pantry.update(item.id, { location, useBy, updatedAt: now() });
}

/**
 * Puts an ingredient into the pantry, in the way that the ingredient is tracked. The new stock
 * gets a use-by time: from the answer of the owner, or from the usual days of the food.
 * @param {Ingredient} ingredient
 * @param {number} quantity
 * @param {Cause} cause
 * @param {UseWithin | null} [within] The answer to "Use within". Null: the app decides.
 */
export function stock(ingredient, quantity, cause, within = null) {
	return db.transaction('rw', db.pantry, db.pantryLog, async () => {
		const before = await find(ingredient.id);
		let location = before?.location ?? defaultLocation(ingredient);
		if (within === 'freezer') location = 'freezer';
		// An answer in days takes the food out of the freezer.
		else if (within !== null && location === 'freezer') location = defaultLocation(ingredient);

		if (ingredient.tracking === 'quantity') {
			await changeQuantity(ingredient.id, quantity, cause, { location });
		} else {
			await setState(ingredient.id, 'have', cause, location);
		}
		const days = typeof within === 'number' ? within : usualDays(ingredient);
		await freshen(ingredient, before, location, days);
	});
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
		await db.pantry.update(item.id, { fullQuantity });
		await freshen(ingredient, known, location, usualDays(ingredient));
		return item.id;
	});
}

/**
 * "Have it": the pantry has the food that the shopping list asks for. The count of the pantry
 * was wrong, so the amount that is short comes in as a correction.
 * @param {Ingredient} ingredient
 * @param {number} short The amount that the menu needs and the pantry did not have.
 */
export function haveIt(ingredient, short) {
	const location = defaultLocation(ingredient);
	return ingredient.tracking === 'quantity'
		? changeQuantity(ingredient.id, short, 'corrected', { location })
		: setState(ingredient.id, 'have', 'corrected', location);
}

/**
 * Moves an item to a different place. Food that goes into the freezer keeps. Food that comes
 * out of the freezer gets its usual days from now.
 * @param {PantryItem} item
 * @param {Ingredient} ingredient
 * @param {StorageLocation} location
 */
export function setLocation(item, ingredient, location) {
	const days = usualDays(ingredient);
	const thawed = item.location === 'freezer' && days !== null;
	const useBy =
		location === 'freezer' ? null : thawed ? useByIn(days, Date.now()) : (item.useBy ?? null);
	return db.pantry.update(item.id, { location, useBy, updatedAt: now() });
}

/**
 * Sets the days in which the owner must use an item. Null: the food keeps.
 * @param {string} id
 * @param {number | null} days
 */
export function setUseWithin(id, days) {
	const useBy = days === null ? null : useByIn(days, Date.now());
	return db.pantry.update(id, { useBy, updatedAt: now() });
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
