<script>
	import { formatQuantity } from '$lib/util/format';

	/**
	 * A product that the owner scanned before. One tap adds it to the pantry.
	 * @type {{
	 *   product: import('$lib/domain/products').ProductDraft,
	 *   ingredient: import('$lib/types').Ingredient | undefined,
	 *   onadd: () => void,
	 *   onedit: () => void,
	 *   oncancel: () => void
	 * }}
	 */
	let { product, ingredient, onadd, onedit, oncancel } = $props();
</script>

<div class="card">
	<h2 class="card__title">{product.name}</h2>

	{#if ingredient}
		<p>
			{ingredient.name}
			{#if ingredient.tracking === 'quantity'}
				· {formatQuantity(product.quantity, ingredient.unit)}
			{/if}
		</p>
		<button class="button button--primary button--wide" type="button" onclick={onadd}>
			Add to the pantry
		</button>
	{:else}
		<p>The ingredient of this product does not exist. Select it again.</p>
	{/if}

	<div class="cluster">
		<button class="button" type="button" onclick={onedit}>Change the product</button>
		<button class="button" type="button" onclick={oncancel}>Cancel</button>
	</div>
</div>
