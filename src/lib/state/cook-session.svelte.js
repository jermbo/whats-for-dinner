import { sessionById, sessionsOfRecipe } from '$lib/data/cooking';
import { useKitchen } from './kitchen.svelte';
import { live } from './live.svelte';

/**
 * One cook session, with its recipe and all the cook sessions of that recipe.
 * Call it during component setup.
 * @param {() => string} id A function that reads the ID of the cook session.
 */
export function useCookSession(id) {
	const kitchen = useKitchen();
	const session = live(() => sessionById(id()), undefined, id);

	const recipeId = $derived(session.current?.recipeId ?? '');
	const recipe = $derived(kitchen.recipesById.get(recipeId));
	const cooks = live(
		async () => (recipeId ? sessionsOfRecipe(recipeId) : []),
		[],
		() => recipeId
	);

	return {
		/** Not defined: the database did not answer yet, or the session is not on this device. */
		get session() {
			return session.current;
		},
		get recipe() {
			return recipe;
		},
		/** All cook sessions of the recipe. Their notes show on the steps. */
		get cooks() {
			return cooks.current;
		}
	};
}
