<script>
	import { isCounted } from '$lib/domain/put-away';
	import { round } from '$lib/util/format';
	import PackagesButton from './PackagesButton.svelte';
	import ProductPhoto from './ProductPhoto.svelte';
	import ProductPicker from './ProductPicker.svelte';
	import QuantityStepper from './QuantityStepper.svelte';

	/**
	 * @typedef {import('$lib/domain/put-away').CartEntry} CartEntry
	 * @typedef {import('$lib/types').Product} Product
	 * @typedef {{ quantity: number | null, price: number | null }} Numbers
	 *   quantity: null for an item that the app does not count. price: for one package.
	 */

	/**
	 * The fields of one item of the receipt, as a form: the photo of the product, the question
	 * "Which one?", the quantity as the largest text, with minus and plus, and the price. The
	 * main button is at the right, as on the card of the Menu screen.
	 *
	 * It shows the fields and tells what the owner did. The card around it decides what a change
	 * does: see CartItemForm and AmendItemForm.
	 * @type {{
	 *   entry: CartEntry,
	 *   titleId: string,
	 *   product: Product | undefined,
	 *   quantity: number,
	 *   cancel: string,
	 *   confirm: string,
	 *   onselect: (product: Product) => void,
	 *   onnew: () => void,
	 *   onquantity: (quantity: number | null) => void,
	 *   onprice?: (price: number | null) => void,
	 *   oncancel: () => void,
	 *   onconfirm: (numbers: Numbers) => void,
	 *   children?: import('svelte').Snippet,
	 *   foot?: import('svelte').Snippet
	 * }}
	 *   titleId: the ID of the name, for the label of the dialog. product, quantity: what the card
	 *   shows. cancel, confirm: the words of the two buttons. onquantity: null when the field is
	 *   not a number, and then the card shows the quantity of the record again. children: the
	 *   fields between the quantity and the price. foot: an action below the two buttons.
	 */
	let {
		entry,
		titleId,
		product,
		quantity,
		cancel,
		confirm,
		onselect,
		onnew,
		onquantity,
		onprice,
		oncancel,
		onconfirm,
		children,
		foot
	} = $props();

	const uid = $props.id();

	const { purchase, ingredient } = $derived(entry);
	const counted = $derived(isCounted(ingredient));
	const unit = $derived(ingredient?.unit);

	/** @param {number} value */
	const finite = (value) => (Number.isFinite(value) ? value : null);

	/**
	 * The card takes the numbers from its fields, and not from the record: a number that the
	 * owner typed a moment ago is in the field, but can be on its way to the record.
	 * @param {SubmitEvent & { currentTarget: HTMLFormElement }} event
	 */
	function submit(event) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const price = String(data.get('price') ?? '').trim();
		onconfirm({
			quantity: counted ? Number(data.get('quantity')) || 0 : null,
			price: price ? finite(Number(price)) : null
		});
	}
</script>

<form class="item-fields" onsubmit={submit}>
	{#if product?.photoId}
		{#key product.id}
			<div class="item-fields__photo"><ProductPhoto {product} /></div>
		{/key}
	{/if}

	<div>
		<h2 id={titleId}>{purchase.name}</h2>
		{#if product && product.name !== purchase.name}
			<p class="muted">{product.name}</p>
		{/if}
	</div>

	{#if ingredient}
		<ProductPicker
			name={purchase.name}
			products={entry.products}
			unit={counted ? unit : undefined}
			selected={product}
			asking={counted && !product && entry.products.length > 1}
			{onselect}
			{onnew}
		/>
	{/if}

	{#if counted && unit}
		<QuantityStepper
			name={purchase.name}
			{unit}
			{quantity}
			onchange={(value) => onquantity(Number.isFinite(value) ? Math.max(0, round(value)) : null)}
		/>
	{/if}

	{@render children?.()}

	<div class="item-fields__price">
		<PackagesButton {purchase} />
		<div class="field">
			<label class="field__label" for="{uid}-price">
				{purchase.packages > 1 ? 'Price of 1 package' : 'Price'}
			</label>
			<input
				class="field__control"
				id="{uid}-price"
				name="price"
				type="number"
				inputmode="decimal"
				min="0"
				step="any"
				placeholder="0.00"
				value={entry.price?.toFixed(2) ?? ''}
				onchange={(event) => onprice?.(finite(event.currentTarget.valueAsNumber))}
			/>
		</div>
	</div>

	<div class="item-fields__actions">
		<button class="button" type="button" onclick={oncancel}>{cancel}</button>
		<button class="button button--primary" type="submit">{confirm}</button>
	</div>

	{@render foot?.()}
</form>

<style>
	.item-fields {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	/* The photo goes to the edges of the card, as the photo of a meal card. */
	.item-fields__photo {
		margin: calc(-1 * var(--space-6)) calc(-1 * var(--space-6)) 0;
		border-radius: var(--radius) var(--radius) 0 0;

		& :global(.product-photo) {
			aspect-ratio: 16 / 10;
		}
	}

	.item-fields__price {
		display: flex;
		align-items: end;
		gap: var(--space-3);

		& .field {
			flex: 1;
		}
	}

	/* The main button is at the right, and it is the wide one. */
	.item-fields__actions {
		display: grid;
		grid-template-columns: 1fr 1.6fr;
		gap: var(--space-3);
	}
</style>
