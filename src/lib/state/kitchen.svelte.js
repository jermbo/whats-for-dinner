import { getContext, setContext } from 'svelte';
import { db } from '$lib/db/db';
import { indexBy } from '$lib/util/collections';
import { live } from './live.svelte';

/** @typedef {ReturnType<typeof makeKitchen>} Kitchen */

const KEY = Symbol('kitchen');

/** The menu, the recipes, the ingredients, and the pantry, with the maps that many files need. */
function makeKitchen() {
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

/**
 * Makes the kitchen of the app. The root layout calls it one time, so that all screens and
 * components read the same four queries. See docs/code/one-kitchen.md.
 */
export function provideKitchen() {
	return setContext(KEY, makeKitchen());
}

/**
 * The kitchen of the app: the data that almost each screen reads.
 * Call it during component setup.
 * @returns {Kitchen}
 */
export function useKitchen() {
	return getContext(KEY);
}
