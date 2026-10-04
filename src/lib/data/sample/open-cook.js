import { hoursAgo, id } from './keys';

/**
 * @typedef {import('$lib/types').CookSession} CookSession
 * @typedef {import('$lib/types').MenuItem} MenuItem
 * @typedef {import('$lib/types').Recipe} Recipe
 */

/** The meal on the menu that the owner is in the middle of. */
const RECIPE_KEY = 'spaghetti';

/** @param {number} minutes A negative number is a time after now. */
const minutesAgo = (minutes) => hoursAgo(minutes / 60);

/**
 * A cook session that is open: Cook mode started 9 minutes ago, and "Cooked" did not occur
 * yet. The owner checked the ingredients, did step 1, and is on step 2, where the timer of
 * the sauce runs for 12 more minutes.
 * So the card of the meal on the Today screen shows "Continue", and Cook mode opens on step 2
 * with a timer chip.
 * @param {Recipe[]} recipes
 * @param {MenuItem[]} menu
 * @returns {CookSession[]} One session, or none when the meal is not on the menu.
 */
export function sampleOpenCook(recipes, menu) {
	const recipe = recipes.find((item) => item.id === id(RECIPE_KEY));
	const item = menu.find((entry) => entry.recipeId === recipe?.id && entry.kind === 'recipe');
	const [first, second] = recipe?.steps ?? [];
	if (!recipe || !item || !first || !second) return [];

	return [
		{
			id: id(`session-open-${RECIPE_KEY}`),
			recipeId: recipe.id,
			recipeName: recipe.name,
			kind: 'recipe',
			menuItem: item,
			startedAt: minutesAgo(9),
			cookedAt: '',
			servings: recipe.servings,
			rating: null,
			note: '',
			deductions: [],
			leftoverMenuId: null,
			photoId: null,
			visits: [
				{ card: 'ingredients', at: minutesAgo(9) },
				{ card: first.id, at: minutesAgo(8) },
				{ card: second.id, at: minutesAgo(3) }
			],
			stepNotes: [],
			// "Simmer for 15 minutes" is the first time in the text of step 2.
			timers: [
				{
					id: id(`timer-open-${RECIPE_KEY}`),
					stepId: second.id,
					index: 0,
					seconds: 15 * 60,
					endsAt: minutesAgo(-12)
				}
			],
			checked: recipe.ingredients.map((row) => row.ingredientId),
			updatedAt: minutesAgo(3)
		}
	];
}
