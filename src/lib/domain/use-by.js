// The use-by date of the food in stock: how long a food keeps, and how many days are left.
import { DAY } from '$lib/util/time';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {import('$lib/types').UseWithin} UseWithin
 * @typedef {{ text: string, urgent: boolean }} UseByBadge
 */

/** The usual days of a perishable food, by its category, until the owner gives a number. */
const USUAL_DAYS = /** @type {Record<string, number>} */ ({
	Produce: 7,
	'Meat and fish': 2,
	'Dairy and eggs': 10,
	Bakery: 5
});

/** The usual days of a perishable food of a different category. */
const OTHER_DAYS = 7;

/** A row shows a badge when this number of days, or fewer, are left. */
const BADGE_DAYS = 3;

/** The food of "This week" has this number of days left, or fewer. */
const WEEK_DAYS = 7;

/**
 * The usual number of days that a food keeps out of the freezer. Null: the food keeps.
 * @param {Pick<Ingredient, 'perishable' | 'category' | 'keepsDays'>} ingredient
 * @returns {number | null}
 */
export function usualDays(ingredient) {
	if (ingredient.keepsDays) return ingredient.keepsDays;
	if (!ingredient.perishable) return null;
	return USUAL_DAYS[ingredient.category] ?? OTHER_DAYS;
}

/**
 * What the app proposes for "Use within": the freezer for a food that is there, or the usual
 * days of the food. Null: the food keeps, and the app does not ask.
 * @param {Ingredient} ingredient
 * @param {PantryItem | undefined} item The item of the pantry, if there is one.
 * @returns {UseWithin | null}
 */
export function proposeWithin(ingredient, item) {
	const days = usualDays(ingredient);
	if (days === null) return null;
	return item?.location === 'freezer' ? 'freezer' : days;
}

/**
 * The answers that "Use within" shows: the usual days of the food, two common answers, and
 * the freezer.
 * @param {Ingredient} ingredient
 * @returns {{ value: string, label: string }[]}
 */
export function withinChoices(ingredient) {
	const days = [...new Set([usualDays(ingredient) ?? WEEK_DAYS, 3, WEEK_DAYS])];
	return [
		...days
			.sort((a, b) => a - b)
			.map((value) => ({ value: String(value), label: daysLabel(value) })),
		{ value: 'freezer', label: 'Freezer' }
	];
}

/**
 * A number of days as a short label: "3 d", "1 wk".
 * @param {number} days
 */
function daysLabel(days) {
	return days % 7 === 0 ? `${days / 7} wk` : `${days} d`;
}

/**
 * The use-by time of stock that comes in now.
 * @param {number} days
 * @param {number} time
 */
export function useByIn(days, time) {
	return new Date(time + days * DAY).toISOString();
}

/**
 * The use-by time of an item after new stock comes in. The old stock spoils first, so its
 * time stays when it is the earlier one. Food in the freezer keeps.
 * @param {Pick<PantryItem, 'useBy' | 'location'>} item The item before the change.
 * @param {boolean} hadStock True when the item was not empty.
 * @param {string | null} fresh The use-by time of the new stock.
 * @returns {string | null}
 */
export function useByAfterStock(item, hadStock, fresh) {
	if (item.location === 'freezer') return null;
	if (hadStock && item.useBy && (!fresh || item.useBy < fresh)) return item.useBy;
	return fresh;
}

/** @param {number} time */
function dayOf(time) {
	return new Date(time).setHours(0, 0, 0, 0);
}

/**
 * The days until the use-by date: 0 is today, and a negative number is a date in the past.
 * Null: the food keeps.
 * @param {Pick<PantryItem, 'useBy'>} item
 * @param {number} time
 * @returns {number | null}
 */
export function daysLeft(item, time) {
	if (!item.useBy) return null;
	return Math.round((dayOf(Date.parse(item.useBy)) - dayOf(time)) / DAY);
}

/**
 * The days that are left, in words: "Use today", "1 day", "3 days".
 * @param {number} left
 */
export function leftText(left) {
	if (left <= 0) return 'Use today';
	return `${left} ${left === 1 ? 'day' : 'days'}`;
}

/**
 * True for food that must go today. Only this food gets the tomato colour.
 * @param {number} left
 */
export function isUrgent(left) {
	return left <= 0;
}

/**
 * The badge of a row: only in the last three days.
 * @param {number | null} left
 * @returns {UseByBadge | null}
 */
export function useByBadge(left) {
	if (left === null || left > BADGE_DAYS) return null;
	return { text: leftText(left), urgent: isUrgent(left) };
}

/**
 * The group of the "Use soon" view for a number of days.
 * @param {number | null} left
 * @returns {'today' | 'week' | 'keeps'}
 */
export function soonGroup(left) {
	if (left === null || left > WEEK_DAYS) return 'keeps';
	return left <= 0 ? 'today' : 'week';
}
