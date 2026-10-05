/** @typedef {import('$lib/types').Recipe} Recipe */

const HOUR = 60 * 60 * 1000;

/**
 * The most characters that the form accepts in the name of a recipe. A name is a title on a card
 * and on a screen, so it must stay short. A name that is longer already (an import) is not cut.
 */
export const RECIPE_NAME_MAX = 50;

/**
 * @param {number} servings The servings that a new recipe starts with.
 * @returns {Recipe}
 */
export function blankRecipe(servings) {
	return {
		id: '',
		name: '',
		mealType: 'dinner',
		servings,
		minutes: null,
		steps: [],
		source: '',
		coverPhotoId: null,
		inRotation: false,
		ingredients: [],
		prepSteps: [],
		createdAt: '',
		updatedAt: ''
	};
}

/**
 * True when a recipe has something to save: a name, a step, or an ingredient.
 * @param {Recipe} recipe
 */
export function hasContent(recipe) {
	return Boolean(
		recipe.name.trim() ||
		recipe.steps.some((step) => step.text.trim()) ||
		recipe.ingredients.some((row) => row.ingredientId)
	);
}

/** A meal of this many minutes, or fewer, is "quick". */
const QUICK_MINUTES = 30;

/**
 * The minutes that a meal takes: the real time of the last cook in Cook mode, or the number
 * that the owner typed. Null: not known.
 * @param {Recipe} recipe
 * @param {import('$lib/types').CookSession | undefined} last The last cook session of the recipe.
 * @returns {number | null}
 */
export function cookMinutes(recipe, last) {
	if (last?.startedAt && last.cookedAt) {
		const minutes = (Date.parse(last.cookedAt) - Date.parse(last.startedAt)) / 60_000;
		// A session of less than a minute is a tap on "Cooked", and not a cook.
		if (minutes >= 1) return Math.round(minutes);
	}
	return recipe.minutes ?? null;
}

/**
 * True for a meal that takes little time. A meal with no known time is not quick.
 * @param {number | null} minutes
 */
export function isQuick(minutes) {
	return minutes !== null && minutes <= QUICK_MINUTES;
}

/**
 * The lead time of the preparation of a recipe, in hours. Zero: no preparation.
 * @param {Recipe} recipe
 */
export function leadHours(recipe) {
	return Math.max(0, ...recipe.prepSteps.map((step) => step.leadHours));
}

/**
 * The time when a meal is ready: the lead time of its recipe after the preparation.
 * @param {Recipe} recipe
 * @param {number} doneMs The time when the preparation is done, in milliseconds.
 * @returns {number} In milliseconds.
 */
export function readyAfter(recipe, doneMs) {
	return doneMs + leadHours(recipe) * HOUR;
}
