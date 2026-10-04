<script>
	import { tick } from 'svelte';
	import { correct, setProduct } from '$lib/data/cart';
	import { isCounted } from '$lib/data/put-away';
	import { sideColumn } from '$lib/layout/side-column';
	import { round, unitLabel } from '$lib/util/format';
	import PackagesButton from './PackagesButton.svelte';
	import ProductPhoto from './ProductPhoto.svelte';
	import ProductPicker from './ProductPicker.svelte';

	/**
	 * @typedef {import('$lib/data/put-away').CartEntry} CartEntry
	 * @typedef {import('$lib/types').Product} Product
	 */

	/** One tap on minus or plus changes a weight or a volume by this number. A count: by one. */
	const STEP = 50;

	/**
	 * The card of one item of the receipt: the photo of the product, the question "Which one?",
	 * and the quantity as the largest text, with minus and plus. The main button is at the right,
	 * as on the card of the Menu screen.
	 *
	 * An item in the cart: "Put away" puts it into the pantry. A change on the card goes into the
	 * record at once, so the receipt shows it after "Later" too.
	 * An item that is put away: the card corrects it. The changes go into the record with "Save",
	 * so that the pantry changes one time. "Cancel" makes no change.
	 *
	 * The card reads the item from "entries", so that a change, such as a new product, shows at
	 * once.
	 *
	 * On a page with one column, the card is a modal sheet above the page. On a page with a side
	 * column, the card is a panel in that column: put the card in the "split__side" element.
	 * The receipt stays in use next to the panel. After "Put away", the panel shows the next item
	 * that is in the cart.
	 * @type {{
	 *   entries: CartEntry[],
	 *   onputaway: (entry: CartEntry) => void,
	 *   onamend: (entry: CartEntry) => void,
	 *   onnew: (entry: CartEntry) => void
	 * }}
	 */
	let { entries, onputaway, onamend, onnew } = $props();

	const uid = $props.id();

	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state();
	/** The ID of the purchase that is open. */
	let openId = $state('');
	/** True when the card opened for an item that is put away. */
	let amending = $state(false);
	/**
	 * The quantity and the product that the owner set for an item that is put away. They wait
	 * for "Save". Null: no change.
	 * @type {number | null}
	 */
	let newQuantity = $state(null);
	/** @type {Product | null} */
	let newProduct = $state(null);

	const entry = $derived(entries.find((item) => item.purchase.id === openId));
	const product = $derived(newProduct ?? entry?.product);
	const quantity = $derived(newQuantity ?? entry?.quantity ?? 0);
	const counted = $derived(isCounted(entry?.ingredient));
	const unit = $derived(entry?.ingredient?.unit);

	/** True when the card is open as a panel in the side column. */
	const isPanel = () => Boolean(dialog?.open && !dialog.matches(':modal'));

	/** @param {string} purchaseId */
	export async function open(purchaseId) {
		if (!dialog) return;
		// The panel is open, and the focus is in it: the focus must go to the new item.
		const inPanel = isPanel() && dialog.contains(document.activeElement);

		openId = purchaseId;
		amending = entries.some((item) => item.purchase.id === purchaseId && item.purchase.putAwayAt);
		newQuantity = null;
		newProduct = null;

		if (isPanel() && sideColumn(dialog)) {
			// The panel stays open. Only its item changes.
			if (!inPanel) return;
			await tick();
			/** @type {HTMLElement | null} */ (dialog.querySelector('button, input'))?.focus();
			return;
		}

		if (dialog.open) dialog.close();
		if (sideColumn(dialog)) dialog.show();
		else dialog.showModal();
	}

	/** In a narrow window, the page has no side column: a panel has no place, and it closes. */
	function fit() {
		if (dialog && isPanel() && !sideColumn(dialog)) dialog.close();
	}

	// The panel does not cover the receipt. The ring of a line, or "Put all away", can put the
	// open item away: then its card closes.
	$effect(() => {
		if (!amending && entry?.purchase.putAwayAt && isPanel()) dialog?.close();
	});

	/**
	 * The next item of the receipt that is in the cart, after this one.
	 * @param {CartEntry} current
	 */
	function nextWaiting(current) {
		const at = entries.findIndex((item) => item.purchase.id === current.purchase.id);
		return [...entries.slice(at + 1), ...entries.slice(0, at)].find(
			(item) => !item.purchase.putAwayAt
		);
	}

	/**
	 * @param {CartEntry} item
	 * @param {number} value Not a number: the card shows the quantity of the record again.
	 */
	function setQuantity(item, value) {
		const next = Number.isFinite(value) ? Math.max(0, round(value)) : null;
		if (amending) newQuantity = next;
		else correct(item.purchase, { quantity: next });
	}

	/**
	 * @param {CartEntry} item
	 * @param {Product} selected
	 */
	function select(item, selected) {
		if (amending) newProduct = selected;
		else setProduct(item.purchase, selected.id);
	}

	/**
	 * A new product goes into the record when it is made, also for an item that is put away.
	 * @param {CartEntry} item
	 */
	function startProduct(item) {
		newProduct = null;
		onnew(item);
	}

	/**
	 * @param {CartEntry} item
	 * @param {number} price
	 */
	function setPrice(item, price) {
		if (!amending) correct(item.purchase, { price: Number.isFinite(price) ? price : null });
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
		const values = {
			...entry,
			product,
			quantity: counted ? Number(data.get('quantity')) || 0 : null,
			price: price && Number.isFinite(Number(price)) ? Number(price) : null
		};

		// The panel goes on to the next item in the cart.
		const next = !amending && isPanel() ? nextWaiting(entry) : undefined;

		if (amending) onamend(values);
		else onputaway(values);

		if (next) open(next.purchase.id);
		else dialog?.close();
	}
</script>

<svelte:window onresize={fit} />

<dialog class="item-card" bind:this={dialog} aria-labelledby="{uid}-title">
	{#if entry}
		{@const item = entry}
		{@const { purchase, ingredient } = item}

		<!-- A new key gives new fields for each item: the panel goes from one item to the next. -->
		{#key purchase.id}
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
						onselect={(selected) => select(item, selected)}
						onnew={() => startProduct(item)}
					/>
				{/if}

				{#if counted && unit}
					{@const step = unit === 'count' ? 1 : STEP}
					<div class="item-card__quantity">
						<button
							class="button button--round"
							type="button"
							onclick={() => setQuantity(item, quantity - step)}
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
								value={quantity || ''}
								onchange={(event) => setQuantity(item, event.currentTarget.valueAsNumber)}
							/>
							{#if unit !== 'count'}
								<span class="item-card__unit" aria-hidden="true">{unitLabel(unit)}</span>
							{/if}
						</label>

						<button
							class="button button--round"
							type="button"
							onclick={() => setQuantity(item, quantity + step)}
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
							onchange={(event) => setPrice(item, event.currentTarget.valueAsNumber)}
						/>
					</div>
				</div>

				<div class="item-card__actions">
					<button class="button" type="button" onclick={() => dialog?.close()}>
						{amending ? 'Cancel' : 'Later'}
					</button>
					<button class="button button--primary" type="submit">
						{amending ? 'Save' : 'Put away'}
					</button>
				</div>
			</form>
		{/key}
	{/if}
</dialog>

<!-- The side column is empty while the panel is closed. This line tells how to open it. -->
<p class="item-card__hint muted split__extra">Select a line of the receipt to see its card.</p>

<style>
	/* A panel in the side column of the page: it is in the page, and not above it. */
	.item-card:not(:modal) {
		position: static;
		inline-size: 100%;
		max-inline-size: none;
		max-block-size: none;
		margin: 0;
	}

	/* The browser sets "open", so the selector is global. */
	.item-card:global([open]) + .item-card__hint {
		display: none;
	}

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
		font-family: var(--font-display);
		font-weight: 400;
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
		border-block-end: 2px dashed var(--ink);
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
		color: var(--ink-soft);
	}

	.item-card__price {
		display: flex;
		align-items: end;
		gap: var(--space-3);

		& .field {
			flex: 1;
		}
	}

	/* The main button is at the right, and it is the wide one. */
	.item-card__actions {
		display: grid;
		grid-template-columns: 1fr 1.6fr;
		gap: var(--space-3);
	}
</style>
