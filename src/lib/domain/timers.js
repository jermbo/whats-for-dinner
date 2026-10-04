/** @typedef {import('$lib/types').CookTimer} CookTimer */

/**
 * The seconds that a timer has left. Zero: the timer is done.
 * @param {CookTimer} timer
 * @param {number} nowMs
 */
export function secondsLeft(timer, nowMs) {
	return Math.max(0, Math.ceil((Date.parse(timer.endsAt) - nowMs) / 1000));
}
