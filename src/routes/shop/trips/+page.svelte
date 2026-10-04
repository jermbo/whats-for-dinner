<script>
	import { resolve } from '$app/paths';
	import TripCost from '$lib/components/shop/TripCost.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { db } from '$lib/db/db';
	import { live } from '$lib/state/live.svelte';
	import { groupBy } from '$lib/util/collections';
	import { formatMoney } from '$lib/util/format';

	const trips = live(() => db.trips.orderBy('startedAt').reverse().toArray(), []);
	const purchases = live(() => db.purchases.toArray(), []);

	const byTrip = $derived(new Map(groupBy(purchases.current, (purchase) => purchase.tripId)));
</script>

<PageHeader title="Shopping trips">
	<a class="button" href={resolve('/shop')}>Shopping list</a>
</PageHeader>

{#if trips.current.length === 0}
	<p class="muted">There are no trips yet. The first tap on the shopping list starts one.</p>
{:else}
	<ul class="list">
		{#each trips.current as trip (trip.id)}
			{@const lines = byTrip.get(trip.id) ?? []}
			<li class="list__item">
				<details>
					<summary class="trip__summary">
						<TripCost {trip} purchases={lines} />
						{#if !trip.completedAt}
							<span class="badge">Items in the cart</span>
						{/if}
					</summary>

					<ul class="trip__lines">
						{#each lines as purchase (purchase.id)}
							<li class="trip__line">
								<span>
									{purchase.name}
									{#if purchase.packages > 1}
										<span class="muted">{purchase.packages} ×</span>
									{/if}
								</span>
								<span class={['trip__price', purchase.price === null && 'muted']}>
									{purchase.price === null ? 'No price' : formatMoney(purchase.price)}
								</span>
							</li>
						{/each}
					</ul>
				</details>
			</li>
		{/each}
	</ul>
{/if}

<style>
	/* The summary keeps its arrow, so the cost is on the same line as the arrow. */
	.trip__summary {
		padding-block: var(--space-3);
		cursor: pointer;

		& :global(.trip-cost) {
			display: inline;
		}
	}

	.trip__lines {
		margin: 0;
		padding: var(--space-2) 0 0;
		list-style: none;
	}

	.trip__line {
		display: flex;
		justify-content: space-between;
		gap: var(--space-3);
		padding-block: var(--space-1);
	}

	.trip__price {
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
</style>
