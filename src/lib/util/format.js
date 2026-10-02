/** @type {Record<import('$lib/types').Unit, string>} */
const UNIT_LABELS = { g: 'g', ml: 'ml', count: '' };

/** @param {number} value */
export function round(value) {
	return Math.round(value * 100) / 100;
}

/**
 * @param {number} quantity
 * @param {import('$lib/types').Unit} unit
 */
export function formatQuantity(quantity, unit) {
	return `${round(quantity)} ${UNIT_LABELS[unit]}`.trim();
}

/** @param {import('$lib/types').Unit} unit */
export function unitLabel(unit) {
	return unit === 'count' ? 'count' : unit;
}

/**
 * A number with its noun, for example "1 item" or "3 items".
 * @param {number} count
 * @param {string} noun
 */
export function plural(count, noun) {
	return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

/** @param {string | number} date */
export function formatDate(date) {
	return new Date(date).toLocaleDateString(undefined, { dateStyle: 'medium' });
}

/** @param {string | number} date */
export function formatDateTime(date) {
	return new Date(date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function nowMs() {
	return Date.now();
}

/** @param {string} text */
export function isUrl(text) {
	return /^https?:\/\//i.test(text.trim());
}

/** A greeting for the time of day. */
export function greeting() {
	const hour = new Date().getHours();
	if (hour < 12) return 'Good morning';
	return hour < 18 ? 'Good afternoon' : 'Good evening';
}

/** The date of today in words, for example "Friday, October 2". */
export function todayInWords() {
	return new Date().toLocaleDateString(undefined, {
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	});
}
