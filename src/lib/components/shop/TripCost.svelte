<script>
	import { tripCost } from '$lib/data/trips';
	import { formatDay, formatMoney, plural } from '$lib/util/format';

	/**
	 * The cost of one trip, for example "October 3: 42.80, and 3 items with no price".
	 * The price is optional, so the line tells how many items have none: the true cost is higher.
	 * @type {{
	 *   trip: import('$lib/types').Trip,
	 *   purchases: import('$lib/types').Purchase[]
	 * }}
	 */
	let { trip, purchases } = $props();

	const cost = $derived(tripCost(purchases));
	const noPrice = $derived(`${plural(cost.noPrice, 'item')} with no price`);
	/** The end of the sentence, when some items have a price and some have none. */
	const rest = $derived(cost.noPrice > 0 ? `, and ${noPrice}` : '');
</script>

<p class="trip-cost">
	<span class="trip-cost__day">{formatDay(trip.startedAt)}:</span>
	{#if cost.noPrice === cost.lines}
		{noPrice}
	{:else}
		<strong class="trip-cost__total">{formatMoney(cost.total)}</strong>{rest}
	{/if}
</p>

<style>
	.trip-cost__day {
		color: var(--color-muted);
	}

	.trip-cost__total {
		font-variant-numeric: tabular-nums;
	}
</style>
