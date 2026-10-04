/**
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {import('$lib/types').RecipeStep} RecipeStep
 * @typedef {{ key: 'ingredients', kind: 'ingredients' }} IngredientsCard
 * @typedef {{ key: string, kind: 'step', step: RecipeStep, number: number }} StepCard
 * @typedef {{ key: 'finished', kind: 'finished' }} FinishedCard
 * @typedef {IngredientsCard | StepCard | FinishedCard} CookCard
 */

/**
 * The steps that Cook mode shows. A step with no text has nothing to show.
 * @param {Recipe} recipe
 */
export function stepsToCook(recipe) {
	return recipe.steps.filter((step) => step.text.trim());
}

/**
 * The cards of Cook mode: the ingredients, one card for each step, and the finished card.
 * A recipe with no ingredient list has no ingredients card.
 * The key of a step card is the ID of the step. The cook session records each key that the
 * owner opens.
 * @param {Recipe} recipe
 * @returns {CookCard[]}
 */
export function cookCards(recipe) {
	return [
		...(recipe.ingredients.length > 0
			? [/** @type {IngredientsCard} */ ({ key: 'ingredients', kind: 'ingredients' })]
			: []),
		...stepsToCook(recipe).map(
			(step, index) =>
				/** @type {StepCard} */ ({ key: step.id, kind: 'step', step, number: index + 1 })
		),
		{ key: 'finished', kind: 'finished' }
	];
}

/**
 * Where the owner is in a meal: the step of the last card that the owner opened. A card that is
 * not a step card gives step 0, so the bar is empty at the start.
 * @param {Recipe} recipe
 * @param {import('$lib/types').CookSession} session
 * @returns {{ step: number, total: number, next: string }}
 *   next: the text of the step after the current one. Empty at the last step.
 */
export function cookProgress(recipe, session) {
	const steps = stepsToCook(recipe);
	const last = session.visits.at(-1)?.card;
	const index = steps.findIndex((step) => step.id === last);
	const next = steps[index + 1]?.text.trim() ?? '';
	return { step: index + 1, total: steps.length, next };
}
