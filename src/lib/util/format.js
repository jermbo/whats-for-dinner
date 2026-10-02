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
 * The amount that one tap on plus or minus changes.
 * @param {import('$lib/types').Unit} unit
 */
export function stepFor(unit) {
	return unit === 'count' ? 1 : 50;
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
