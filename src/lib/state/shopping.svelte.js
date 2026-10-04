import { getContext, setContext } from 'svelte';
import { db } from '$lib/db/db';
import { cartOf } from '$lib/domain/cart';
import { inCart, shoppingList, shoppingNeeds } from '$lib/domain/shopping';
import { useKitchen } from './kitchen.svelte';
import { live } from './live.svelte';

/**
 * @typedef {ReturnType<typeof makeShopping>} Shopping
 * @typedef {import('$lib/types').Purchase} Purchase
 */

const KEY = Symbol('shopping');

/** The shopping list and the cart, built on the kitchen. */
function makeShopping() {
	const kitchen = useKitchen();
	const manualItems = live(() => db.shopping.toArray(), []);
	/** Not defined until the database gives the purchases. */
	const history = live(
		() => db.purchases.toArray(),
		/** @type {Purchase[] | undefined} */ (undefined)
	);

	const purchases = $derived(history.current ?? []);
	const cart = $derived(cartOf(purchases));
	const needs = $derived(
		shoppingNeeds(
			kitchen.menu,
			kitchen.recipesById,
			kitchen.ingredientsById,
			kitchen.pantryByIngredient
		)
	);
	const list = $derived(shoppingList(needs, manualItems.current, kitchen.ingredientsById));
	const needed = $derived(list.filter((row) => !inCart(row, cart)));

	return {
		/** False until the database gives the purchases. */
		get ready() {
			return history.current !== undefined;
		},
		/** All purchases: those in the cart and those that are put away. */
		get purchases() {
			return purchases;
		},
		/** The purchases that are not put away. The item of the last tap is first. */
		get cart() {
			return cart;
		},
		/** What the menu needs and the pantry does not have. */
		get needs() {
			return needs;
		},
		/** The shopping list: the needs, plus the items that the owner added by hand. */
		get list() {
			return list;
		},
		/** The rows of the list that are not in the cart: the items that the owner must still buy. */
		get needed() {
			return needed;
		}
	};
}

/** Makes the shopping list of the app. The root layout calls it one time, after the kitchen. */
export function provideShopping() {
	return setContext(KEY, makeShopping());
}

/**
 * The shopping list of the app. The navigation shows its number on each screen.
 * Call it during component setup.
 * @returns {Shopping}
 */
export function useShopping() {
	return getContext(KEY);
}
