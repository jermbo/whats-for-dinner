import { db } from '$lib/db/db';
import { settleTrip } from '../trips';
import { SAMPLE_PREFIX } from './keys';
import { samplePhotos } from './photos';
import { sampleRecords } from './records';

/** @param {string | null | undefined} value */
const isSample = (value) => !!value?.startsWith(SAMPLE_PREFIX);

/**
 * Removes the sample products with their photos, and the purchases of sample items. A trip
 * that has no purchases after that is removed too.
 */
async function clearShopping() {
	const products = await db.products.where('ingredientId').startsWith(SAMPLE_PREFIX).toArray();
	await db.photos.bulkDelete(products.flatMap((product) => product.photoId ?? []));
	await db.products.bulkDelete(products.map((product) => product.id));

	const purchases = await db.purchases
		.filter(
			(purchase) =>
				isSample(purchase.id) ||
				isSample(purchase.ingredientId) ||
				isSample(purchase.shoppingItemId)
		)
		.toArray();
	await db.purchases.bulkDelete(purchases.map((purchase) => purchase.id));
	for (const tripId of new Set(purchases.map((purchase) => purchase.tripId))) {
		await settleTrip(tripId);
	}
	await db.trips.where('id').startsWith(SAMPLE_PREFIX).delete();
}

/**
 * Removes the photos that the owner took of the sample recipes: the step photos, the covers,
 * and the finished photos of the cook sessions.
 */
async function clearRecipePhotos() {
	const recipes = await db.recipes.where('id').startsWith(SAMPLE_PREFIX).toArray();
	const sessions = await db.sessions.where('recipeId').startsWith(SAMPLE_PREFIX).toArray();
	await db.photos.bulkDelete([
		...recipes.flatMap((recipe) => recipe.steps.flatMap((step) => step.photoIds)),
		...recipes.flatMap((recipe) => recipe.coverPhotoId ?? []),
		...sessions.flatMap((session) => session.photoId ?? [])
	]);
}

/**
 * Removes the sample records, and all records that use a sample ingredient or a sample recipe.
 * Call it in a transaction.
 */
async function clear() {
	await clearRecipePhotos();
	await db.menu.where('recipeId').startsWith(SAMPLE_PREFIX).delete();
	await db.sessions.where('recipeId').startsWith(SAMPLE_PREFIX).delete();
	await db.pantry.where('ingredientId').startsWith(SAMPLE_PREFIX).delete();
	await db.pantryLog.where('ingredientId').startsWith(SAMPLE_PREFIX).delete();
	await clearShopping();
	await db.shopping.where('id').startsWith(SAMPLE_PREFIX).delete();
	await db.recipes.where('id').startsWith(SAMPLE_PREFIX).delete();
	await db.ingredients.where('id').startsWith(SAMPLE_PREFIX).delete();
}

/**
 * Adds the sample data. A second call puts the sample data back to its first state: it also
 * removes the changes that the tests made, and it sets the date of the last pantry check.
 */
export async function loadSampleData() {
	const records = sampleRecords();
	// The browser draws the photos. This is not a database step, so it is before the transaction.
	const photos = await samplePhotos();

	return db.transaction('rw', db.tables, async () => {
		await clear();
		await db.ingredients.bulkPut(records.ingredients);
		await db.recipes.bulkPut(records.recipes);
		await db.pantry.bulkPut(records.pantry);
		await db.pantryLog.bulkPut(records.pantryLog);
		await db.menu.bulkPut(records.menu);
		await db.sessions.bulkPut(records.sessions);
		await db.products.bulkPut(records.products);
		await db.photos.bulkPut(photos);
		await db.trips.bulkPut(records.trips);
		await db.purchases.bulkPut(records.purchases);
		await db.shopping.bulkPut(records.shopping);
		await db.meta.put({ key: 'lastPantryCheckAt', value: records.lastPantryCheckAt });
	});
}

/** Removes the sample data. Data that the owner made stays. */
export function removeSampleData() {
	return db.transaction('rw', db.tables, clear);
}

/** @returns {Promise<number>} The number of sample recipes on this device. */
export function countSampleData() {
	return db.recipes.where('id').startsWith(SAMPLE_PREFIX).count();
}
