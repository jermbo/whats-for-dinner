import { db } from '$lib/db/db';
import { newId, now } from '$lib/db/ids';

/** @returns {import('$lib/types').Recipe} */
export function blankRecipe() {
	return {
		id: '',
		name: '',
		mealType: 'dinner',
		servings: 2,
		steps: '',
		source: '',
		photo: '',
		inRotation: false,
		ingredients: [],
		prepSteps: [],
		createdAt: '',
		updatedAt: ''
	};
}

/**
 * Saves a recipe. Rows that the owner left empty are removed.
 * @param {import('$lib/types').Recipe} recipe
 * @returns {Promise<import('$lib/types').Recipe>}
 */
export async function saveRecipe(recipe) {
	const time = now();
	const record = {
		...recipe,
		id: recipe.id || newId(),
		name: recipe.name.trim(),
		source: recipe.source.trim(),
		photo: recipe.photo?.trim() ?? '',
		servings: Number(recipe.servings) || 1,
		// An empty number field gives null, so each number is made safe here.
		ingredients: recipe.ingredients
			.filter((row) => row.ingredientId)
			.map((row) => ({ ...row, quantity: Number(row.quantity) || 0 })),
		prepSteps: recipe.prepSteps
			.filter((step) => step.text.trim())
			.map((step) => ({ text: step.text.trim(), leadHours: Number(step.leadHours) || 0 })),
		createdAt: recipe.createdAt || time,
		updatedAt: time
	};
	await db.recipes.put(record);
	return record;
}

/**
 * Groups for the menu screen, each in the sequence of the names. "To try" is automatic: a
 * recipe with no cook session.
 * @template {{ recipe: import('$lib/types').Recipe }} T
 * @param {T[]} items The rows of the screen. Each one has its recipe.
 * @param {Set<string>} cookedIds The IDs of the recipes that have a cook session.
 * @returns {{ title: string, items: T[] }[]}
 */
export function recipeGroups(items, cookedIds) {
	const sorted = [...items].sort((a, b) => a.recipe.name.localeCompare(b.recipe.name));
	const cooked = sorted.filter((item) => cookedIds.has(item.recipe.id));
	return [
		{ title: 'To try', items: sorted.filter((item) => !cookedIds.has(item.recipe.id)) },
		{ title: 'In rotation', items: cooked.filter((item) => item.recipe.inRotation) },
		{ title: 'Other recipes', items: cooked.filter((item) => !item.recipe.inRotation) }
	].filter((group) => group.items.length > 0);
}

/** @param {string} id */
export function deleteRecipe(id) {
	return db.transaction('rw', db.recipes, db.menu, async () => {
		await db.menu.where('recipeId').equals(id).delete();
		await db.recipes.delete(id);
	});
}
