/**
 * @typedef {import('$lib/types').CookSession} CookSession
 * @typedef {import('$lib/types').MenuItem} MenuItem
 */

/** The meals that one week holds. The slots of the week are this many. */
export const WEEK_MEALS = 5;

const DAY = 24 * 60 * 60 * 1000;

/**
 * The start of the week that holds a time: Monday, 00:00, in local time.
 * @param {number} nowMs
 */
export function weekStart(nowMs) {
	const date = new Date(nowMs);
	date.setHours(0, 0, 0, 0);
	return date.getTime() - ((date.getDay() + 6) % 7) * DAY;
}

/**
 * The slots of this week: the meals that are cooked, the meals in the hand, and the slots that
 * are still open. The slots are in this sequence, and their number is "WEEK_MEALS" or more.
 * @param {CookSession[]} cooked The cooked sessions.
 * @param {MenuItem[]} menu The meals in the hand.
 * @param {number} nowMs
 */
export function weekPlan(cooked, menu, nowMs) {
	const since = weekStart(nowMs);
	const done = cooked.filter((session) => Date.parse(session.cookedAt) >= since).length;
	const hand = menu.length;
	const total = Math.max(WEEK_MEALS, done + hand);
	return { done, hand, open: total - done - hand, total };
}
