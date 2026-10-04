<script>
	import { resolve } from '$app/paths';
	import NewProductDialog from '$lib/components/shop/NewProductDialog.svelte';
	import PutAwayCard from '$lib/components/shop/PutAwayCard.svelte';
	import Receipt from '$lib/components/shop/Receipt.svelte';
	import ReceiptLine from '$lib/components/shop/ReceiptLine.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { setProduct } from '$lib/data/cart';
	import { allProducts } from '$lib/data/products';
	import { amend, putAway } from '$lib/data/put-away';
	import { allTrips } from '$lib/data/trips';
	import { canMake } from '$lib/domain/availability';
	import { productsByIngredient } from '$lib/domain/products';
	import { cartEntry, lastPurchases, toLine } from '$lib/domain/put-away';
	import { lastPrices, tripCost } from '$lib/domain/trips';
	import { useKitchen } from '$lib/state/kitchen.svelte';
	import { live } from '$lib/state/live.svelte';
	import { useShopping } from '$lib/state/shopping.svelte';
	import { status } from '$lib/state/status.svelte';
	import { plural } from '$lib/util/format';

	/** @typedef {import('$lib/domain/put-away').CartEntry} CartEntry */

	const kitchen = useKitchen();
	const shopping = useShopping();
	const products = live(allProducts, []);
	const trips = live(allTrips, []);

	const purchases = $derived(shopping.purchases);

	/** The receipt is the open trip. With no open trip, it is the trip that ended last. */
	const trip = $derived(
		trips.current.find((entry) => !entry.completedAt) ??
			trips.current.findLast((entry) => entry.completedAt)
	);

	const productsOf = $derived(productsByIngredient(products.current, purchases));
	const last = $derived(lastPurchases(purchases));
	const prices = $derived(lastPrices(purchases));

	/** What the menu needs and the pantry does not have, by ingredient ID. */
	const needs = $derived(
		new Map(shopping.needs.map((need) => [need.ingredient.id, need.quantity]))
	);

	/** The lines of the receipt, in the sequence of the taps in the store. */
	const entries = $derived(
		purchases
			.filter((purchase) => purchase.tripId === trip?.id)
			.sort((a, b) => a.cartAt.localeCompare(b.cartAt))
			.map((purchase) =>
				cartEntry({
					purchase,
					ingredient: kitchen.ingredientsById.get(purchase.ingredientId ?? '') ?? null,
					products: productsOf.get(purchase.ingredientId ?? '') ?? [],
					last: last.get(purchase.ingredientId ?? ''),
					need: needs.get(purchase.ingredientId ?? '') ?? 0,
					prices
				})
			)
	);

	/** The items that are in the cart. */
	const waiting = $derived(entries.filter((entry) => !entry.purchase.putAwayAt));

	/** The total of the receipt has the prices that the lines show. */
	const cost = $derived(
		tripCost(entries.map((entry) => ({ ...entry.purchase, price: entry.price })))
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

	/** @type {PutAwayCard | undefined} */
	let card = $state();
	/** @type {NewProductDialog | undefined} */
	let dialog = $state();

	/** @param {CartEntry} entry */
	async function putOneAway(entry) {
		await putAway([toLine(entry)]);
		const { name } = entry.purchase;
		status.say(entry.ingredient ? `${name} is in the pantry.` : `${name} is put away.`);
	}

	/**
	 * A correction of an item that is put away.
	 * @param {CartEntry} entry
	 */
	async function amendOne(entry) {
		await amend(toLine(entry));
		status.say(`${entry.purchase.name} is corrected.`);
	}

	async function putAllAway() {
		const count = waiting.length;
		await putAway(waiting.map(toLine));
		status.say(`${plural(count, 'item')} ${count === 1 ? 'is' : 'are'} put away.`);
	}

	/** @param {CartEntry} entry */
	function newProduct({ purchase, ingredient }) {
		if (ingredient) dialog?.open(ingredient, (product) => setProduct(purchase, product.id));
	}
</script>

<!--
	One block, so that the parts are closer than the parts of other screens.
	The receipt is the main column. The card of an item is the side column: it stays in view.
-->
<div class="split">
	<PageHeader
		title="Put away"
		eyebrow={waiting.length > 0 ? `${plural(waiting.length, 'item')} in the cart` : undefined}
	>
		{#if waiting.length > 0}
			<button class="button" type="button" onclick={putAllAway}>Put all away</button>
		{/if}
	</PageHeader>

	{#if !shopping.ready}
		<!-- The database did not answer yet. -->
	{:else if trip}
		<Receipt {trip} {cost}>
			{#each entries as entry (entry.purchase.id)}
				<ReceiptLine
					{entry}
					onputaway={() => putOneAway(entry)}
					onopen={() => card?.open(entry.purchase.id)}
				/>
			{/each}
		</Receipt>

		<div class="split__side split__side--sticky">
			{#if trip.completedAt}
				{#if meals.length > 0}
					<p class="put-away__result">
						The pantry has all the food for
						<strong>{complete.length} of {plural(meals.length, 'meal')}</strong> on the menu.
					</p>
				{/if}

				<div class="cluster">
					<a class="button button--primary" href={resolve('/')}>Today</a>
					<a class="button" href={resolve('/shop')}>Shopping list</a>
					<a class="button" href={resolve('/shop/trips')}>All trips</a>
				</div>
			{/if}

			<PutAwayCard
				bind:this={card}
				{entries}
				onputaway={putOneAway}
				onamend={amendOne}
				onnew={newProduct}
			/>
		</div>
	{:else}
		<div class="stack">
			<p class="muted">The cart is empty. Tap the items on the shopping list in the store.</p>
			<div>
				<a class="button button--primary" href={resolve('/shop')}>Shopping list</a>
			</div>
		</div>
	{/if}
</div>

<NewProductDialog bind:this={dialog} />

<style>
	/* The answer of the app is the largest text on the screen. */
	.put-away__result {
		font-family: var(--font-display);
		font-size: 1.35rem;
		line-height: 1.25;

		& strong {
			color: var(--ink);
		}
	}
</style>
