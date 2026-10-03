import { db } from '$lib/db/db';
import { newId, now } from '$lib/db/ids';
import { dropFinishedPhoto } from './finished-photos';
import { changeQuantity } from './pantry';

/**
 * @typedef {import('$lib/types').MenuItem} MenuItem
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {import('$lib/types').CookSession} CookSession
 * @typedef {import('$lib/types').Deduction} Deduction
 */

const TABLES = [
	db.recipes,
	db.ingredients,
	db.pantry,
	db.pantryLog,
	db.menu,
	db.sessions,
	db.photos
];

/**
 * An open session with no action for this long is from a meal that the owner did not finish.
 * The next start begins again, so that the times of the session are the times of one cook.
 */
const STALE_MS = 6 * 60 * 60 * 1000;

/**
 * The cook sessions that are open: Cook mode started, and "Cooked" did not occur yet.
 * An open session has an empty "cookedAt".
 */
export function openSessions() {
	return db.sessions.where('cookedAt').equals('').toArray();
}

/** The cook sessions of the meals that are cooked, oldest first. This is the cook history. */
export function cookedSessions() {
	return db.sessions.where('cookedAt').above('').toArray();
}

/**
 * True when the owner is in the middle of this meal: the last action is not long ago.
 * @param {CookSession} session An open session.
 * @param {number} nowMs
 */
export function isCooking(session, nowMs) {
	const last = session.visits.at(-1)?.at ?? session.startedAt ?? session.updatedAt;
	return Date.parse(last) > nowMs - STALE_MS;
}

/**
 * @param {MenuItem} item
 * @param {Recipe} recipe
 * @param {string} time
 * @returns {CookSession}
 */
function blankSession(item, recipe, time) {
	return {
		id: newId(),
		recipeId: recipe.id,
		recipeName: recipe.name,
		kind: item.kind,
		menuItem: item,
		startedAt: time,
		cookedAt: '',
		servings: recipe.servings,
		rating: null,
		note: '',
		deductions: [],
		leftoverMenuId: null,
		photoId: null,
		visits: [],
		stepNotes: [],
		timers: [],
		checked: [],
		updatedAt: time
	};
}

/** @param {string} itemId The ID of a menu item. */
async function openSessionOf(itemId) {
	return (await openSessions()).find((session) => session.menuItem.id === itemId);
}

/**
 * Starts Cook mode for a meal: makes its open cook session, or gives the one that is there.
 * @param {MenuItem} item
 * @returns {Promise<string>} The ID of the cook session.
 */
export function startCook(item) {
	return db.transaction('rw', db.recipes, db.sessions, async () => {
		const recipe = await db.recipes.get(item.recipeId);
		if (!recipe) throw new Error('The recipe of this meal does not exist.');

		const open = await openSessionOf(item.id);
		if (open && isCooking(open, Date.now())) return open.id;

		// An old session starts again. Its notes and its photo stay.
		const time = now();
		const session = {
			...(open ?? blankSession(item, recipe, time)),
			startedAt: time,
			servings: recipe.servings,
			visits: [],
			timers: [],
			checked: [],
			updatedAt: time
		};
		await db.sessions.put(session);
		return session.id;
	});
}

/**
 * "Cooked means deducted": subtracts the ingredients, removes the meal from the menu,
 * and closes the cook session of the meal. A meal with no open session gets a session that
 * has only the end time.
 * @param {MenuItem} item
 * @returns {Promise<string>} The ID of the cook session.
 */
export function cook(item) {
	return db.transaction('rw', TABLES, async () => {
		const recipe = await db.recipes.get(item.recipeId);
		if (!recipe) throw new Error('The recipe of this meal does not exist.');

		const time = now();
		const open = await openSessionOf(item.id);
		/** @type {CookSession} */
		const session = open ?? { ...blankSession(item, recipe, time), startedAt: null };
		// The times of an old session are not the times of this cook.
		if (open && !isCooking(open, Date.now()))
			Object.assign(session, { startedAt: null, visits: [] });

		/** @type {Deduction[]} */
		const deductions = [];

		// Leftovers use no ingredients. A 'state' ingredient does not change.
		const rows = item.kind === 'recipe' ? recipe.ingredients : [];
		for (const row of rows) {
			const ingredient = await db.ingredients.get(row.ingredientId);
			if (ingredient?.tracking !== 'quantity') continue;
			const applied = await changeQuantity(row.ingredientId, -row.quantity, 'cooked', {
				sessionId: session.id
			});
			if (applied !== 0) deductions.push({ ingredientId: row.ingredientId, amount: -applied });
		}

		await db.menu.delete(item.id);
		await db.sessions.put({ ...session, cookedAt: time, deductions, timers: [], updatedAt: time });
		return session.id;
	});
}

/**
 * Puts the quantities back and puts the meal back on the menu.
 * A session from Cook mode becomes open again, so its notes, its photo, and its place stay.
 * A session from one tap on "Cooked" goes away.
 * @param {CookSession} session
 */
export function undoCook(session) {
	return db.transaction('rw', TABLES, async () => {
		for (const { ingredientId, amount } of session.deductions) {
			await changeQuantity(ingredientId, amount, 'undo', { sessionId: session.id });
		}
		if (session.leftoverMenuId) await db.menu.delete(session.leftoverMenuId);

		// A recipe is on the menu one time only. If it was added again after "Cooked", it stays.
		const { menuItem } = session;
		const items = await db.menu.where('recipeId').equals(menuItem.recipeId).toArray();
		const again = menuItem.kind === 'recipe' && items.some((item) => item.kind === 'recipe');
		if (!again) await db.menu.put(menuItem);

		if (session.startedAt && !again) {
			await db.sessions.update(session.id, {
				cookedAt: '',
				deductions: [],
				leftoverMenuId: null,
				updatedAt: now()
			});
		} else {
			await dropFinishedPhoto(session);
			await db.sessions.delete(session.id);
		}
	});
}

/**
 * Changes a cook session with a function that gets the session of this moment. Two changes
 * that come fast, such as two taps, thus do not lose each other.
 * @param {string} id
 * @param {(session: CookSession) => Partial<CookSession>} change
 */
export function changeSession(id, change) {
	return db.transaction('rw', db.sessions, async () => {
		const session = await db.sessions.get(id);
		if (!session) return;
		const changes = change(session);
		if (Object.keys(changes).length === 0) return;
		await db.sessions.update(id, { ...changes, updatedAt: now() });
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
 * Records that the owner opened a card in Cook mode. The last visit is the place of the owner.
 * @param {string} id
 * @param {string} card 'ingredients', 'finished', or the ID of a step.
 */
export function visitCard(id, card) {
	return changeSession(id, (session) =>
		session.visits.at(-1)?.card === card ? {} : { visits: [...session.visits, { card, at: now() }] }
	);
}

/**
 * Sets or removes the check of one ingredient on the ingredients card.
 * @param {string} id
 * @param {string} ingredientId
 * @param {boolean} checked
 */
export function checkIngredient(id, ingredientId, checked) {
	return changeSession(id, (session) => {
		const others = session.checked.filter((other) => other !== ingredientId);
		return { checked: checked ? [...others, ingredientId] : others };
	});
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
