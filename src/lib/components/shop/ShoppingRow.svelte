<script>
	import Icon from '$lib/components/ui/Icon.svelte';
	import { isCounted } from '$lib/domain/put-away';
	import { collapse } from '$lib/motion/transitions';
	import { formatQuantity } from '$lib/util/format';
	import ProductTile from './ProductTile.svelte';

	/** @typedef {import('$lib/types').Product} Product */

	/** The row shows the photos of this many products: the newest purchases. */
	const MAX_PHOTOS = 3;

	/**
	 * One item of the shopping list that is not in the cart. A tap on the row puts the item in
	 * the cart. A tap on a photo does the same, and tells the app which product it is.
	 * An item that only the owner added has a button that removes it from the list.
	 * @type {{
	 *   row: import('$lib/domain/shopping').ListRow,
	 *   products: Product[],
	 *   ontake: (product: Product | null) => void,
	 *   onremove?: () => void
	 * }}
	 */
	let { row, products, ontake, onremove } = $props();

	const unit = $derived(row.ingredient?.unit);
	const amount = $derived(
		row.ingredient && isCounted(row.ingredient) && row.quantity > 0
			? formatQuantity(row.quantity, row.ingredient.unit)
			: ''
	);
	const shown = $derived(products.slice(0, MAX_PHOTOS));

	/** The row goes out after a tap. A second tap in that time must not take a second package. */
	let taken = false;

	/** @param {Product | null} product */
	function take(product) {
		if (taken) return;
		taken = true;
		ontake(product);
	}
</script>

<li class="list__item shopping-row" transition:collapse>
	<!-- This button covers the full row. The photos and "Remove" lie on it. -->
	<button class="shopping-row__take" type="button" onclick={() => take(null)}>
		<span class="visually-hidden">Put in the cart:</span>
		<strong>{row.name}</strong>
		{#if amount}
			<span class="muted">{amount}</span>
		{/if}
	</button>

	{#if shown.length > 0}
		<ul class="shopping-row__products" aria-label="Products of {row.name}">
			{#each shown as product (product.id)}
				<li>
					<ProductTile
						{product}
						{unit}
						label="Put in the cart: {product.name}"
						onclick={() => take(product)}
					/>
				</li>
			{/each}
		</ul>
	{/if}

	{#if onremove}
		<button class="button button--round shopping-row__remove" type="button" onclick={onremove}>
			<Icon name="close" />
			<span class="visually-hidden">Remove {row.name} from the list</span>
		</button>
	{/if}
</li>

<style>
	.list__item.shopping-row {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding-block: var(--space-2);
	}

	.shopping-row__take {
		display: flex;
		flex: 1;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 var(--space-2);
		min-inline-size: 0;
		min-block-size: var(--tap);
		padding: 0;
		align-content: center;
		text-align: start;
		background: none;
		border: 0;
		cursor: pointer;

		&::after {
			position: absolute;
			inset: 0 calc(-1 * var(--space-3));
			content: '';
			border-radius: var(--radius-control);
		}

		&:active::after {
			background: color-mix(in srgb, var(--ink) 7%, transparent);
		}

		/* Only for a mouse: on a touch screen, a hover stays after the tap. */
		@media (hover: hover) {
			&:hover::after {
				background: color-mix(in srgb, var(--ink) 4%, transparent);
			}
		}

		&:focus-visible {
			outline: none;

			&::after {
				outline: 3px solid var(--ink);
			}
		}
	}

	.shopping-row__products {
		position: relative;
		display: flex;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.shopping-row__remove {
		position: relative;
		flex: none;
	}
</style>
