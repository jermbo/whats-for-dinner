<script>
	import { isCounted } from '$lib/domain/put-away';
	import { rowReason } from '$lib/domain/shopping';
	import { collapse } from '$lib/motion/transitions';
	import { useKitchen } from '$lib/state/kitchen.svelte';
	import { formatQuantity } from '$lib/util/format';

	/** @typedef {import('$lib/domain/shopping').ListRow} ListRow */

	/**
	 * "To buy": the gap between the meals and the pantry, one row for each item, with the meal
	 * that needs it. "Have it" corrects a wrong count of the pantry on the spot: the row goes
	 * away.
	 * @type {{ rows: ListRow[], onhave: (row: ListRow) => void }}
	 */
	let { rows, onhave } = $props();

	const kitchen = useKitchen();
</script>

<ul class="buy">
	{#each rows as row (row.key)}
		{@const reason = rowReason(row, kitchen.recipesById)}
		<li class="buy__row" transition:collapse>
			<p class="buy__text">
				<strong class="buy__name">{row.name}</strong>
				{#if reason}
					<span class="buy__reason">{reason}</span>
				{/if}
			</p>
			{#if row.ingredient && isCounted(row.ingredient) && row.quantity > 0}
				<span class="buy__amount">{formatQuantity(row.quantity, row.ingredient.unit)}</span>
			{/if}
			{#if row.ingredient && row.quantity > 0}
				<button class="buy__have" type="button" onclick={() => onhave(row)}>
					Have it <span class="visually-hidden">: {row.name}</span>
				</button>
			{/if}
		</li>
	{:else}
		<li class="buy__row buy__row--none">The pantry has all the food for the menu.</li>
	{/each}
</ul>

<style>
	.buy {
		margin: 0;
		padding: 0;
		list-style: none;
		border-block-start: var(--rule-4) solid var(--ink);
	}

	.buy__row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-block-size: 3.5rem;
		border-block-end: var(--rule-1) solid var(--ink);
	}

	.buy__row--none {
		font-weight: 600;
		color: var(--ink-soft);
	}

	.buy__text {
		display: flex;
		flex: 1;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 var(--space-2);
		min-inline-size: 0;
	}

	.buy__name {
		font-size: 1.125rem;
		font-weight: 800;
	}

	.buy__reason {
		font-size: 0.875rem;
		color: var(--ink-soft);
	}

	.buy__amount {
		font-family: var(--font-display);
		font-size: 1.5rem;
		line-height: 1;
		white-space: nowrap;
	}

	.buy__have {
		flex: none;
		min-block-size: var(--tap);
		padding: 0 var(--space-1);
		font-weight: 800;
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 0.25em;
		white-space: nowrap;
		background: none;
		border: 0;
		cursor: pointer;
		transition: scale 0.2s var(--ease-out);

		&:active {
			scale: 0.94;
		}
	}
</style>
