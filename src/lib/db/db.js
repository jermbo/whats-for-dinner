import Dexie from 'dexie';

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
