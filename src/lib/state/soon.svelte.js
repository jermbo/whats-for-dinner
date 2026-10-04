import { db } from '$lib/db/db';
import { menuTotals } from '$lib/domain/shopping';
import { foodToUseFirst } from '$lib/domain/use-up';
import { groupBy } from '$lib/util/collections';
import { useKitchen } from './kitchen.svelte';
import { live } from './live.svelte';

/**
 * The food to use first, the oldest stock first.
 * Assumption: the age of the stock tells what spoils first. The ingredients have no shelf life.
 * Call it during component setup.
 * @param {() => number} now A function that reads the time of now, in milliseconds.
 * @returns {{ readonly items: import('$lib/domain/use-up').SoonItem[] }}
 */
export function useSoon(now) {
	const kitchen = useKitchen();
	const log = live(() => db.pantryLog.orderBy('at').toArray(), []);

	/** The log of each ingredient, oldest first. */
	const changes = $derived(groupBy(log.current, (change) => change.ingredientId));

	const items = $derived(
		foodToUseFirst(
			kitchen.pantry,
			kitchen.ingredientsById,
			changes,
			menuTotals(kitchen.menu, kitchen.recipesById),
			now()
		)
	);

	return {
		get items() {
			return items;
		}
	};
}
