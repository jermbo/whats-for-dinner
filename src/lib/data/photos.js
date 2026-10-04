/**
 * The address of the photo of a recipe that has no cover: the URL of the recipe, if it has one.
 * Empty: the recipe has no photo. Then the name of the recipe is the picture, on an olive card.
 * @param {import('$lib/types').Recipe} recipe
 */
export function recipePhoto(recipe) {
	return recipe.photo?.trim() ?? '';
}

/**
 * True when the recipe has a photo: a cover from the database, or a photo URL.
 * @param {import('$lib/types').Recipe} recipe
 */
export function hasPhoto(recipe) {
	return Boolean(recipe.coverPhotoId) || recipePhoto(recipe) !== '';
}
