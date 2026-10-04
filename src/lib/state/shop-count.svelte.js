import { db } from '$lib/db/db';
import { inCart, shoppingList, shoppingNeeds } from '$lib/domain/shopping';
import { useKitchen } from './kitchen.svelte';
import { live } from './live.svelte';

/**
 * The items that the owner must still buy: their number and their names. The navigation shows
 * the number next to "Shop".
 * Call it during component setup.
 */
export function useShopCount() {
	const kitchen = useKitchen();
	const manualItems = live(() => db.shopping.toArray(), []);
	const purchases = live(() => db.purchases.toArray(), []);

	const rows = $derived.by(() => {
		const cart = purchases.current.filter((purchase) => !purchase.putAwayAt);
		const list = shoppingList(
			shoppingNeeds(
				kitchen.menu,
				kitchen.recipesById,
				kitchen.ingredientsById,
				kitchen.pantryByIngredient
			),
			manualItems.current,
			kitchen.ingredientsById
		);
		return list.filter((row) => !inCart(row, cart));
	});

	return {
		get current() {
			return rows.length;
		},
		/** The names of the items to buy. */
		get names() {
			return rows.map((row) => row.name);
		}
	};
}
