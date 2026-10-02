const PLACEHOLDER = 'https://picsum.photos/seed';

/**
 * The photo of a recipe. A recipe with no photo gets a placeholder from picsum.photos.
 * The recipe ID is the seed, so one recipe always gets the same placeholder.
 * A placeholder needs a connection. Without one, the screen shows a soft color.
 * @param {import('$lib/types').Recipe} recipe
 * @param {number} width
 * @param {number} height
 */
export function recipePhoto(recipe, width, height) {
	return (
		recipe.photo?.trim() || `${PLACEHOLDER}/${encodeURIComponent(recipe.id)}/${width}/${height}`
	);
}
