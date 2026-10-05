<script>
	import { useByBadge } from '$lib/domain/use-by';
	import PantryToShop from './PantryToShop.svelte';

	/** @typedef {import('$lib/domain/pantry-view').PantryRow} PantryRow */

	/** The panel shows this many rows of food to use. */
	const MAX_SOON = 4;

	/**
	 * The side column of the pantry: the two answers that the owner comes for. "Use soon" has
	 * the food that spoils first. "Below the line" has the food to buy, and the button that
	 * sends it to the shopping list. A tap on a row of "Use soon" opens the detail of the item.
	 * @type {{
	 *   soon: PantryRow[],
	 *   soonText: string,
	 *   below: number,
	 *   belowText: string,
	 *   toShop: number,
	 *   onadd: () => void,
	 *   onopen: (row: PantryRow) => void
	 * }}
	 *   soon: the rows with a use-by date in this week, the fewest days first. below: the number
	 *   of rows below the low line. toShop: those that are not on the shopping list.
	 */
	let { soon, soonText, below, belowText, toShop, onadd, onopen } = $props();

	const uid = $props.id();
</script>

<section class="stack stack--tight" aria-labelledby="{uid}-soon">
	<div class="pantry-side__head">
		<h2 id="{uid}-soon">Use soon</h2>
		<p class="count">{soon.length}</p>
	</div>

	{#if soon.length > 0}
		<ul class="pantry-side__rows">
			{#each soon.slice(0, MAX_SOON) as row (row.item.id)}
				{@const badge = useByBadge(row.left)}
				<li>
					<button class="pantry-side__row" type="button" onclick={() => onopen(row)}>
						<span>{row.ingredient.name}</span>
						{#if badge}
							<span class={['badge', badge.urgent && 'badge--urgent']}>{badge.text}</span>
						{:else}
							<span class="muted">{row.left} days</span>
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
	<p class="pantry-side__text">{soonText}</p>
</section>

<section class="stack stack--tight" aria-labelledby="{uid}-below">
	<div class="pantry-side__head">
		<h2 id="{uid}-below">Below the line</h2>
		<p class="count">{below}</p>
	</div>
	<p class="pantry-side__text">{belowText}</p>
	<PantryToShop count={toShop} {below} {onadd} />
</section>

<style>
	.pantry-side__head {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: var(--space-3);
		padding-block-end: var(--space-2);
		border-block-end: var(--rule-4) solid var(--ink);
	}

	.pantry-side__rows {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.pantry-side__row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		inline-size: 100%;
		min-block-size: var(--tap);
		padding: 0;
		font-weight: 700;
		text-align: start;
		background: none;
		border: 0;
		border-block-end: var(--rule-1) solid var(--hairline);
		cursor: pointer;

		@media (hover: hover) {
			&:hover > :first-child {
				text-decoration: underline;
				text-decoration-thickness: 2px;
				text-underline-offset: 0.2em;
			}
		}
	}

	.pantry-side__text {
		color: var(--ink-soft);
		font-weight: 600;
	}
</style>
