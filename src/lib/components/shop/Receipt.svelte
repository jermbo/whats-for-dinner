<script>
	import { formatDay, formatMoney, plural } from '$lib/util/format';

	/**
	 * A trip as a paper receipt: the day, one line for each item, and the total. The total is the
	 * sum of the lines that have a price, so the receipt tells how many lines have none.
	 * When the trip is complete, the receipt gets a stamp.
	 * The children are the lines.
	 * @type {{
	 *   trip: import('$lib/types').Trip,
	 *   cost: import('$lib/data/trips').TripCost,
	 *   children: import('svelte').Snippet
	 * }}
	 */
	let { trip, cost, children } = $props();

	const day = $derived(formatDay(trip.startedAt));
</script>

<article class="receipt rise" aria-label="Receipt of {day}">
	<div class="receipt__paper">
		<header class="receipt__head">
			<p class="receipt__day">{day}</p>
			<p class="receipt__small">{plural(cost.lines, 'item')}</p>
		</header>

		<ul class="receipt__lines">
			{@render children()}
		</ul>

		<footer class="receipt__foot">
			<p class="receipt__total">
				<span>Total</span>
				<strong>{formatMoney(cost.total)}</strong>
			</p>
			{#if cost.noPrice > 0}
				<p class="receipt__small">{plural(cost.noPrice, 'item')} with no price</p>
			{/if}
		</footer>

		{#if trip.completedAt}
			<p class="receipt__stamp">All put away</p>
		{/if}
	</div>
</article>

<style>
	@keyframes stamp {
		from {
			opacity: 0;
			scale: 1.8;
		}
	}

	/* The shadow is on this box: the paper has a cut edge, and a cut removes a shadow. */
	.receipt {
		/* The receipt is white paper, not the warm paper of the page. */
		--paper: var(--card);
		--tooth: 0.4rem;

		inline-size: min(100%, 26rem);
		margin-inline: auto;
		filter: drop-shadow(0 0.5rem 0.9rem color-mix(in srgb, var(--ink) 20%, transparent));
	}

	/* The paper: the letters of a cash register, and teeth at the lower edge where it was torn. */
	.receipt__paper {
		position: relative;
		padding: var(--space-5) var(--space-4) calc(var(--space-5) + var(--tooth));
		font-family: var(--font-mono);
		font-size: 0.9rem;
		font-variant-numeric: tabular-nums;
		text-transform: uppercase;
		color: var(--ink);
		background: var(--paper);
		mask: conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% /
			calc(2 * var(--tooth)) 100%;
	}

	.receipt__head {
		padding-block-end: var(--space-3);
		text-align: center;
		border-block-end: 1px dashed var(--ink-soft);
	}

	.receipt__day {
		font-size: 1.1rem;
		font-weight: 700;
	}

	.receipt__small {
		font-size: 0.8rem;
		color: var(--ink-soft);
	}

	.receipt__lines {
		margin: 0;
		padding: var(--space-1) 0;
		list-style: none;

		& > :global(li + li) {
			border-block-start: 1px dotted color-mix(in srgb, var(--ink) 30%, transparent);
		}
	}

	.receipt__foot {
		padding-block-start: var(--space-3);
		border-block-start: 1px dashed var(--ink-soft);
	}

	.receipt__total {
		display: flex;
		justify-content: space-between;
		font-size: 1.1rem;
		font-weight: 700;
	}

	/* A rubber stamp, a little turned, that comes down on the paper. */
	.receipt__stamp {
		position: absolute;
		inset-block-end: calc(var(--space-6) + var(--tooth));
		inset-inline-start: 50%;
		padding: var(--space-1) var(--space-3);
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 400;
		line-height: 0.95;
		text-transform: uppercase;
		white-space: nowrap;
		color: var(--tomato-text);
		border: var(--rule-4) solid currentColor;
		border-radius: var(--radius-sticker);
		opacity: 0.85;
		pointer-events: none;
		translate: -50% 0;
		rotate: -9deg;
		animation: stamp 0.35s 0.25s var(--ease-spring) backwards;
	}
</style>
