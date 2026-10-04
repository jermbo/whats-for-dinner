import { newId } from '$lib/util/ids';

/**
 * @typedef {import('$lib/types').MenuItem} MenuItem
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {import('$lib/types').CookSession} CookSession
 */

/**
 * An open session with no action for this long is from a meal that the owner did not finish.
 * The next start begins again, so that the times of the session are the times of one cook.
 */
const STALE_MS = 6 * 60 * 60 * 1000;

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
export function blankSession(item, recipe, time) {
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
