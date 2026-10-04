<script>
	import { formatMoney, plural } from '$lib/util/format';

	/**
	 * The spending of one week: its name, the sum of its trips, and the number of the trips.
	 * The sum has only the lines with a price, so the text tells how many lines have none: the
	 * true cost is higher.
	 * @type {{
	 *   id: string,
	 *   label: string,
	 *   cost: import('$lib/domain/trips').TripCost,
	 *   trips: number
	 * }}
	 *   id: the ID of the title, so that the section of the week can have it as its name.
	 */
	let { id, label, cost, trips } = $props();

	/** A week with no price at all has no sum to show. */
	const priced = $derived(cost.noPrice < cost.lines);

	const detail = $derived(
		cost.noPrice > 0
			? `${plural(trips, 'trip')} · ${plural(cost.noPrice, 'item')} with no price`
			: plural(trips, 'trip')
	);
</script>

<div class="week-cost">
	<h2 class="week-cost__label" {id}>{label}</h2>
	{#if priced}
		<p class="count">{formatMoney(cost.total)}</p>
	{/if}
	<p class="week-cost__detail">{detail}</p>
</div>

<style>
	/* The name of the week is at the left, and its sum is at the right, on one line. */
	.week-cost {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0 var(--space-3);
	}

	.week-cost__label {
		font-size: 1.5rem;
	}

	.week-cost__detail {
		flex-basis: 100%;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--ink-soft);
	}
</style>
