import { db } from '$lib/db/db';
import { live } from '$lib/live.svelte';
import { indexBy } from '$lib/util/collections';

/** @typedef {ReturnType<typeof useKitchen>} Kitchen */

/**
 * The data that the menu, the "Today" screen, and the shopping list all read.
 * Call it during component setup.
 */
export function useKitchen() {
	const menu = live(() => db.menu.toArray(), []);
	const recipes = live(() => db.recipes.toArray(), []);
	const ingredients = live(() => db.ingredients.toArray(), []);
	const pantry = live(() => db.pantry.toArray(), []);

	const recipesById = $derived(indexBy(recipes.current, 'id'));
	const ingredientsById = $derived(indexBy(ingredients.current, 'id'));
	const pantryByIngredient = $derived(indexBy(pantry.current, 'ingredientId'));

	return {
		get menu() {
			return menu.current;
		},
		get recipes() {
			return recipes.current;
		},
		get ingredients() {
			return ingredients.current;
		},
		get pantry() {
			return pantry.current;
		},
		get recipesById() {
			return recipesById;
		},
		get ingredientsById() {
			return ingredientsById;
		},
		get pantryByIngredient() {
			return pantryByIngredient;
		}
	};
}
