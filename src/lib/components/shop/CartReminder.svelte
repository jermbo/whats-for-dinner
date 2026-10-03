<script>
	import { resolve } from '$app/paths';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { cartPurchases } from '$lib/data/trips';
	import { live } from '$lib/live.svelte';

	/**
	 * While the cart has items, this link reminds the owner to put them away, for example
	 * "8 items wait to be put away". With an empty cart, it shows nothing.
	 */
	const cart = live(cartPurchases, []);
	const count = $derived(cart.current.length);
</script>

{#if count > 0}
	<a class="cart-reminder" href={resolve('/shop/put-away')}>
		<Icon name="shop" />
		<span class="cart-reminder__text">
			{count === 1 ? '1 item waits' : `${count} items wait`} to be put away
		</span>
		<Icon name="next" />
	</a>
{/if}

<style>
	.cart-reminder {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-block-size: var(--tap);
		padding: var(--space-2) var(--space-4);
		font-weight: 600;
		text-decoration: none;
		color: var(--color-text);
		background: var(--color-notice);
		border-radius: var(--radius-pill);
		transition: scale 0.25s var(--ease-spring);

		&:active {
			scale: 0.97;
		}

		& :global(.icon) {
			flex: none;
		}
	}

	.cart-reminder__text {
		flex: 1;
	}
</style>
