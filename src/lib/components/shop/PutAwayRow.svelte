<script>
	import { setProduct } from '$lib/data/cart';
	import { isCounted, proposeQuantity, putAway } from '$lib/data/put-away';
	import { collapse } from '$lib/motion/transitions';
	import { status } from '$lib/status.svelte';
	import { plural, unitLabel } from '$lib/util/format';
	import PackagesButton from './PackagesButton.svelte';
	import ProductPicker from './ProductPicker.svelte';

	/**
	 * @typedef {import('$lib/types').Product} Product
	 * @typedef {import('$lib/types').Purchase} Purchase
	 * @typedef {import('$lib/data/put-away').Line} Line
	 */

	/**
	 * One item of the cart, at home. The app proposes a quantity, and the owner confirms it or
	 * corrects it. "Put away" moves the item into the pantry. The price is optional: the app
	 * fills in the last price of the product.
	 * The row writes its values into "lines", so that one button can put all items away.
	 * @type {{
	 *   purchase: Purchase,
	 *   ingredient: import('$lib/types').Ingredient | null,
	 *   products: Product[],
	 *   last: Purchase | undefined,
	 *   need: number,
	 *   prices: Map<string, number>,
	 *   lines: Map<string, Line>,
	 *   onnew: () => void,
	 *   ondone: () => void
	 * }}
	 *   products: the products of the ingredient. last: the last purchase of the ingredient.
	 *   need: what the menu needs and the pantry does not have. prices: the last price of each
	 *   product.
	 */
	let { purchase, ingredient, products, last, need, prices, lines, onnew, ondone } = $props();

	const uid = $props.id();

	/**
	 * What the owner typed. Null: the field shows the proposal of the app.
	 * @type {string | null}
	 */
	let typedQuantity = $state(null);
	/** @type {string | null} */
	let typedPrice = $state(null);

	const counted = $derived(isCounted(ingredient));

	/** The product of the purchase. An ingredient with only one product: the app proposes it. */
	const product = $derived(
		products.find((entry) => entry.id === purchase.productId) ??
			(products.length === 1 ? products[0] : undefined)
	);

	const proposal = $derived(proposeQuantity({ purchase, ingredient, product, last, need }));
	const lastPrice = $derived(product && prices.get(product.id));

	// A proposal of zero is an empty field: the owner sees that the app has no number.
	const quantityText = $derived(typedQuantity ?? String(proposal || ''));
	const priceText = $derived(typedPrice ?? lastPrice?.toFixed(2) ?? '');

	/** @type {Line} */
	const line = $derived({
		purchase,
		ingredient,
		productId: product?.id ?? null,
		quantity: counted ? Number(quantityText) || 0 : null,
		price: priceText.trim() && Number.isFinite(Number(priceText)) ? Number(priceText) : null
	});

	$effect(() => {
		const id = purchase.id;
		lines.set(id, line);
		return () => lines.delete(id);
	});

	/** @param {SubmitEvent} event */
	async function submit(event) {
		event.preventDefault();
		await putAway([line]);
		status.say(ingredient ? `${purchase.name} is in the pantry.` : `${purchase.name} is put away.`);
		ondone();
	}
</script>

<li class="put-away-row" transition:collapse>
	<form class="put-away-row__form" onsubmit={submit}>
		<div class="put-away-row__head">
			<h2 class="put-away-row__name">{purchase.name}</h2>
			{#if purchase.packages > 1}
				<span class="muted">{plural(purchase.packages, 'package')}</span>
			{/if}
			<PackagesButton {purchase} />
		</div>

		{#if ingredient}
			<ProductPicker
				name={purchase.name}
				{products}
				unit={counted ? ingredient.unit : undefined}
				selected={product}
				asking={counted && !product && products.length > 1}
				onselect={(selected) => setProduct(purchase, selected.id)}
				{onnew}
			/>
		{/if}

		<div class="put-away-row__fields">
			{#if counted && ingredient}
				<div class="field">
					<label class="field__label" for="{uid}-quantity">
						Quantity
						{#if ingredient.unit !== 'count'}({unitLabel(ingredient.unit)}){/if}
					</label>
					<input
						class="field__control"
						id="{uid}-quantity"
						type="number"
						inputmode="decimal"
						min="0"
						step="any"
						required
						value={quantityText}
						oninput={(event) => (typedQuantity = event.currentTarget.value)}
					/>
				</div>
			{/if}

			<div class="field">
				<label class="field__label" for="{uid}-price">
					{purchase.packages > 1 ? 'Price of 1 package' : 'Price'}
				</label>
				<input
					class="field__control"
					id="{uid}-price"
					type="number"
					inputmode="decimal"
					min="0"
					step="any"
					value={priceText}
					oninput={(event) => (typedPrice = event.currentTarget.value)}
				/>
			</div>

			<button class="button button--strong put-away-row__action" type="submit">
				Put away <span class="visually-hidden">: {purchase.name}</span>
			</button>
		</div>
	</form>
</li>

<style>
	.put-away-row {
		padding: var(--space-4);
		background: var(--color-surface);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
	}

	.put-away-row__form {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.put-away-row__head {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.put-away-row__name {
		flex: 1;
		font-size: 1.1rem;
	}

	/* The fields share the row with the button, so their labels and their padding are small. */
	.put-away-row__fields {
		display: flex;
		align-items: end;
		gap: var(--space-2);

		& .field {
			flex: 1 1 0;
			gap: var(--space-1);
			min-inline-size: 0;
		}

		& .field__label {
			font-size: 0.8rem;
			line-height: 1.2;
			color: var(--color-muted);
		}

		& .field__control {
			padding-inline: var(--space-3);
		}
	}

	.put-away-row__action {
		flex: none;
		padding-inline: var(--space-4);
	}
</style>
