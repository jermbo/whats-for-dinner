<script>
	import { putBack } from '$lib/data/cart';
	import { collapse } from '$lib/motion/transitions';
	import { status } from '$lib/status.svelte';
	import { plural } from '$lib/util/format';
	import PackagesButton from './PackagesButton.svelte';
	import ProductPhoto from './ProductPhoto.svelte';

	/**
	 * One item in the cart, with a line through its name. "Undo" puts the item back on the list.
	 * The photo shows the product, when the owner selected one.
	 * @type {{
	 *   purchase: import('$lib/types').Purchase,
	 *   product: import('$lib/types').Product | undefined,
	 *   unit: import('$lib/types').Unit | undefined
	 * }}
	 */
	let { purchase, product, unit } = $props();

	async function undo() {
		await putBack(purchase);
		status.say(`${purchase.name} is back on the list.`);
	}
</script>

<li class="list__item cart-row" transition:collapse>
	{#if product}
		<span class="cart-row__photo"><ProductPhoto {product} {unit} /></span>
	{/if}

	<span class="cart-row__text">
		<s class="cart-row__name">{purchase.name}</s>
		{#if purchase.packages > 1}
			<span class="muted">{plural(purchase.packages, 'package')}</span>
		{/if}
	</span>

	<PackagesButton {purchase} />
	<button class="button cart-row__undo" type="button" onclick={undo}>
		Undo <span class="visually-hidden">: {purchase.name}</span>
	</button>
</li>

<style>
	.list__item.cart-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding-block: var(--space-2);
	}

	.cart-row__photo {
		flex: none;
		inline-size: 2.25rem;
		border-radius: var(--radius-sticker);
	}

	.cart-row__text {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-inline-size: 0;
	}

	.cart-row__name {
		color: var(--color-muted);
	}

	.cart-row__undo {
		flex: none;
		padding-inline: var(--space-4);
	}
</style>
