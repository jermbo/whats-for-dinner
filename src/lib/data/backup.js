import { db } from '$lib/db/db';
import { getMeta, setMeta } from '$lib/db/meta';
import { recipeShape, sessionShape } from '$lib/db/shape';
import { newId, now } from '$lib/util/ids';
import { mergeRecipes } from './merge';
import { photoFromText, photoToText } from './photo-storage';

/**
 * The JSON format. It is the contract between devices now, and with a server later.
 * A file has a scope: 'all' is a full backup, 'recipes' has only recipes, their ingredients,
 * and their photos.
 *
 * @typedef {'all' | 'recipes'} Scope
 * @typedef {{ format: string, version: number, scope: Scope, exportedAt: string, data: Record<string, any[]> }} BackupFile
 */

const FORMAT = 'meal-planner';
// Version 2: a product has an ID and a photo, and the file has photos, trips, and purchases.
// Version 3: the steps of a recipe are a list, a recipe file has photos, and a cook session
// has the facts of Cook mode.
const VERSION = 3;

const TABLES = /** @type {const} */ ([
	'ingredients',
	'recipes',
	'pantry',
	'products',
	'photos',
	'trips',
	'purchases',
	'menu',
	'sessions',
	'pantryLog',
	'shopping'
]);

/**
 * @param {Scope} scope
 * @param {Record<string, any[]>} data
 * @returns {BackupFile}
 */
function envelope(scope, data) {
	return { format: FORMAT, version: VERSION, scope, exportedAt: now(), data };
}

/** @returns {Promise<string>} The time of the last full backup, or '' when there was none. */
export async function lastBackupAt() {
	const time = await getMeta('lastBackupAt');
	return typeof time === 'string' ? time : '';
}

/** @returns {Promise<BackupFile>} */
export async function exportAll() {
	/** @type {Record<string, any[]>} */
	const data = {};
	for (const name of TABLES) data[name] = await db.table(name).toArray();
	// A photo is a block of bytes. JSON can contain only text.
	data.photos = await Promise.all(data.photos.map(photoToText));
	await setMeta('lastBackupAt', now());
	return envelope('all', data);
}

/**
 * A recipe file: recipes, the ingredients that they use, their step photos, and their covers.
 * The other finished photos are a part of the cook history, so they stay on the device.
 * @param {string[]} [ids] The recipes of the file. With no IDs, the file has all recipes.
 * @returns {Promise<BackupFile>}
 */
export async function exportRecipes(ids) {
	const all = await db.recipes.toArray();
	const recipes = ids ? all.filter((recipe) => ids.includes(recipe.id)) : all;

	const used = new Set(recipes.flatMap((recipe) => recipe.ingredients.map((r) => r.ingredientId)));
	const ingredients = (await db.ingredients.toArray()).filter((i) => used.has(i.id));

	const photoIds = recipes.flatMap((recipe) => [
		...recipe.steps.flatMap((step) => step.photoIds),
		...(recipe.coverPhotoId ? [recipe.coverPhotoId] : [])
	]);
	const stored = (await db.photos.bulkGet(photoIds)).filter((photo) => photo !== undefined);
	const photos = await Promise.all(stored.map(photoToText));

	return envelope('recipes', { ingredients, recipes, photos });
}

/**
 * @param {unknown} file
 * @returns {Promise<string>} A sentence that says what the import did.
 */
export async function importFile(file) {
	const backup = /** @type {BackupFile} */ (file);
	if (backup?.format !== FORMAT || !backup.data) {
		throw new Error('This file is not a Meal Planner export.');
	}
	if (backup.version > VERSION) {
		throw new Error('This file is from a newer version of Meal Planner.');
	}
	return backup.scope === 'recipes' ? mergeRecipes(backup.data) : replaceAll(backup);
}

/**
 * A full backup replaces all data on the device.
 * @param {BackupFile} backup
 */
async function replaceAll(backup) {
	/** @type {Record<string, any[]>} */
	const data = {
		...backup.data,
		// A file from an older version gets the fields of this version.
		recipes: (backup.data.recipes ?? []).map(recipeShape),
		sessions: (backup.data.sessions ?? []).map(sessionShape),
		products: (backup.data.products ?? []).map(withId),
		photos: (backup.data.photos ?? []).map(photoFromText)
	};

	await db.transaction('rw', db.tables, async () => {
		for (const name of TABLES) {
			await db.table(name).clear();
			await db.table(name).bulkPut(data[name] ?? []);
		}
	});
	return 'The full backup replaced all data on this device.';
}

/**
 * A product from a file of version 1 has a barcode and no ID. It gets an ID here.
 * @param {Record<string, any>} product
 */
function withId(product) {
	return product.id ? product : { ...product, id: newId(), photoId: null };
}
