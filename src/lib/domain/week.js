/**
 * @typedef {import('$lib/types').CookSession} CookSession
 * @typedef {import('$lib/types').MenuItem} MenuItem
 */

/**
 * The start of the week that holds a time: 00:00 of the first day of the week, in local time.
 * @param {number} timeMs
 * @param {number} firstDay The first day of the week, as "Date.getDay()" gives it: 0 is Sunday.
 */
export function weekStart(timeMs, firstDay) {
	const date = new Date(timeMs);
	date.setHours(0, 0, 0, 0);
	// The date moves by days, not by hours: a day with a change of the clock has 23 or 25 hours.
	date.setDate(date.getDate() - ((date.getDay() - firstDay + 7) % 7));
	return date.getTime();
}

/**
 * The slots of this week: the meals that are cooked, the meals in the hand, and the slots that
 * are still open. The slots are in this sequence, and their number is "meals" or more.
 * @param {CookSession[]} cooked The cooked sessions.
 * @param {MenuItem[]} menu The meals in the hand.
 * @param {number} nowMs
 * @param {number} meals The meals that the owner cooks in one week.
 * @param {number} firstDay The first day of the week: see "weekStart".
 */
export function weekPlan(cooked, menu, nowMs, meals, firstDay) {
	const since = weekStart(nowMs, firstDay);
	const done = cooked.filter((session) => Date.parse(session.cookedAt) >= since).length;
	const hand = menu.length;
	const total = Math.max(meals, done + hand);
	return { done, hand, open: total - done - hand, total };
}
