import { CATEGORIES, MEAL_TYPES } from './options';

/**
 * The preferences: the rules of the app that the owner can change. See docs/settings/.
 *
 * @typedef {import('$lib/types').MealType} MealType
 * @typedef {import('$lib/types').Preference} Preference
 *
 * @typedef {{
 *   mealsInWeek: number,
 *   weekStartsOn: number,
 *   doubtDays: number,
 *   categoryOrder: string[],
 *   mealTypes: MealType[],
 *   recipeServings: number,
 *   timerSound: boolean,
 *   vibration: boolean,
 *   screenOn: boolean,
 *   lessMotion: boolean
 * }} Preferences
 *   weekStartsOn: the day as "Date.getDay()" gives it, where 0 is Sunday.
 *   categoryOrder: all categories, in the sequence of the store.
 *   mealTypes: the types of recipe that Menu proposes. It has one type or more.
 *   lessMotion: false follows the setting of the device. True is less motion in this app.
 *
 * @typedef {keyof Preferences} PreferenceKey
 */

/** The default of each preference: the value that the app uses until the owner changes it. */
export const DEFAULTS = /** @type {Preferences} */ ({
	mealsInWeek: 5,
	weekStartsOn: 1,
	doubtDays: 7,
	categoryOrder: CATEGORIES,
	mealTypes: MEAL_TYPES.map((type) => type.value),
	recipeServings: 2,
	timerSound: true,
	vibration: true,
	screenOn: true,
	lessMotion: false
});

/**
 * The planning preferences: each one is a fact about the kitchen, so a backup has it.
 * The other preferences are a fact about one device, and they stay on that device.
 * @type {PreferenceKey[]}
 */
export const PLANNING = [
	'mealsInWeek',
	'weekStartsOn',
	'doubtDays',
	'categoryOrder',
	'mealTypes',
	'recipeServings'
];

/** The smallest and the largest value of each preference that is a number. */
export const RANGES = {
	mealsInWeek: [1, 14],
	weekStartsOn: [0, 6],
	doubtDays: [2, 14],
	recipeServings: [1, 12]
};

/** @param {string} key */
const isKey = (key) => key in DEFAULTS;

/**
 * A value that the app can use for a preference. A value that is not valid, such as a text for
 * a number, gives the default. A file from a different version of the app can have such a value.
 * @template {PreferenceKey} K
 * @param {K} key
 * @param {unknown} value
 * @returns {Preferences[K]}
 */
export function validValue(key, value) {
	const fallback = DEFAULTS[key];
	/** @param {unknown} valid */
	const as = (valid) => /** @type {Preferences[K]} */ (valid);

	/** @type {unknown[]} */
	const list = Array.isArray(value) ? value : [];

	if (key === 'categoryOrder') {
		// The categories of the value, each one time, in its sequence. A category that the value
		// does not have goes to the end: the list is always complete.
		const first = CATEGORIES.filter((name) => list.includes(name)).sort(
			(a, b) => list.indexOf(a) - list.indexOf(b)
		);
		return as([...first, ...CATEGORIES.filter((name) => !first.includes(name))]);
	}
	if (key === 'mealTypes') {
		const types = MEAL_TYPES.map((type) => type.value).filter((type) => list.includes(type));
		return types.length > 0 ? as(types) : fallback;
	}
	if (key in RANGES) {
		const [min, max] = RANGES[/** @type {keyof typeof RANGES} */ (key)];
		const valid = typeof value === 'number' && Number.isInteger(value);
		return valid && value >= min && value <= max ? as(value) : fallback;
	}
	return typeof value === 'boolean' ? as(value) : fallback;
}

/**
 * The value of each preference: the value of its row, or the default when it has no row.
 * @param {Preference[]} rows The preferences that the owner changed.
 * @returns {Preferences}
 */
export function preferencesOf(rows) {
	/** @type {Record<string, unknown>} */
	const values = { ...DEFAULTS };
	for (const row of rows) {
		if (isKey(row.key))
			values[row.key] = validValue(/** @type {PreferenceKey} */ (row.key), row.value);
	}
	return /** @type {Preferences} */ (values);
}

/**
 * The rows of the planning preferences, each with a valid value. A row of a preference that
 * the app does not know is not in the result.
 * @param {Preference[]} rows
 * @returns {Preference[]}
 */
export function planningRows(rows) {
	return rows
		.filter((row) => PLANNING.includes(/** @type {PreferenceKey} */ (row.key)))
		.map((row) => ({
			key: row.key,
			value: validValue(/** @type {PreferenceKey} */ (row.key), row.value)
		}));
}
