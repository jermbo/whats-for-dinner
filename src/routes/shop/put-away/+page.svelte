<script>
	import { resolve } from '$app/paths';
	import NewProductDialog from '$lib/components/shop/NewProductDialog.svelte';
	import PutAwayRow from '$lib/components/shop/PutAwayRow.svelte';
	import TripCost from '$lib/components/shop/TripCost.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import SuccessMark from '$lib/components/ui/SuccessMark.svelte';
	import { canMake } from '$lib/data/availability';
	import { setProduct } from '$lib/data/cart';
	import { productsByIngredient } from '$lib/data/products';
	import { lastPurchases, putAway } from '$lib/data/put-away';
	import { shoppingNeeds } from '$lib/data/shopping';
	import { lastPrices } from '$lib/data/trips';
	import { db } from '$lib/db/db';
	import { useKitchen } from '$lib/kitchen.svelte';
	import { live } from '$lib/live.svelte';
	import { status } from '$lib/status.svelte';
	import { plural } from '$lib/util/format';

	/**
	 * @typedef {import('$lib/types').Purchase} Purchase
	 * @typedef {import('$lib/data/put-away').Line} Line
	 */

	const uid = $props.id();

	const kitchen = useKitchen();
	const products = live(() => db.products.toArray(), []);
	/** Not defined until the database gives the purchases: the screen then shows nothing. */
	const history = live(
		() => db.purchases.toArray(),
		/** @type {Purchase[] | undefined} */ (undefined)
	);
	const trips = live(() => db.trips.orderBy('startedAt').toArray(), []);

	const purchases = $derived(history.current ?? []);

	/** The cart is the purchases that are not put away, in the sequence of the taps in the store. */
	const cart = $derived(
		purchases
			.filter((purchase) => !purchase.putAwayAt)
			.sort((a, b) => a.cartAt.localeCompare(b.cartAt))
	);

	const productsOf = $derived(productsByIngredient(products.current, purchases));
	const last = $derived(lastPurchases(purchases));
	const prices = $derived(lastPrices(purchases));

	/** What the menu needs and the pantry does not have, by ingredient ID. */
	const needs = $derived(
		new Map(
			shoppingNeeds(
				kitchen.menu,
				kitchen.recipesById,
				kitchen.ingredientsById,
				kitchen.pantryByIngredient
			).map((need) => [need.ingredient.id, need.quantity])
		)
	);

	/**
	 * The values of each row. "Put all away" reads them. It is not state: the screen does not
	 * show it.
	 * @type {Map<string, Line>}
	 */
	const lines = new Map();

	/** The owner put an item away in this visit to the screen. */
	let worked = $state(false);
	/** @type {NewProductDialog | undefined} */
	let dialog = $state();

	/** The trip that ended last, with its purchases. */
	const lastTrip = $derived(trips.current.findLast((trip) => trip.completedAt));
	const lastTripPurchases = $derived(
		purchases.filter((purchase) => purchase.tripId === lastTrip?.id)
	);

	/** The meals on the menu that have ingredients, and those that the pantry can make in full. */
	const meals = $derived(
		kitchen.menu.flatMap((item) => {
			const recipe = item.kind === 'recipe' ? kitchen.recipesById.get(item.recipeId) : undefined;
			return recipe && recipe.ingredients.length > 0 ? [recipe] : [];
		})
	);
	const complete = $derived(
		meals.filter((recipe) => canMake(recipe, kitchen.ingredientsById, kitchen.pantryByIngredient))
	);

	async function putAllAway() {
		const all = cart.flatMap((purchase) => lines.get(purchase.id) ?? []);
		await putAway(all);
		worked = true;
		status.say(`${plural(all.length, 'item')} ${all.length === 1 ? 'is' : 'are'} put away.`);
	}

	/** @param {Purchase} purchase */
	function newProduct(purchase) {
		const ingredient = kitchen.ingredientsById.get(purchase.ingredientId ?? '');
		if (ingredient) dialog?.open(ingredient, (product) => setProduct(purchase, product.id));
	}
</script>

<!-- One block, so that the parts are closer than the parts of other screens. -->
<div class="stack">
	<PageHeader
		title="Put away"
		eyebrow={cart.length > 0 ? `${plural(cart.length, 'item')} in the cart` : undefined}
	>
		{#if cart.length > 0}
			<button class="button" type="button" onclick={putAllAway}>Put all away</button>
		{/if}
	</PageHeader>

	{#if !history.current}
		<!-- The database did not answer yet. -->
	{:else if cart.length > 0}
		<ul class="put-away">
			{#each cart as purchase (purchase.id)}
				<PutAwayRow
					{purchase}
					ingredient={kitchen.ingredientsById.get(purchase.ingredientId ?? '') ?? null}
					products={productsOf.get(purchase.ingredientId ?? '') ?? []}
					last={last.get(purchase.ingredientId ?? '')}
					need={needs.get(purchase.ingredientId ?? '') ?? 0}
					{prices}
					{lines}
					onnew={() => newProduct(purchase)}
					ondone={() => (worked = true)}
				/>
			{/each}
		</ul>
	{:else}
		<section class="stack" aria-labelledby="{uid}-empty">
			{#if worked}
				<SuccessMark />
			{/if}
			<h2 id="{uid}-empty">The cart is empty</h2>

			{#if lastTrip}
				<div class="put-away__result stack stack--tight">
					<TripCost trip={lastTrip} purchases={lastTripPurchases} />
					{#if meals.length > 0}
						<p>
							The pantry has all the food for
							<strong>{complete.length} of {plural(meals.length, 'meal')}</strong> on the menu.
						</p>
					{/if}
				</div>
			{/if}

			<div class="cluster">
				<a class="button button--primary" href={resolve('/')}>Today</a>
				<a class="button" href={resolve('/shop')}>Shopping list</a>
				{#if lastTrip}
					<a class="button" href={resolve('/shop/trips')}>All trips</a>
				{/if}
			</div>
		</section>
	{/if}
</div>

<NewProductDialog bind:this={dialog} />

<style>
	.put-away {
		margin: 0;
		padding: 0;
		list-style: none;

		/* A margin, not a gap: the transition of a row that goes out can close a margin. */
		& > :global(li + li) {
			margin-block-start: var(--space-3);
		}
	}

	/* The answer of the app is the largest text on the screen. */
	.put-away__result {
		font-family: var(--font-heading);
		font-size: 1.35rem;
		line-height: 1.25;

		& :global(strong) {
			color: var(--color-accent-strong);
		}
	}
</style>
