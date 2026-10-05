import { splitByTimes } from '$lib/domain/step-text';
import { finishedPhoto } from './cook-photos';
import { daysAgo, id, SAMPLE_PREFIX } from './keys';
import { stepId } from './recipes';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {import('$lib/types').CardVisit} CardVisit
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
	['spaghetti', 24, 3, 'The sauce was thin.'],
	['spaghetti', 17, 4, ''],
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
 * The meals that the owner marked with one tap on "Cooked", with no Cook mode: session names.
 * Such a session has only the end time. All other sessions are from Cook mode, so they have
 * a start time and the time of each card.
 */
const ONE_TAP = new Set(['overnight-oats-12', 'quesadillas-4', 'scrambled-eggs-3']);

/**
 * The notes that the owner wrote on a step while cooking: session name, step number, and text.
 * One step of the chicken bowl has two notes, from two cooks.
 * @type {Record<string, [number, string][]>}
 */
const STEP_NOTES = {
	'spaghetti-24': [[2, 'Simmer for 20 minutes. The sauce is thick then.']],
	'chicken-bowl-13': [[3, 'Two garlic cloves are not sufficient. Use four.']],
	'fried-rice-6': [[1, 'Boil the rice the day before.']],
	'chicken-bowl-2': [[3, 'Four garlic cloves are correct.']],
	'lentil-soup-1': [[4, 'Add lemon juice at the end.']]
};

const MINUTE = 60 * 1000;
/** The time that the owner uses for a card: to read it and to do it. A timer adds to it. */
const CARD_MS = 2 * MINUTE;

/**
 * The cards that the owner opened in one cook, with the time of each: the ingredients, each
 * step, and the finished card. A step with a time in its text takes that time longer, as in
 * a real cook. The last card ends at "Cooked".
 * @param {Recipe} recipe
 * @param {string} cookedAt
 * @returns {{ startedAt: string, visits: CardVisit[] }}
 */
function cookVisits(recipe, cookedAt) {
	const cards = [
		{ card: 'ingredients', ms: CARD_MS },
		...recipe.steps.map((step) => ({
			card: step.id,
			ms:
				CARD_MS +
				splitByTimes(step.text).reduce((total, part) => total + (part.seconds ?? 0), 0) * 1000
		})),
		{ card: 'finished', ms: CARD_MS }
	];

	let time = Date.parse(cookedAt) - cards.reduce((total, card) => total + card.ms, 0);
	const startedAt = new Date(time).toISOString();
	const visits = cards.map(({ card, ms }) => {
		const visit = { card, at: new Date(time).toISOString() };
		time += ms;
		return visit;
	});
	return { startedAt, visits };
}

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

		const name = `${key}-${days}`;
		const cookedAt = daysAgo(days);
		const { startedAt, visits } = ONE_TAP.has(name)
			? { startedAt: null, visits: [] }
			: cookVisits(recipe, cookedAt);
		/** The time when the owner opened a step: a note on the step has this time. */
		const visitedAt = (/** @type {string} */ card) =>
			visits.find((visit) => visit.card === card)?.at ?? cookedAt;

		sessions.push({
			id: sessionId,
			recipeId: recipe.id,
			recipeName: recipe.name,
			kind: 'recipe',
			startedAt,
			servings: recipe.servings,
			photoId: finishedPhoto(key, days),
			visits,
			stepNotes: (STEP_NOTES[name] ?? []).map(([number, text]) => ({
				id: id(`note-${name}-${number}`),
				stepId: stepId(key, number),
				text,
				at: visitedAt(stepId(key, number))
			})),
			timers: [],
			// In Cook mode, the owner checks each ingredient on the first card.
			checked: startedAt ? recipe.ingredients.map((row) => row.ingredientId) : [],
			menuItem: {
				id: id(`menu-old-${key}-${days}`),
				kind: 'recipe',
				recipeId: recipe.id,
				addedAt: daysAgo(days + 2),
				prepDoneAt: null,
				night: null,
				updatedAt: daysAgo(days + 2)
			},
			cookedAt,
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
