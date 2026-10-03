<script>
	import Icon from '$lib/components/ui/Icon.svelte';
	import { formatQuantity } from '$lib/util/format';
	import ProductTile from './ProductTile.svelte';

	/** @typedef {import('$lib/types').Product} Product */

	/**
	 * The products of one ingredient as photos. A tap on a photo tells the app which product is
	 * in the cart. "New" starts a product that has no photo yet.
	 * "asking" shows the question "Which one?": the app needs the package size, does not know
	 * the product, and the ingredient has more than one.
	 * @type {{
	 *   name: string,
	 *   products: Product[],
	 *   unit: import('$lib/types').Unit | undefined,
	 *   selected: Product | undefined,
	 *   asking: boolean,
	 *   onselect: (product: Product) => void,
	 *   onnew: () => void
	 * }}
	 */
	let { name, products, unit, selected, asking, onselect, onnew } = $props();

	/** @param {Product} product */
	const label = (product) =>
		unit && product.quantity > 0
			? `${product.name}, ${formatQuantity(product.quantity, unit)}`
			: product.name;
</script>

<div class="product-picker" role="group" aria-label="Product of {name}">
	{#if asking}
		<strong class="product-picker__question">Which one?</strong>
	{/if}

	{#each products as product (product.id)}
		<ProductTile
			{product}
			{unit}
			label={label(product)}
			pressed={selected ? selected.id === product.id : undefined}
			onclick={() => onselect(product)}
		/>
	{/each}

	<button class="button product-picker__new" type="button" onclick={onnew}>
		<Icon name="plus" />
		<!-- With photos in the row, the button is short. Its full name is for screen readers. -->
		New
		<span class={[products.length > 0 && 'visually-hidden']}>product</span>
		<span class="visually-hidden">for {name}</span>
	</button>
</div>

<style>
	.product-picker {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
	}

	.product-picker__question {
		inline-size: 100%;
	}

	.product-picker__new {
		gap: var(--space-1);
		padding-inline: var(--space-4);
	}
</style>
