import { daysAgo, id, SAMPLE_PREFIX } from './keys';
import { stepId } from './recipes';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {import('$lib/types').CookSession} CookSession
 * @typedef {import('$lib/types').PantryChange} PantryChange
 */

/** The last pantry check was this many days ago. */
export const CHECK_DAYS = 5;

/**
 * The meals that were cooked: recipe key, days ago, rating, and note.
 * The meals after the last pantry check give the doubts of the next check.
 * @type {[string, number, number, string][]}
 */
const MEALS = [
	['chicken-bowl', 13, 5, 'Very good. Use more garlic the next time.'],
	['overnight-oats', 12, 4, ''],
	['spaghetti', 10, 4, 'Fast and easy.'],
	['pancakes', 8, 5, 'Use less sugar.'],
	['fried-rice', 6, 3, 'The rice was too wet. Use rice from the day before.'],
	['quesadillas', 4, 4, ''],
	['scrambled-eggs', 3, 3, ''],
	['chicken-bowl', 2, 5, 'More garlic was correct.'],
	['lentil-soup', 1, 4, 'Add lemon juice at the end.']
];

/**
 * The notes that the owner wrote on a step while cooking: session name, step number, and text.
 * A session with a note is a session from Cook mode, so it also has a start time.
 * @type {Record<string, [number, string][]>}
 */
const STEP_NOTES = {
	'chicken-bowl-13': [[3, 'Two garlic cloves are not sufficient. Use four.']],
	'fried-rice-6': [[1, 'Boil the rice the day before.']],
	'lentil-soup-1': [[4, 'Add lemon juice at the end.']]
};

/** A cook from Cook mode started this many minutes before "Cooked". */
const COOK_MINUTES = 35;

/** The meal on the menu that is the leftovers of the last lentil soup. */
export const LEFTOVER_MENU_ID = id('menu-leftover-lentil-soup');

/**
 * @param {string} name
 * @param {string} key Ingredient key.
 * @param {PantryChange['cause']} cause
 * @param {number} delta
 * @param {number} days
 * @param {string | null} [sessionId]
 * @returns {PantryChange}
 */
function change(name, key, cause, delta, days, sessionId = null) {
	return {
		id: id(`log-${name}`),
		ingredientId: id(key),
		cause,
		delta,
		state: null,
		sessionId,
		at: daysAgo(days)
	};
}

/**
 * The cook sessions, and the pantry changes that they and the owner made.
 * @param {Recipe[]} recipes
 * @param {Ingredient[]} ingredients
 * @returns {{ sessions: CookSession[], log: PantryChange[] }}
 */
export function sampleHistory(recipes, ingredients) {
	const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]));
	const measured = new Set(
		ingredients
			.filter((ingredient) => ingredient.tracking === 'quantity')
			.map((ingredient) => ingredient.id)
	);

	/** @type {CookSession[]} */
	const sessions = [];
	/** @type {PantryChange[]} */
	const log = [];

	for (const [key, days, rating, note] of MEALS) {
		const recipe = recipesById.get(id(key));
		if (!recipe) continue;

		const sessionId = id(`session-${key}-${days}`);
		const deductions = recipe.ingredients
			.filter((row) => measured.has(row.ingredientId))
			.map((row) => ({ ingredientId: row.ingredientId, amount: row.quantity }));

		for (const { ingredientId, amount } of deductions) {
			const ingredientKey = ingredientId.slice(SAMPLE_PREFIX.length);
			log.push(
				change(
					`cooked-${key}-${days}-${ingredientKey}`,
					ingredientKey,
					'cooked',
					-amount,
					days,
					sessionId
				)
			);
		}

		const notes = STEP_NOTES[`${key}-${days}`] ?? [];

		sessions.push({
			id: sessionId,
			recipeId: recipe.id,
			recipeName: recipe.name,
			kind: 'recipe',
			startedAt: notes.length > 0 ? daysAgo(days + COOK_MINUTES / (24 * 60)) : null,
			servings: recipe.servings,
			photoId: null,
			visits: [],
			stepNotes: notes.map(([number, text]) => ({
				id: id(`note-${key}-${days}-${number}`),
				stepId: stepId(key, number),
				text,
				at: daysAgo(days)
			})),
			timers: [],
			checked: [],
			menuItem: {
				id: id(`menu-old-${key}-${days}`),
				kind: 'recipe',
				recipeId: recipe.id,
				addedAt: daysAgo(days + 2),
				prepDoneAt: null,
				updatedAt: daysAgo(days + 2)
			},
			cookedAt: daysAgo(days),
			rating,
			note,
			deductions,
			leftoverMenuId: key === 'lentil-soup' ? LEFTOVER_MENU_ID : null,
			updatedAt: daysAgo(days)
		});
	}

	log.push(
		// The owner looked at the cheese after the quesadillas. Thus the check has no doubt about it.
		change('corrected-cheddar', 'cheddar', 'corrected', -30, 3),
		// A "Cooked" that the owner undid. It must not give a doubt.
		change('cooked-coconut', 'coconut', 'cooked', -400, 1.5),
		change('undo-coconut', 'coconut', 'undo', 400, 1.4)
	);

	return { sessions, log };
}
