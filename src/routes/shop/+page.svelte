<script>
	import { resolve } from '$app/paths';
	import AddItemForm from '$lib/components/shop/AddItemForm.svelte';
	import CartRow from '$lib/components/shop/CartRow.svelte';
	import ScanDialog from '$lib/components/shop/ScanDialog.svelte';
	import ShopMeals from '$lib/components/shop/ShopMeals.svelte';
	import ShoppingRow from '$lib/components/shop/ShoppingRow.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { take } from '$lib/data/cart';
	import { removeManualItem } from '$lib/data/shopping-items';
	import { db } from '$lib/db/db';
	import { productsByIngredient } from '$lib/domain/products';
	import { aisles, inCart, shopMeals, shoppingList, shoppingNeeds } from '$lib/domain/shopping';
	import { useKitchen } from '$lib/state/kitchen.svelte';
	import { live } from '$lib/state/live.svelte';
	import { status } from '$lib/state/status.svelte';
	import { indexBy } from '$lib/util/collections';

	/**
	 * @typedef {import('$lib/domain/shopping').ListRow} ListRow
	 * @typedef {import('$lib/types').Product} Product
	 */

	const uid = $props.id();

	const kitchen = useKitchen();
	const manualItems = live(() => db.shopping.toArray(), []);
	const products = live(() => db.products.toArray(), []);
	const purchases = live(() => db.purchases.toArray(), []);

	/** The recipe ID of the meal whose items the list shows. Empty: all items. */
	let mealId = $state('');
	/** @type {ScanDialog | undefined} */
	let scanner = $state();

	const productsById = $derived(indexBy(products.current, 'id'));
	const productsOf = $derived(productsByIngredient(products.current, purchases.current));

	/** The cart is the purchases that are not put away. The item of the last tap is first. */
	const cart = $derived(
		purchases.current
			.filter((purchase) => !purchase.putAwayAt)
			.sort((a, b) => b.cartAt.localeCompare(a.cartAt))
	);

	const list = $derived(
		shoppingList(
			shoppingNeeds(
				kitchen.menu,
				kitchen.recipesById,
				kitchen.ingredientsById,
				kitchen.pantryByIngredient
			),
			manualItems.current,
			kitchen.ingredientsById
		)
	);
	const needed = $derived(list.filter((row) => !inCart(row, cart)));
	const meals = $derived(shopMeals(kitchen.menu, kitchen.recipesById, needed));

	/** The meal that is selected. When it goes off the menu, the list shows all items again. */
	const meal = $derived(meals.find((entry) => entry.recipe.id === mealId)?.recipe);
	const mealIngredients = $derived(new Set(meal?.ingredients.map((row) => row.ingredientId)));

	const shownNeeded = $derived(
		meal ? needed.filter((row) => row.recipeIds.includes(meal.id)) : needed
	);
	const shownCart = $derived(
		meal ? cart.filter((purchase) => mealIngredients.has(purchase.ingredientId ?? '')) : cart
	);
	const groups = $derived(aisles(shownNeeded));

	const total = $derived(cart.length + needed.length);

	/**
	 * @param {ListRow} row
	 * @param {Product | null} product
	 */
	async function taken(row, product) {
		await take(row, product);
		status.say(`${row.name} is in the cart.`);
	}

	/**
	 * A scan gives the same result as a tap on the photo of the product.
	 * @param {Product} product
	 */
	async function scanned(product) {
		const ingredient = kitchen.ingredientsById.get(product.ingredientId);
		if (!ingredient) {
			status.say(`The ingredient of ${product.name} does not exist.`);
			return;
		}
		const row = list.find((entry) => entry.ingredient?.id === ingredient.id);
		await take({ name: ingredient.name, ingredient, item: row?.item ?? null }, product);
		status.say(`${product.name || ingredient.name} is in the cart.`);
	}
</script>

<!--
	One block, so that the parts are closer than the parts of other screens.
	The list is the main column. The cart is the side column: it stays in view.
-->
<div class="split shop">
	<div class="stack">
		<div class="stack stack--tight">
			<PageHeader title="Shopping list">
				<button class="button button--round" type="button" onclick={() => scanner?.open()}>
					<Icon name="scan" />
					<span class="visually-hidden">Scan a barcode</span>
				</button>
			</PageHeader>

			{#if meals.length > 0}
				<ShopMeals {meals} selected={meal?.id ?? ''} onselect={(id) => (mealId = id)} />
			{/if}

			<p class="shop__progress">
				{#if total === 0}
					The pantry has all ingredients for the menu.
				{:else if needed.length === 0}
					You have all items: <strong>{cart.length} of {total}</strong> in the cart.
				{:else}
					<strong>{cart.length} of {total}</strong> in the cart
				{/if}
			</p>
		</div>

		{#if groups.length > 0}
			<div class="grid shop__aisles">
				{#each groups as aisle, index (aisle.name)}
					<section class="stack stack--tight" aria-labelledby="{uid}-aisle-{index}">
						<h2 class="shop__aisle" id="{uid}-aisle-{index}">{aisle.name}</h2>
						<ul class="list">
							{#each aisle.rows as row (row.key)}
								<!-- Only an item that no meal needs can be removed from the list. -->
								{@const added = row.quantity === 0 ? row.item : null}
								<ShoppingRow
									{row}
									products={productsOf.get(row.ingredient?.id ?? '') ?? []}
									ontake={(product) => taken(row, product)}
									onremove={added ? () => removeManualItem(added.id) : undefined}
								/>
							{/each}
						</ul>
					</section>
				{/each}
			</div>
		{/if}
	</div>

	{#if shownCart.length > 0}
		<div class="split__side split__side--sticky">
			<section class="stack stack--tight" aria-labelledby="{uid}-cart">
				<div class="cluster cluster--between">
					<h2 class="shop__aisle" id="{uid}-cart">In the cart</h2>
					<a class="button button--primary" href={resolve('/shop/put-away')}>Put away</a>
				</div>
				<ul class="list">
					{#each shownCart as purchase (purchase.id)}
						<CartRow
							{purchase}
							product={productsById.get(purchase.productId ?? '')}
							unit={kitchen.ingredientsById.get(purchase.ingredientId ?? '')?.unit}
						/>
					{/each}
				</ul>
			</section>
		</div>
	{/if}

	<AddItemForm ingredients={kitchen.ingredients} />
</div>

<ScanDialog bind:this={scanner} onfound={scanned} />

<style>
	/* The cart has a fixed width. The list gets the width that is left. */
	.shop {
		--split-columns: minmax(0, 1fr) 22rem;
	}

	/* An aisle is as wide as the list on a phone: a wide main column has two aisles side by side. */
	.shop__aisles {
		--grid-min: 21rem;
	}

	.shop__progress {
		color: var(--ink-soft);

		& strong {
			color: var(--ink);
			font-variant-numeric: tabular-nums;
		}
	}

	/* An aisle is a label of the list, not a part of the page: its title is small. */
	.shop__aisle {
		font-family: var(--font-body);
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		line-height: 1.25;
	}
</style>
