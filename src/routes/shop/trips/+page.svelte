<script>
	import { resolve } from '$app/paths';
	import TripCost from '$lib/components/shop/TripCost.svelte';
	import WeekCost from '$lib/components/shop/WeekCost.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { allTrips } from '$lib/data/trips';
	import { spendingByWeek } from '$lib/domain/spending';
	import { live } from '$lib/state/live.svelte';
	import { usePreferences } from '$lib/state/preferences.svelte';
	import { useShopping } from '$lib/state/shopping.svelte';
	import { formatMoney } from '$lib/util/format';

	const uid = $props.id();

	const shopping = useShopping();
	const preferences = usePreferences();
	const history = live(allTrips, []);

	/** The trips in groups by week, each with its sum. The newest week is first. */
	const weeks = $derived(
		spendingByWeek(history.current, shopping.purchases, preferences.values.weekStartsOn, Date.now())
	);
</script>

<PageHeader title="Shopping trips">
	<a class="button" href={resolve('/shop')}>Shopping list</a>
</PageHeader>

{#if weeks.length === 0}
	<p class="muted">There are no trips yet. The first tap on the shopping list starts one.</p>
{:else}
	{#each weeks as week (week.start)}
		<section class="stack stack--tight" aria-labelledby="{uid}-{week.start}">
			<WeekCost
				id="{uid}-{week.start}"
				label={week.label}
				cost={week.cost}
				trips={week.trips.length}
			/>

			<ul class="list">
				{#each week.trips as { trip, purchases } (trip.id)}
					<li class="list__item">
						<details>
							<summary class="trip__summary">
								<TripCost {trip} {purchases} />
								{#if !trip.completedAt}
									<span class="badge">Items in the cart</span>
								{/if}
							</summary>

							<ul class="trip__lines">
								{#each purchases as purchase (purchase.id)}
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
		</section>
	{/each}
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
