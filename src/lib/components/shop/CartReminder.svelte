<script>
	import { resolve } from '$app/paths';
	import { cartPurchases } from '$lib/data/trips';
	import { live } from '$lib/live.svelte';

	/**
	 * While the cart has items, this link reminds the owner to put them away. It is small, so
	 * that it fits in the row of a screen title: "Put away" and the number of items. A screen
	 * reader gets the full sentence, for example "8 items wait to be put away".
	 * With an empty cart, it shows nothing.
	 */
	const cart = live(cartPurchases, []);
	const count = $derived(cart.current.length);
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
	.cart-reminder {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		min-block-size: var(--tap);
		padding: var(--space-2) var(--space-3) var(--space-2) var(--space-4);
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
		color: var(--color-text);
		background: var(--color-notice);
		border-radius: var(--radius-pill);
		transition: scale 0.25s var(--ease-spring);

		&:active {
			scale: 0.95;
		}
	}

	/* The number of items, as a dark disc. */
	.cart-reminder__count {
		display: grid;
		place-items: center;
		min-inline-size: 1.6rem;
		block-size: 1.6rem;
		padding-inline: var(--space-1);
		font-size: 0.85rem;
		font-variant-numeric: tabular-nums;
		color: var(--color-on-strong);
		background: var(--color-strong);
		border-radius: var(--radius-pill);
	}
</style>
