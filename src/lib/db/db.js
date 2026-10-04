import Dexie from 'dexie';
import { newId } from '$lib/util/ids';
import { recipeShape, sessionShape } from './shape';

export const db = /** @type {import('$lib/types').Database} */ (new Dexie('meal-planner'));

db.version(1).stores({
	meta: 'key'
});

db.version(2).stores({
	ingredients: 'id, name',
	recipes: 'id, name',
	pantry: 'id, &ingredientId',
	products: 'barcode',
	menu: 'id, recipeId',
	sessions: 'id, recipeId, cookedAt',
	pantryLog: 'id, ingredientId, at',
	shopping: 'id',
	meta: 'key'
});

// A product gets an ID, because a product does not need a barcode. A table cannot change its
// key, so the change has two steps: version 3 moves the products to a temporary table, and
// version 4 makes the table again and moves them back.
db.version(3)
	.stores({
		products: null,
		productsByBarcode: 'barcode'
	})
	.upgrade(async (tx) => {
		await tx.table('productsByBarcode').bulkAdd(await tx.table('products').toArray());
	});

db.version(4)
	.stores({
		productsByBarcode: null,
		products: 'id, ingredientId, barcode',
		photos: 'id',
		trips: 'id, startedAt',
		purchases: 'id, tripId, ingredientId, productId'
	})
	.upgrade(async (tx) => {
		const old = await tx.table('productsByBarcode').toArray();
		await tx
			.table('products')
			.bulkAdd(old.map((product) => ({ ...product, id: newId(), photoId: null })));
	});

// The steps of a recipe are a list, and a cook session has the facts of Cook mode. The tables
// and their keys are the same, so this version only changes the records.
db.version(5)
	.stores({
		recipes: 'id, name',
		sessions: 'id, recipeId, cookedAt'
	})
	.upgrade(async (tx) => {
		await tx
			.table('recipes')
			.toCollection()
			.modify((recipe) => {
				Object.assign(recipe, recipeShape(recipe));
			});
		await tx
			.table('sessions')
			.toCollection()
			.modify((session) => {
				Object.assign(session, sessionShape(session));
			});
	});
