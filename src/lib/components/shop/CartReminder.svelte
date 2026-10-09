<script>
	import { resolve } from '$app/paths';
	import { useShopping } from '$lib/state/shopping.svelte';

	/**
	 * While the cart has items, this link reminds the owner to put them away. It is small, so
	 * that it fits in the row of a screen title: "Put away" and the number of items. A screen
	 * reader gets the full sentence, for example "8 items wait to be put away".
	 * With an empty cart, it shows nothing.
	 */
	const shopping = useShopping();
	const count = $derived(shopping.cart.length);
</script>

{#if count > 0}
	<a class="cart-reminder" href={resolve('/shop/put-away')}>
		<span aria-hidden="true">Put away</span>
		<span class="cart-reminder__count" aria-hidden="true">{count}</span>
		<span class="visually-hidden">
			{count === 1 ? '1 item waits' : `${count} items wait`} to be put away
		</span>
	</a>
{/if}

<style>
	/* A white sticker with an ink rule, and the number in ink. */
	.cart-reminder {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		min-block-size: var(--tap);
		padding: var(--space-2) var(--space-2) var(--space-2) var(--space-3);
		font-size: 0.8125rem;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-decoration: none;
		text-transform: uppercase;
		white-space: nowrap;
		background: var(--card);
		border: 2px solid var(--ink);
		border-radius: var(--radius-control);
		transition: scale 0.2s var(--ease-out);

		&:active {
			scale: 0.96;
		}
	}

	/* The number of items, as an ink block. */
	.cart-reminder__count {
		display: grid;
		place-items: center;
		min-inline-size: 1.6rem;
		block-size: 1.6rem;
		padding-inline: var(--space-1);
		font-size: 0.8125rem;
		font-variant-numeric: tabular-nums;
		color: var(--paper);
		background: var(--ink);
		border-radius: var(--radius-sticker);
	}
</style>
