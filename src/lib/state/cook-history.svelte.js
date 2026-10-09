import { cookedSessions } from '$lib/data/cooking';
import { indexBy } from '$lib/util/collections';
import { live } from './live.svelte';

/**
 * The cook history: the cook sessions of the meals that are cooked.
 * Call it during component setup.
 */
export function useCookHistory() {
	const sessions = live(cookedSessions, []);
	// The sessions are oldest first, so the last one of each recipe stays in the map.
	const lastByRecipe = $derived(indexBy(sessions.current, 'recipeId'));

	return {
		/** Oldest first. */
		get sessions() {
			return sessions.current;
		},
		/** The last cook session of each recipe, by recipe ID. */
		get lastByRecipe() {
			return lastByRecipe;
		}
	};
}
