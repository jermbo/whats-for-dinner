import { db } from '$lib/db/db';
import { getMeta, setMeta } from '$lib/db/meta';
import { pushNights, swapWithNext } from '$lib/domain/menu-plan';
import { now } from '$lib/util/ids';
import { setLocation } from './pantry';

/**
 * @typedef {import('$lib/types').MenuItem} MenuItem
 * @typedef {import('$lib/types').MenuPlan} MenuPlan
 * @typedef {{ item: import('$lib/types').PantryItem, ingredient: import('$lib/types').Ingredient }[]} Frozen
 *   The food of a meal that is in the freezer.
 */

/** The note of the plan of the week. */
const PLAN_KEY = 'menuPlan';

/** @returns {Promise<MenuPlan | null>} The plan of the week. Null: there is none yet. */
export async function readPlan() {
	const plan = /** @type {MenuPlan | undefined} */ (await getMeta(PLAN_KEY));
	return plan?.nights ? plan : null;
}

/**
 * Stores the nights of the plan. A plan with new nights is a plan that the owner must set
 * again.
 * @param {string[]} nights
 * @param {string | null} setAt The time of "Set the menu" that the plan keeps.
 */
export function saveNights(nights, setAt) {
	return setMeta(PLAN_KEY, { nights: nights.toSorted(), setAt });
}

/** "Set the menu": the plan of the week is complete. */
export async function setTheMenu() {
	const plan = await readPlan();
	if (plan) await setMeta(PLAN_KEY, { ...plan, setAt: now() });
}

/**
 * Gives menu items their nights.
 * @param {Map<string, string | null>} nights The night of each menu item, by its ID.
 */
export function setNights(nights) {
	return db.transaction('rw', db.menu, async () => {
		const time = now();
		for (const [id, night] of nights) await db.menu.update(id, { night, updatedAt: time });
	});
}

/**
 * The preparation of a meal starts now: the food of the meal comes out of the freezer and goes
 * into the fridge, and the meal waits for its lead time. Call it in a transaction.
 * @param {MenuItem} item
 * @param {Frozen} frozen
 */
async function start(item, frozen) {
	const time = now();
	await db.menu.update(item.id, { prepDoneAt: time, updatedAt: time });
	for (const food of frozen) await setLocation(food.item, food.ingredient, 'fridge');
}

/**
 * "Done" on a line of tonight: the owner started the preparation of a later meal.
 * @param {MenuItem} item
 * @param {Frozen} frozen
 */
export function startPreparation(item, frozen) {
	return db.transaction('rw', db.menu, db.pantry, () => start(item, frozen));
}

/**
 * "For tomorrow": the preparation of the meal of tonight starts now, and the meal changes its
 * place with the meal of tomorrow.
 * @param {MenuItem} item
 * @param {Frozen} frozen
 */
export function prepareForTomorrow(item, frozen) {
	return db.transaction('rw', db.menu, db.pantry, async () => {
		await start(item, frozen);
		await setNights(swapWithNext(await db.menu.toArray(), item));
	});
}

/** "Order in": the owner does not cook tonight. Each meal of tonight or later moves one night. */
export function orderIn() {
	return db.transaction('rw', db.menu, async () => {
		await setNights(pushNights(await db.menu.toArray(), Date.now()));
	});
}
