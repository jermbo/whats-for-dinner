import { db } from '$lib/db/db';
import { SAMPLE_PREFIX } from './keys';
import { sampleRecords } from './records';

/**
 * Removes the sample records, and all records that use a sample ingredient or a sample recipe.
 * Call it in a transaction.
 */
async function clear() {
	await db.menu.where('recipeId').startsWith(SAMPLE_PREFIX).delete();
	await db.sessions.where('recipeId').startsWith(SAMPLE_PREFIX).delete();
	await db.pantry.where('ingredientId').startsWith(SAMPLE_PREFIX).delete();
	await db.pantryLog.where('ingredientId').startsWith(SAMPLE_PREFIX).delete();
	await db.products.filter((product) => product.ingredientId.startsWith(SAMPLE_PREFIX)).delete();
	await db.shopping.where('id').startsWith(SAMPLE_PREFIX).delete();
	await db.recipes.where('id').startsWith(SAMPLE_PREFIX).delete();
	await db.ingredients.where('id').startsWith(SAMPLE_PREFIX).delete();
}

/**
 * Adds the sample data. A second call puts the sample data back to its first state: it also
 * removes the changes that the tests made, and it sets the date of the last pantry check.
 */
export function loadSampleData() {
	const records = sampleRecords();
	return db.transaction('rw', db.tables, async () => {
		await clear();
		await db.ingredients.bulkPut(records.ingredients);
		await db.recipes.bulkPut(records.recipes);
		await db.pantry.bulkPut(records.pantry);
		await db.pantryLog.bulkPut(records.pantryLog);
		await db.menu.bulkPut(records.menu);
		await db.sessions.bulkPut(records.sessions);
		await db.products.bulkPut(records.products);
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
