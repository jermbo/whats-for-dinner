// What the app reads in the text of a step: the times and the names of the ingredients.
// A step stores only its text. The app reads the text each time it shows the step, so a timer
// or an ingredient can never disagree with the text.

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').RecipeIngredient} RecipeIngredient
 * @typedef {{ text: string, seconds?: number, index?: number }} TextPart
 *   A part with "seconds" is a time. "index" is its place in the step: 0 for the first time.
 */

const NUMBER = String.raw`\d+(?:[.,]\d+)?`;
const UNIT = String.raw`(hours?|hrs?|h|minutes?|mins?|seconds?|secs?)`;
/** One amount: "12 minutes", "1 h", or "3 to 4 minutes". A range uses its first number. */
const AMOUNT = String.raw`(${NUMBER})(?:\s*(?:to|-|–)\s*${NUMBER})?\s*${UNIT}\b`;
/** A time: one amount, or two amounts such as "1 hour 30 minutes". */
const TIME = new RegExp(String.raw`${AMOUNT}(?:\s*(?:and\s+)?${AMOUNT})?`, 'gi');

/** @param {string} unit */
function secondsIn(unit) {
	const letter = unit[0].toLowerCase();
	if (letter === 'h') return 3600;
	return letter === 'm' ? 60 : 1;
}

/**
 * @param {string} number
 * @param {string} unit
 */
function amount(number, unit) {
	return Number(number.replace(',', '.')) * secondsIn(unit);
}

/**
 * The text of a step in parts. A part that is a time has its length in seconds.
 * "Degrees" and "grams" are not time words, so "200 degrees" is not a time.
 * @param {string} text
 * @returns {TextPart[]}
 */
export function splitByTimes(text) {
	/** @type {TextPart[]} */
	const parts = [];
	let end = 0;
	let index = 0;

	for (const match of text.matchAll(TIME)) {
		const [found, first, firstUnit, second, secondUnit] = match;
		const seconds = amount(first, firstUnit) + (second ? amount(second, secondUnit) : 0);
		if (seconds <= 0) continue;

		if (match.index > end) parts.push({ text: text.slice(end, match.index) });
		parts.push({ text: found, seconds: Math.round(seconds), index });
		end = match.index + found.length;
		index += 1;
	}

	if (end < text.length) parts.push({ text: text.slice(end) });
	return parts;
}

/**
 * The times in the text of a step, each with its words, its place, and its length.
 * @param {string} text
 * @returns {{ text: string, index: number, seconds: number }[]}
 */
export function timesIn(text) {
	return splitByTimes(text).flatMap((part) =>
		part.seconds === undefined || part.index === undefined
			? []
			: [{ text: part.text, index: part.index, seconds: part.seconds }]
	);
}

/** @param {string} text */
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * True when a text has the name of an ingredient. Capital letters and a plural "s" make no
 * difference: "Eggs" is in "add the egg", and "Rice" is in "the rice".
 * @param {string} name
 * @param {string} text In small letters.
 */
function nameIn(name, text) {
	const lower = name.trim().toLowerCase();
	if (!lower) return false;

	// "tomatoes" gives "tomatoe" and "tomato". The longer one is first, so that it wins.
	const stems = [lower.replace(/s$/, ''), lower.replace(/es$/, '')].map(escape).join('|');
	return new RegExp(String.raw`(?:^|[^\p{L}\d])(?:${stems})(?:es|s)?(?![\p{L}\d])`, 'u').test(text);
}

/**
 * The ingredient rows of a recipe whose names are in the text of a step.
 * The app does not know how the owner divides an ingredient: a row shows its full quantity
 * in each step that names it.
 * @param {string} text
 * @param {RecipeIngredient[]} rows
 * @param {Map<string, Ingredient>} ingredientsById
 * @returns {{ ingredient: Ingredient, quantity: number }[]}
 */
export function ingredientsIn(text, rows, ingredientsById) {
	const lower = text.toLowerCase();
	return rows.flatMap((row) => {
		const ingredient = ingredientsById.get(row.ingredientId);
		return ingredient && nameIn(ingredient.name, lower)
			? [{ ingredient, quantity: row.quantity }]
			: [];
	});
}

/**
 * A number of seconds as a clock: "12:00", "0:45", or "1:30:00".
 * @param {number} seconds
 */
export function formatClock(seconds) {
	const total = Math.max(0, Math.ceil(seconds));
	const hours = Math.floor(total / 3600);
	const minutes = Math.floor((total % 3600) / 60);
	const two = (/** @type {number} */ value) => String(value).padStart(2, '0');
	return hours > 0
		? `${hours}:${two(minutes)}:${two(total % 60)}`
		: `${minutes}:${two(total % 60)}`;
}
