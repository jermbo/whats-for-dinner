import { db } from '$lib/db/db';
import { newId, now } from '$lib/db/ids';
import { indexBy } from '$lib/util/collections';

/**
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {import('$lib/types').RecipeStep} RecipeStep
 */

/** The name of a recipe that has steps or ingredients, but no name yet. */
const NO_NAME = 'New recipe';

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

/**
 * Saves the text of a recipe: all fields but the photos. Rows that the owner left empty are
 * removed. The photos of each step and the cover come from the stored recipe, because Cook
 * mode can add a photo while a form has an older copy.
 * A step that is no longer in the recipe goes away with its photos.
 * @param {Recipe} recipe
 * @returns {Promise<Recipe>}
 */
export function saveRecipe(recipe) {
	return db.transaction('rw', db.recipes, db.photos, async () => {
		const stored = recipe.id ? await db.recipes.get(recipe.id) : undefined;
		const storedSteps = indexBy(stored?.steps ?? [], 'id');

		/** @type {RecipeStep[]} */
		const steps = recipe.steps
			.map((step) => ({
				id: step.id,
				text: step.text.trim(),
				photoIds: storedSteps.get(step.id)?.photoIds ?? [],
				selectedPhotoId: storedSteps.get(step.id)?.selectedPhotoId ?? null
			}))
			// A step with photos stays when its text is empty: the owner can type the text again.
			.filter((step) => step.text || step.photoIds.length > 0);

		const kept = new Set(steps.map((step) => step.id));
		const gone = (stored?.steps ?? []).filter((step) => !kept.has(step.id));
		await db.photos.bulkDelete(gone.flatMap((step) => step.photoIds));

		const time = now();
		/** @type {Recipe} */
		const record = {
			...recipe,
			id: recipe.id || newId(),
			name: recipe.name.trim() || NO_NAME,
			source: recipe.source.trim(),
			servings: Number(recipe.servings) || 1,
			steps,
			coverPhotoId: stored?.coverPhotoId ?? null,
			// An empty number field gives null, so each number is made safe here.
			ingredients: recipe.ingredients
				.filter((row) => row.ingredientId)
				.map((row) => ({ ...row, quantity: Number(row.quantity) || 0 })),
			prepSteps: recipe.prepSteps
				.filter((step) => step.text.trim())
				.map((step) => ({ text: step.text.trim(), leadHours: Number(step.leadHours) || 0 })),
			createdAt: stored?.createdAt || recipe.createdAt || time,
			updatedAt: time
		};
		await db.recipes.put(record);
		return record;
	});
}

/**
 * Groups for the menu screen. "To try" is automatic: a recipe with no cook session.
 * @param {Recipe[]} recipes
 * @param {Set<string>} cookedIds The IDs of the recipes that have a cook session.
 * @returns {{ title: string, recipes: Recipe[] }[]}
 */
export function recipeGroups(recipes, cookedIds) {
	const sorted = [...recipes].sort((a, b) => a.name.localeCompare(b.name));
	const cooked = sorted.filter((recipe) => cookedIds.has(recipe.id));
	return [
		{ title: 'To try', recipes: sorted.filter((recipe) => !cookedIds.has(recipe.id)) },
		{ title: 'In rotation', recipes: cooked.filter((recipe) => recipe.inRotation) },
		{ title: 'Other recipes', recipes: cooked.filter((recipe) => !recipe.inRotation) }
	].filter((group) => group.recipes.length > 0);
}

/**
 * Deletes a recipe with its step photos. The cook history stays, with its finished photos.
 * A cook session that is open is not history yet, so it goes.
 * @param {string} id
 */
export function deleteRecipe(id) {
	return db.transaction('rw', db.recipes, db.menu, db.sessions, db.photos, async () => {
		const recipe = await db.recipes.get(id);
		const sessions = await db.sessions.where('recipeId').equals(id).toArray();
		const open = sessions.filter((session) => !session.cookedAt);

		const photoIds = [
			...(recipe?.steps.flatMap((step) => step.photoIds) ?? []),
			...open.flatMap((session) => session.photoId ?? [])
		];
		// The cover is the finished photo of a cook session. A cover from a recipe file has no
		// session on this device, so it goes with the recipe.
		const cover = recipe?.coverPhotoId;
		if (cover && !sessions.some((session) => session.cookedAt && session.photoId === cover)) {
			photoIds.push(cover);
		}

		await db.photos.bulkDelete(photoIds);
		await db.sessions.bulkDelete(open.map((session) => session.id));
		await db.menu.where('recipeId').equals(id).delete();
		await db.recipes.delete(id);
	});
}
