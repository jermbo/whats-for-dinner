import { menuTotals } from '$lib/domain/shopping';
import { foodToUseFirst } from '$lib/domain/use-up';
import { useKitchen } from './kitchen.svelte';

/**
 * The food to use first: the stock with a use-by date, the earliest date first.
 * Call it during component setup.
 * @param {() => number} now A function that reads the time of now, in milliseconds.
 * @returns {{ readonly items: import('$lib/domain/use-up').SoonItem[] }}
 */
export function useSoon(now) {
	const kitchen = useKitchen();

	const items = $derived(
		foodToUseFirst(
			kitchen.pantry,
			kitchen.ingredientsById,
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
