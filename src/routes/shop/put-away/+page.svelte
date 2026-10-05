<script>
	import { resolve } from '$app/paths';
	import NewProductDialog from '$lib/components/shop/NewProductDialog.svelte';
	import PantryFills from '$lib/components/shop/PantryFills.svelte';
	import PutAwayCard from '$lib/components/shop/PutAwayCard.svelte';
	import Receipt from '$lib/components/shop/Receipt.svelte';
	import ReceiptLine from '$lib/components/shop/ReceiptLine.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { putBack, setProduct } from '$lib/data/cart';
	import { allProducts } from '$lib/data/products';
	import { amend, putAway } from '$lib/data/put-away';
	import { allTrips } from '$lib/data/trips';
	import { mealsInFull } from '$lib/domain/availability';
	import {
		pantryFills,
		receiptCost,
		receiptLines,
		receiptTrip,
		toLine
	} from '$lib/domain/put-away';
	import { useKitchen } from '$lib/state/kitchen.svelte';
	import { live } from '$lib/state/live.svelte';
	import { rise } from '$lib/motion/transitions';
	import { useShopping } from '$lib/state/shopping.svelte';
	import { status } from '$lib/state/status.svelte';
	import { plural } from '$lib/util/format';

	/** @typedef {import('$lib/domain/put-away').CartEntry} CartEntry */

	const kitchen = useKitchen();
	const shopping = useShopping();
	const products = live(allProducts, []);
	const trips = live(allTrips, []);

	const trip = $derived(receiptTrip(trips.current));

	const entries = $derived(
		receiptLines({
			trip,
			purchases: shopping.purchases,
			products: products.current,
			ingredientsById: kitchen.ingredientsById,
			pantryByIngredient: kitchen.pantryByIngredient,
			needs: shopping.needs
		})
	);

	/** The items that are in the cart. */
	const waiting = $derived(entries.filter((entry) => !entry.purchase.putAwayAt));

	/** The food of the trip that is in the pantry now. */
	const fills = $derived(pantryFills(entries, kitchen.pantryByIngredient));

	const cost = $derived(receiptCost(entries));

	/** The meals on the menu that have ingredients, and those that the pantry can make in full. */
	const made = $derived(
		mealsInFull(
			kitchen.menu,
			kitchen.recipesById,
			kitchen.ingredientsById,
			kitchen.pantryByIngredient
		)
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

	/**
	 * A wrong tap, or the store had none: the line leaves the receipt and its total, and the
	 * item goes back on the shopping list.
	 * @param {CartEntry} entry
	 */
	async function notBought(entry) {
		await putBack(entry.purchase);
		status.say(`${entry.purchase.name} is back on the shopping list.`);
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
				<!-- The end of the trip: what went into the pantry, and what the pantry can make. -->
				<div class="stack stack--tight" in:rise>
					<p class="put-away__count">+{fills.length} in the pantry.</p>

					{#if made.meals > 0}
						<p class="put-away__result">
							The pantry has all the food for
							<strong>{made.complete} of {plural(made.meals, 'meal')}</strong> on the menu.
						</p>
					{/if}

					<div class="cluster">
						<a class="button button--primary" href={resolve('/')}>Done</a>
						<a class="button" href={resolve('/pantry')}>See the pantry</a>
						<a class="button button--link" href={resolve('/shop/trips')}>All trips</a>
					</div>
				</div>
			{/if}

			<PutAwayCard
				bind:this={card}
				{entries}
				onputaway={putOneAway}
				onamend={amendOne}
				onnotbought={notBought}
				onnew={newProduct}
			/>

			<div class="split__extra">
				<PantryFills {fills} />
			</div>
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
	/* The end of the flow: the largest text on the screen. */
	.put-away__count {
		font-family: var(--font-display);
		font-size: clamp(3rem, 22cqi, 5.5rem);
		line-height: 0.86;
		text-transform: uppercase;
	}

	/* The better answer is below the count: the meals that the pantry can make in full. */
	.put-away__result {
		font-size: 1.0625rem;
		font-weight: 600;
		line-height: 1.3;
	}
</style>
