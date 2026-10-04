<script>
	import { unitLabel } from '$lib/util/format';

	/** One tap on minus or plus changes a weight or a volume by this number. A count: by one. */
	const STEP = 50;

	/**
	 * The quantity of one item, as the largest text of its card, with minus and plus. It is
	 * what the owner confirms. The field has the name "quantity" for the form around it.
	 * @type {{
	 *   name: string,
	 *   unit: import('$lib/types').Unit,
	 *   quantity: number,
	 *   onchange: (value: number) => void
	 * }}
	 *   name: the name of the item, for screen readers. onchange: gets the new quantity. It is
	 *   not a number when the owner emptied the field.
	 */
	let { name, unit, quantity, onchange } = $props();

	const step = $derived(unit === 'count' ? 1 : STEP);
</script>

<div class="quantity-stepper">
	<button class="button button--round" type="button" onclick={() => onchange(quantity - step)}>
		<span aria-hidden="true">−</span>
		<span class="visually-hidden">Less</span>
	</button>

	<label class="quantity-stepper__number">
		<span class="visually-hidden">
			Quantity of {name} in {unitLabel(unit)}
		</span>
		<input
			class="quantity-stepper__input"
			name="quantity"
			type="number"
			inputmode="decimal"
			min="0"
			step="any"
			required
			value={quantity || ''}
			onchange={(event) => onchange(event.currentTarget.valueAsNumber)}
		/>
		{#if unit !== 'count'}
			<span class="quantity-stepper__unit" aria-hidden="true">{unitLabel(unit)}</span>
		{/if}
	</label>

	<button class="button button--round" type="button" onclick={() => onchange(quantity + step)}>
		<span aria-hidden="true">+</span>
		<span class="visually-hidden">More</span>
	</button>
</div>

<style>
	.quantity-stepper {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
	}

	.quantity-stepper__number {
		display: flex;
		align-items: baseline;
		gap: var(--space-1);
		font-family: var(--font-display);
		font-weight: 400;
	}

	/* The field is as wide as its number, where the browser can do that. */
	.quantity-stepper__input {
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

	.quantity-stepper__unit {
		font-size: 1.35rem;
		color: var(--ink-soft);
	}
</style>
