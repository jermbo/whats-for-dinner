import { db } from '$lib/db/db';
import { setMeta } from '$lib/db/meta';
import { newId, now } from '$lib/db/ids';
import { photoFromText, photoToText } from './photo-storage';

/**
 * The JSON format. It is the contract between devices now, and with a server later.
 * A file has a scope: 'all' is a full backup, 'recipes' has only recipes and their ingredients.
 *
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {'all' | 'recipes'} Scope
 * @typedef {{ format: string, version: number, scope: Scope, exportedAt: string, data: Record<string, any[]> }} BackupFile
 */

const FORMAT = 'meal-planner';
// Version 2: a product has an ID and a photo, and the file has photos, trips, and purchases.
const VERSION = 2;

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

/** @returns {Promise<BackupFile>} */
export async function exportRecipes() {
	const recipes = await db.recipes.toArray();
	const used = new Set(recipes.flatMap((recipe) => recipe.ingredients.map((r) => r.ingredientId)));
	const ingredients = (await db.ingredients.toArray()).filter((i) => used.has(i.id));
	return envelope('recipes', { ingredients, recipes });
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
	return backup.scope === 'recipes' ? mergeRecipes(backup) : replaceAll(backup);
}

/**
 * A full backup replaces all data on the device.
 * @param {BackupFile} backup
 */
async function replaceAll(backup) {
	/** @type {Record<string, any[]>} */
	const data = {
		...backup.data,
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

/**
 * A recipe file adds new recipes and updates changed recipes. It changes nothing else.
 * An ingredient with the same name as a local ingredient becomes that local ingredient.
 * @param {BackupFile} backup
 */
async function mergeRecipes(backup) {
	const incomingIngredients = /** @type {Ingredient[]} */ (backup.data.ingredients ?? []);
	const incomingRecipes = /** @type {Recipe[]} */ (backup.data.recipes ?? []);
	let changed = 0;

	await db.transaction('rw', db.ingredients, db.recipes, async () => {
		const local = await db.ingredients.toArray();
		/** @type {Map<string, string>} Incoming ingredient ID to local ingredient ID. */
		const ids = new Map();

		for (const ingredient of incomingIngredients) {
			const same =
				local.find((i) => i.id === ingredient.id) ??
				local.find((i) => i.name.toLowerCase() === ingredient.name.toLowerCase());
			ids.set(ingredient.id, same?.id ?? ingredient.id);
			if (!same) await db.ingredients.add(ingredient);
		}

		for (const recipe of incomingRecipes) {
			const existing = await db.recipes.get(recipe.id);
			if (existing && existing.updatedAt >= recipe.updatedAt) continue;
			await db.recipes.put({
				...recipe,
				ingredients: recipe.ingredients.map((row) => ({
					...row,
					ingredientId: ids.get(row.ingredientId) ?? row.ingredientId
				}))
			});
			changed += 1;
		}
	});

	return `Recipes added or updated: ${changed} of ${incomingRecipes.length}.`;
}

/**
 * Gives the file to the browser as a download.
 * @param {BackupFile} backup
 */
export function download(backup) {
	const blob = new Blob([JSON.stringify(backup, null, '\t')], { type: 'application/json' });
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = `meal-planner-${backup.scope}-${backup.exportedAt.slice(0, 10)}.json`;
	link.click();
	// The browser needs the URL until the download starts.
	setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
