import { db } from '$lib/db/db';
import { SAMPLE_PREFIX, sampleRecords } from './records';

/** Adds the sample data. A second call puts the sample records back to their first state. */
export function loadSampleData() {
	const records = sampleRecords();
	return db.transaction('rw', db.tables, async () => {
		await db.ingredients.bulkPut(records.ingredients);
		await db.recipes.bulkPut(records.recipes);
		await db.pantry.bulkPut(records.pantry);
		await db.menu.bulkPut(records.menu);
		await db.sessions.bulkPut(records.sessions);
		await db.products.bulkPut(records.products);
		await db.shopping.bulkPut(records.shopping);
	});
}

/**
 * Removes the sample data, and all records that use a sample ingredient or a sample recipe.
 * Data that the owner made stays.
 */
export function removeSampleData() {
	return db.transaction('rw', db.tables, async () => {
		await db.menu.where('recipeId').startsWith(SAMPLE_PREFIX).delete();
		await db.sessions.where('recipeId').startsWith(SAMPLE_PREFIX).delete();
		await db.pantry.where('ingredientId').startsWith(SAMPLE_PREFIX).delete();
		await db.pantryLog.where('ingredientId').startsWith(SAMPLE_PREFIX).delete();
		await db.products.filter((p) => p.ingredientId.startsWith(SAMPLE_PREFIX)).delete();
		await db.shopping.where('id').startsWith(SAMPLE_PREFIX).delete();
		await db.recipes.where('id').startsWith(SAMPLE_PREFIX).delete();
		await db.ingredients.where('id').startsWith(SAMPLE_PREFIX).delete();
	});
}

/** @returns {Promise<number>} The number of sample recipes on this device. */
export function countSampleData() {
	return db.recipes.where('id').startsWith(SAMPLE_PREFIX).count();
}
