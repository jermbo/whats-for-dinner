// How an import merges a recipe file. The text and the photos have different rules:
// the newer text wins as a whole, and the photos of the two sides stay.
import { db } from '$lib/db/db';
import { recipeShape } from '$lib/db/shape';
import { indexBy } from '$lib/util/collections';
import { photoFromText } from './photo-storage';
import { limitStepPhotos } from './step-photos';

/**
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').Photo} Photo
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {import('$lib/types').RecipeStep} RecipeStep
 */

/**
 * An ingredient with the same name as an ingredient of the device becomes that one. So "Rice"
 * from the desktop is the rice of the pantry on the phone.
 * @param {Ingredient[]} incoming
 * @returns {Promise<Map<string, string>>} The ingredient ID in the file and the ID on the device.
 */
async function mergeIngredients(incoming) {
	const local = await db.ingredients.toArray();
	/** @type {Map<string, string>} */
	const ids = new Map();

	for (const ingredient of incoming) {
		const same =
			local.find((i) => i.id === ingredient.id) ??
			local.find((i) => i.name.toLowerCase() === ingredient.name.toLowerCase());
		ids.set(ingredient.id, same?.id ?? ingredient.id);
		if (!same) await db.ingredients.add(ingredient);
	}
	return ids;
}

/**
 * The first of the IDs that is in the list.
 * @param {string[]} list
 * @param {(string | null | undefined)[]} ids
 */
function firstIn(list, ...ids) {
	return ids.find((id) => id && list.includes(id)) ?? null;
}

/**
 * The photos of one step after the merge: those of the device and those of the file, oldest
 * first, and then the limit. The selection of the device stays. If the device has none, the
 * selection of the file is used.
 * @param {RecipeStep} step The step with the text that won.
 * @param {RecipeStep | undefined} here The step on the device.
 * @param {RecipeStep | undefined} there The step in the file.
 * @param {Map<string, string>} takenAt The time of each photo that the merge can use.
 * @returns {RecipeStep}
 */
function mergeStep(step, here, there, takenAt) {
	const ids = new Set([...(here?.photoIds ?? []), ...(there?.photoIds ?? [])]);
	const all = [...ids]
		.filter((id) => takenAt.has(id))
		.sort((a, b) => (takenAt.get(a) ?? '').localeCompare(takenAt.get(b) ?? ''));

	const selectedPhotoId =
		firstIn(all, here?.selectedPhotoId, there?.selectedPhotoId) ?? all[0] ?? null;
	const { kept } = limitStepPhotos(all, selectedPhotoId);
	return { id: step.id, text: step.text, photoIds: kept, selectedPhotoId };
}

/**
 * Merges one recipe of a file into the device.
 * @param {Recipe} file
 * @param {Map<string, Photo>} filePhotos The photos of the file.
 * @returns {Promise<boolean>} True when the device changed.
 */
async function mergeRecipe(file, filePhotos) {
	const device = await db.recipes.get(file.id);
	const deviceIds = [
		...(device?.steps.flatMap((step) => step.photoIds) ?? []),
		...(device?.coverPhotoId ? [device.coverPhotoId] : [])
	];
	const devicePhotos = (await db.photos.bulkGet(deviceIds)).filter((photo) => photo !== undefined);

	/** @type {Map<string, string>} The time of each photo of the two sides. */
	const takenAt = new Map();
	for (const photo of [...filePhotos.values(), ...devicePhotos]) {
		takenAt.set(photo.id, photo.takenAt ?? '');
	}

	// The text is one thing that the owner wrote on purpose, so one version wins as a whole.
	const text = device && device.updatedAt >= file.updatedAt ? device : file;
	const here = indexBy(device?.steps ?? [], 'id');
	const there = indexBy(file.steps, 'id');
	const steps = text.steps.map((step) =>
		mergeStep(step, here.get(step.id), there.get(step.id), takenAt)
	);

	const coverPhotoId =
		firstIn([...takenAt.keys()], device?.coverPhotoId, file.coverPhotoId) ?? null;

	/** @type {Recipe} */
	const merged = {
		...text,
		steps,
		coverPhotoId,
		createdAt: device?.createdAt ?? file.createdAt
	};
	if (device && JSON.stringify(merged) === JSON.stringify(device)) return false;

	// A photo of a step that the text does not have, or that is over the limit, goes away.
	const used = new Set([...steps.flatMap((step) => step.photoIds), coverPhotoId]);
	const onDevice = new Set(devicePhotos.map((photo) => photo.id));
	await db.photos.bulkDelete(deviceIds.filter((id) => !used.has(id)));
	await db.photos.bulkPut(
		[...filePhotos.values()].filter((photo) => used.has(photo.id) && !onDevice.has(photo.id))
	);
	await db.recipes.put(merged);
	return true;
}

/**
 * A recipe file adds new recipes and brings the recipes of the device up to date. It changes
 * no pantry, no menu, and no cook history.
 * @param {Record<string, any[]>} data The data of a recipe file.
 * @returns {Promise<string>} A sentence that says what the import did.
 */
export async function mergeRecipes(data) {
	/** @type {Ingredient[]} */
	const ingredients = data.ingredients ?? [];
	// A file from an older version has its steps as one text.
	const recipes = (data.recipes ?? []).map(recipeShape);
	const photos = indexBy((data.photos ?? []).map(photoFromText), 'id');
	let changed = 0;

	await db.transaction('rw', db.ingredients, db.recipes, db.photos, async () => {
		const ids = await mergeIngredients(ingredients);

		for (const recipe of recipes) {
			const mapped = {
				...recipe,
				ingredients: recipe.ingredients.map((row) => ({
					...row,
					ingredientId: ids.get(row.ingredientId) ?? row.ingredientId
				}))
			};
			if (await mergeRecipe(mapped, photos)) changed += 1;
		}
	});

	return `Recipes added or updated: ${changed} of ${recipes.length}.`;
}
