<script>
	import ProductPhoto from './ProductPhoto.svelte';

	/**
	 * The photo of one product as a button. The label says what the tap does.
	 * "pressed" is for a choice between products: the product that is selected has a dark ring.
	 * @type {{
	 *   product: import('$lib/types').Product,
	 *   unit?: import('$lib/types').Unit,
	 *   label: string,
	 *   pressed?: boolean,
	 *   onclick: () => void
	 * }}
	 */
	let { product, unit, label, pressed, onclick } = $props();
</script>

<button class="product-tile" type="button" aria-pressed={pressed} {onclick}>
	<ProductPhoto {product} {unit} />
	<span class="visually-hidden">{label}</span>
</button>

<style>
	.product-tile {
		display: block;
		inline-size: var(--tap);
		block-size: var(--tap);
		padding: 0;
		background: none;
		border: 0;
		border-radius: var(--radius-control);
		box-shadow: 0 0 0 1px var(--ink);
		cursor: pointer;
		transition:
			box-shadow 0.15s,
			scale 0.25s var(--ease-spring);

		&:active {
			scale: 0.92;
		}

		/* A thick ring tells which product is selected, and the other products are dim. */
		&[aria-pressed='true'] {
			box-shadow: 0 0 0 3px var(--color-strong);
		}

		&[aria-pressed='false'] {
			opacity: 0.7;
		}
	}
</style>
