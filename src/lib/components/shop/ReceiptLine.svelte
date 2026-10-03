<script>
	import Icon from '$lib/components/ui/Icon.svelte';
	import { correct } from '$lib/data/cart';
	import { isCounted } from '$lib/data/put-away';
	import { formatQuantity, plural } from '$lib/util/format';

	/**
	 * One line of the receipt: one item of the trip, with its quantity and its price.
	 * The ring at the left puts the item away with the quantity that the app proposes: one tap.
	 * A tap on the text opens the card of the item, where the owner corrects the quantity or
	 * selects the product. The price is a field in the line, so that the owner can type the
	 * prices down the column of the paper receipt.
	 * A line that needs an answer has "?" in the place of the ring, and the card opens first.
	 * A line that is put away has a check in the place of the ring. The owner can still correct
	 * it: the price in the line, and the quantity and the product on the card.
	 * @type {{
	 *   entry: import('$lib/data/put-away').CartEntry,
	 *   onputaway: () => void,
	 *   onopen: () => void
	 * }}
	 */
	let { entry, onputaway, onopen } = $props();

	const purchase = $derived(entry.purchase);
	const done = $derived(Boolean(purchase.putAwayAt));

	const amount = $derived(
		entry.ingredient && isCounted(entry.ingredient) && entry.quantity
			? formatQuantity(entry.quantity, entry.ingredient.unit)
			: ''
	);

	/** The small text below the name: the question, or the product and the packages. */
	const detail = $derived.by(() => {
		if (entry.asks) return entry.products.length > 1 ? 'Which one?' : 'How much?';
		const product = entry.product && entry.product.name !== purchase.name ? entry.product.name : '';
		const packages = purchase.packages > 1 ? plural(purchase.packages, 'package') : '';
		return [product, packages].filter(Boolean).join(' · ');
	});

	/**
	 * The text of the price while the owner types. Null: the field shows the price of the record,
	 * or, for an item in the cart, the last price of the product.
	 * @type {string | null}
	 */
	let typed = $state(null);
	const priceText = $derived(typed ?? entry.price?.toFixed(2) ?? '');

	/**
	 * Each letter goes into the record at once, so that a tap on the ring directly after has
	 * the new price.
	 * @param {Event & { currentTarget: HTMLInputElement }} event
	 */
	function typePrice(event) {
		typed = event.currentTarget.value;
		const price = Number(typed);
		correct(purchase, { price: typed.trim() && Number.isFinite(price) ? price : null });
	}
</script>

<li class={['receipt-line', done && 'receipt-line--done']}>
	{#if done}
		<span class="receipt-line__mark receipt-line__mark--done">
			<Icon name="check" />
			<span class="visually-hidden">Put away.</span>
		</span>
	{:else if entry.asks}
		<button class="receipt-line__mark receipt-line__mark--asks" type="button" onclick={onopen}>
			<span aria-hidden="true">?</span>
			<span class="visually-hidden">{purchase.name}: the app needs an answer</span>
		</button>
	{:else}
		<button class="receipt-line__mark" type="button" onclick={onputaway}>
			<span class="visually-hidden">
				Put away: {purchase.name}{amount ? `, ${amount}` : ''}
			</span>
		</button>
	{/if}

	<button class="receipt-line__text" type="button" onclick={onopen}>
		<span class="receipt-line__name">{purchase.name}</span>
		<span class="receipt-line__amount">{amount}</span>
		{#if detail}
			<span class={['receipt-line__detail', entry.asks && 'receipt-line__detail--asks']}>
				{detail}
			</span>
		{/if}
		<span class="visually-hidden">: {done ? 'correct the item' : 'open the card'}</span>
	</button>

	<input
		class="receipt-line__price"
		type="number"
		inputmode="decimal"
		min="0"
		step="any"
		placeholder="0.00"
		aria-label="Price of {purchase.packages > 1 ? 'one package of ' : ''}{purchase.name}"
		value={priceText}
		oninput={typePrice}
		onblur={() => (typed = null)}
	/>
</li>

<style>
	@keyframes check {
		from {
			scale: 0.3;
		}
	}

	.receipt-line {
		display: grid;
		grid-template-columns: var(--tap) minmax(0, 1fr) 4rem;
		align-items: center;
		gap: var(--space-1);
		min-block-size: var(--tap);
		transition: color 0.3s;

		&.receipt-line--done {
			color: var(--ink-soft);
		}
	}

	/* The ring is small. The button around it has the size that a finger needs. */
	.receipt-line__mark {
		display: grid;
		place-items: center;
		inline-size: var(--tap);
		block-size: var(--tap);
		margin-inline-start: calc(-1 * var(--space-2));
		padding: 0;
		font: inherit;
		font-weight: 700;
		color: inherit;
		background: none;
		border: 0;
		cursor: pointer;

		&::before {
			grid-area: 1 / 1;
			inline-size: 1.6rem;
			block-size: 1.6rem;
			content: '';
			border: 2px solid var(--ink);
			border-radius: 50%;
			transition: scale 0.25s var(--ease-spring);
		}

		/* The check or the question mark lies on the ring. */
		& > :global(*) {
			grid-area: 1 / 1;
		}

		&:active::before {
			scale: 0.85;
		}

		/* Only for a mouse: on a touch screen, a hover stays after the tap. */
		@media (hover: hover) {
			&:hover:not(.receipt-line__mark--done)::before {
				scale: 1.15;
			}
		}

		/* Amber, as a level that is low: the line needs an answer. */
		&.receipt-line__mark--asks::before {
			background: var(--color-low);
			border-color: var(--color-low-strong);
		}

		&.receipt-line__mark--done {
			color: var(--color-on-accent);
			cursor: default;

			&::before {
				background: var(--color-accent-strong);
				border-color: var(--color-accent-strong);
				animation: check 0.35s var(--ease-spring);
			}

			& :global(.icon) {
				inline-size: 1rem;
				block-size: 1rem;
				stroke-width: 3;
			}
		}
	}

	/* The name and the quantity are on one line. The small text is below them. */
	.receipt-line__text {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: baseline;
		gap: 0 var(--space-2);
		min-block-size: var(--tap);
		padding: var(--space-1) 0;
		align-content: center;
		font: inherit;
		color: inherit;
		text-align: start;
		background: none;
		border: 0;
		cursor: pointer;

		/* Only for a mouse: on a touch screen, a hover stays after the tap. */
		@media (hover: hover) {
			&:hover .receipt-line__name {
				text-decoration: underline;
				text-underline-offset: 0.2em;
			}
		}
	}

	.receipt-line__name {
		overflow-wrap: anywhere;
	}

	.receipt-line__amount {
		white-space: nowrap;
	}

	.receipt-line__detail {
		grid-column: 1 / -1;
		font-size: 0.75rem;
		color: var(--ink-soft);

		&.receipt-line__detail--asks {
			font-weight: 700;
			color: var(--color-low-strong);
		}
	}

	/* The price is a field with no box: a broken line below it, as a place to write on paper. */
	.receipt-line__price {
		inline-size: 100%;
		min-block-size: 2.25rem;
		text-align: end;
		padding: 0;
		font: inherit;
		color: inherit;
		background: none;
		border: 0;
		border-block-end: 1px dashed var(--ink-soft);
		border-radius: 0;
		appearance: textfield;

		&::placeholder {
			color: var(--ink-soft);
			opacity: 0.6;
		}

		&::-webkit-inner-spin-button,
		&::-webkit-outer-spin-button {
			margin: 0;
			appearance: none;
		}
	}
</style>
