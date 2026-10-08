import { DAY } from './time';

/** @type {Record<import('$lib/types').Unit, string>} */
const UNIT_LABELS = { g: 'g', ml: 'ml', count: '' };

/** @param {number} value */
export function round(value) {
	return Math.round(value * 100) / 100;
}

/** The large unit of a weight and of a volume: 1000 of the small unit. */
const LARGE_UNITS = { g: 'kg', ml: 'L', count: '' };

/**
 * A quantity with its unit, as a label on a package: "600 g", "1.2 L", "1 kg", "8".
 * @param {number} quantity
 * @param {import('$lib/types').Unit} unit
 */
export function formatQuantity(quantity, unit) {
	if (unit !== 'count' && Math.abs(quantity) >= 1000) {
		return `${round(quantity / 1000)} ${LARGE_UNITS[unit]}`;
	}
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

/**
 * A number with its noun and its verb, for example "1 item is" or "3 items are".
 * @param {number} count
 * @param {string} noun
 */
export function pluralIs(count, noun) {
	return `${plural(count, noun)} ${count === 1 ? 'is' : 'are'}`;
}

/** A list of names shows this many. The others are a count. */
const MAX_NAMES = 3;

/**
 * Some names as a part of a sentence: "Yogurt, lemons and rice", "Rice, milk, eggs and 2 more".
 * @param {string[]} names
 */
export function nameList(names) {
	const [first, ...others] = names.slice(0, MAX_NAMES);
	if (first === undefined) return '';
	const more = names.length - MAX_NAMES;
	const words = [first, ...others.map((name) => name.toLowerCase())];
	if (more > 0) return `${words.join(', ')} and ${more} more`;
	if (words.length === 1) return first;
	return `${words.slice(0, -1).join(', ')} and ${words.at(-1)}`;
}

/**
 * A day as a receipt prints it: "28 Sep".
 * @param {string | number} date
 */
export function formatShortDay(date) {
	return new Date(date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
}

/**
 * An amount of money with two decimals, for example "42.80". All prices are in one currency,
 * so there is no symbol.
 * @param {number} amount
 */
export function formatMoney(amount) {
	return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * A day with no year, for example "October 3".
 * @param {string | number} date
 */
export function formatDay(date) {
	return new Date(date).toLocaleDateString(undefined, { day: 'numeric', month: 'long' });
}

/** @param {string | number} date */
export function formatDate(date) {
	return new Date(date).toLocaleDateString(undefined, { dateStyle: 'medium' });
}

/**
 * The time since a date in words, for example "yesterday" or "3 days ago".
 * @param {string | number} date
 */
export function formatAgo(date) {
	const days = Math.round((Date.now() - new Date(date).getTime()) / DAY);
	return new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' }).format(-days, 'day');
}

/**
 * A moment in the next days in words, for example "today at 7:30 PM" or "tomorrow at 9:00 AM".
 * @param {number} ms
 */
export function formatWhen(ms) {
	const date = new Date(ms);
	const start = (/** @type {Date} */ day) => new Date(day).setHours(0, 0, 0, 0);
	const days = Math.round((start(date) - start(new Date())) / DAY);
	const day =
		days >= 0 && days <= 1
			? new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' }).format(days, 'day')
			: date.toLocaleDateString(undefined, { weekday: 'long' });
	const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
	return `${day} at ${time}`;
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

/** The word for the time of day. It is the title of the Today screen, for example "Evening". */
export function greeting() {
	const hour = new Date().getHours();
	if (hour < 12) return 'Morning';
	return hour < 18 ? 'Afternoon' : 'Evening';
}

/** The date of today, short, for example "Sunday 4 Oct". */
export function todayInWords() {
	const now = new Date();
	const weekday = now.toLocaleDateString(undefined, { weekday: 'long' });
	const month = now.toLocaleDateString(undefined, { month: 'short' });
	return `${weekday} ${now.getDate()} ${month}`;
}
