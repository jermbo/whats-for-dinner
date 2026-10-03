<script>
	import { correct, setProduct } from '$lib/data/cart';
	import { isCounted } from '$lib/data/put-away';
	import { round, unitLabel } from '$lib/util/format';
	import PackagesButton from './PackagesButton.svelte';
	import ProductPhoto from './ProductPhoto.svelte';
	import ProductPicker from './ProductPicker.svelte';

	/** @typedef {import('$lib/data/put-away').CartEntry} CartEntry */

	/** One tap on minus or plus changes a weight or a volume by this number. A count: by one. */
	const STEP = 50;

	/**
	 * The card of one item of the cart, for a line of the receipt that needs the owner: the photo
	 * of the product, the question "Which one?", and the quantity as the largest text, with minus
	 * and plus. "Put away" is at the right, and "Later" is at the left, as on the card of the
	 * Menu screen.
	 * The card reads the item from "entries", so that a change, such as a new product, shows at
	 * once. A change of the quantity goes into the record, so the receipt shows it too.
	 * @type {{
	 *   entries: CartEntry[],
	 *   onputaway: (entry: CartEntry) => void,
	 *   onnew: (entry: CartEntry) => void
	 * }}
	 */
	let { entries, onputaway, onnew } = $props();

	const uid = $props.id();

	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state();
	/** The ID of the purchase that is open. */
	let openId = $state('');

	const entry = $derived(
		entries.find((item) => item.purchase.id === openId && !item.purchase.putAwayAt)
	);
	const counted = $derived(isCounted(entry?.ingredient));
	const unit = $derived(entry?.ingredient?.unit);

	/** @param {string} purchaseId */
	export function open(purchaseId) {
		openId = purchaseId;
		dialog?.showModal();
	}

	// The item is put away, on the card or with "Put all away": the card has nothing to show.
	$effect(() => {
		if (!entry && dialog?.open) dialog.close();
	});

	/**
	 * @param {CartEntry} item
	 * @param {number} quantity Not a number: the app proposes the quantity again.
	 */
	function setQuantity(item, quantity) {
		correct(item.purchase, {
			quantity: Number.isFinite(quantity) ? Math.max(0, round(quantity)) : null
		});
	}

	/**
	 * The card takes the numbers from its fields, and not from the record: a number that the
	 * owner typed a moment ago is in the field, but can be on its way to the record.
	 * @param {SubmitEvent & { currentTarget: HTMLFormElement }} event
	 */
	function submit(event) {
		event.preventDefault();
		if (!entry) return;

		const data = new FormData(event.currentTarget);
		const price = String(data.get('price') ?? '').trim();
		onputaway({
			...entry,
			quantity: counted ? Number(data.get('quantity')) || 0 : null,
			price: price && Number.isFinite(Number(price)) ? Number(price) : null
		});
	}
</script>

<dialog class="item-card" bind:this={dialog} aria-labelledby="{uid}-title">
	{#if entry}
		{@const item = entry}
		{@const { purchase, ingredient, product } = item}

		<form class="item-card__form" onsubmit={submit}>
			{#if product?.photoId}
				{#key product.id}
					<div class="item-card__photo"><ProductPhoto {product} /></div>
				{/key}
			{/if}

			<div>
				<h2 id="{uid}-title">{purchase.name}</h2>
				{#if product && product.name !== purchase.name}
					<p class="muted">{product.name}</p>
				{/if}
			</div>

			{#if ingredient}
				<ProductPicker
					name={purchase.name}
					products={item.products}
					unit={counted ? unit : undefined}
					selected={product}
					asking={counted && !product && item.products.length > 1}
					onselect={(selected) => setProduct(purchase, selected.id)}
					onnew={() => onnew(item)}
				/>
			{/if}

			{#if counted && unit}
				{@const step = unit === 'count' ? 1 : STEP}
				<div class="item-card__quantity">
					<button
						class="button button--round"
						type="button"
						onclick={() => setQuantity(item, (item.quantity ?? 0) - step)}
					>
						<span aria-hidden="true">−</span>
						<span class="visually-hidden">Less</span>
					</button>

					<label class="item-card__number">
						<span class="visually-hidden">
							Quantity of {purchase.name} in {unitLabel(unit)}
						</span>
						<input
							class="item-card__input"
							name="quantity"
							type="number"
							inputmode="decimal"
							min="0"
							step="any"
							required
							value={item.quantity || ''}
							onchange={(event) => setQuantity(item, event.currentTarget.valueAsNumber)}
						/>
						{#if unit !== 'count'}
							<span class="item-card__unit" aria-hidden="true">{unitLabel(unit)}</span>
						{/if}
					</label>

					<button
						class="button button--round"
						type="button"
						onclick={() => setQuantity(item, (item.quantity ?? 0) + step)}
					>
						<span aria-hidden="true">+</span>
						<span class="visually-hidden">More</span>
					</button>
				</div>
			{/if}

			<div class="item-card__price">
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
						value={item.price?.toFixed(2) ?? ''}
						onchange={(event) => {
							const price = event.currentTarget.valueAsNumber;
							correct(purchase, { price: Number.isFinite(price) ? price : null });
						}}
					/>
				</div>
			</div>

			<div class="item-card__actions">
				<button class="button" type="button" onclick={() => dialog?.close()}>Later</button>
				<button class="button button--primary" type="submit">Put away</button>
			</div>
		</form>
	{/if}
</dialog>

<style>
	.item-card__form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	/* The photo goes to the edges of the card, as the photo of a meal card. */
	.item-card__photo {
		margin: calc(-1 * var(--space-6)) calc(-1 * var(--space-6)) 0;
		border-radius: var(--radius) var(--radius) 0 0;

		& :global(.product-photo) {
			aspect-ratio: 16 / 10;
		}
	}

	/* The quantity is the largest text of the card: it is what the owner confirms. */
	.item-card__quantity {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
	}

	.item-card__number {
		display: flex;
		align-items: baseline;
		gap: var(--space-1);
		font-family: var(--font-heading);
		font-weight: 600;
	}

	/* The field is as wide as its number, where the browser can do that. */
	.item-card__input {
		inline-size: 5ch;
		min-inline-size: 2ch;
		max-inline-size: 7ch;
		padding: 0;
		font-size: 2.5rem;
		line-height: 1.2;
		text-align: center;
		field-sizing: content;
		background: none;
		border: 0;
		border-block-end: 2px dashed var(--color-border);
		border-radius: 0;
		appearance: textfield;

		&::-webkit-inner-spin-button,
		&::-webkit-outer-spin-button {
			margin: 0;
			appearance: none;
		}
	}

	.item-card__unit {
		font-size: 1.35rem;
		color: var(--color-muted);
	}

	.item-card__price {
		display: flex;
		align-items: end;
		gap: var(--space-3);

		& .field {
			flex: 1;
		}
	}

	/* "Later" is at the left and "Put away" is at the right, and "Put away" is the wide one. */
	.item-card__actions {
		display: grid;
		grid-template-columns: 1fr 1.6fr;
		gap: var(--space-3);
	}
</style>
