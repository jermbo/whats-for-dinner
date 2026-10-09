import { newId } from '$lib/util/ids';
import { HOUR, MINUTE } from '$lib/util/time';

/**
 * @typedef {import('$lib/types').MenuItem} MenuItem
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {import('$lib/types').CookSession} CookSession
 */

/**
 * An open session with no action for this long is from a meal that the owner did not finish.
 * The next start begins again, so that the times of the session are the times of one cook.
 */
const STALE_MS = 6 * HOUR;

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
 * The minutes that a cook took: from the start of Cook mode to "Cooked". A session from one tap
 * on "Cooked" has no start. A session of less than a minute is also a tap on "Cooked", and not
 * a cook.
 * @param {CookSession | undefined} session
 * @returns {number | null} Null: the session has no cook time.
 */
export function sessionMinutes(session) {
	if (!session?.startedAt || !session.cookedAt) return null;
	const minutes = (Date.parse(session.cookedAt) - Date.parse(session.startedAt)) / MINUTE;
	return minutes >= 1 ? Math.round(minutes) : null;
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
