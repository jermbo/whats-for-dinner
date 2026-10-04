/** @typedef {import('$lib/types').Recipe} Recipe */

/**
 * The most characters that the form accepts in the name of a recipe. A name is a title on a card
 * and on a screen, so it must stay short. A name that is longer already (an import) is not cut.
 */
export const RECIPE_NAME_MAX = 50;

/** @returns {Recipe} */
export function blankRecipe() {
	return {
		id: '',
		name: '',
		mealType: 'dinner',
		servings: 2,
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
