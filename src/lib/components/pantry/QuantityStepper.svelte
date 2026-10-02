<script>
	import { changeQuantity } from '$lib/data/pantry';
	import { pop } from '$lib/motion/transitions';
	import { formatQuantity, stepFor } from '$lib/util/format';

	/**
	 * Plus and minus buttons for the quantity of one pantry item.
	 * @type {{ item: import('$lib/types').PantryItem, ingredient: import('$lib/types').Ingredient }}
	 */
	let { item, ingredient } = $props();

	const step = $derived(stepFor(ingredient.unit));
	const stepText = $derived(formatQuantity(step, ingredient.unit));
</script>

<div class="stepper">
	<button
		class="button button--round"
		type="button"
		aria-label="Use {stepText} of {ingredient.name}"
		disabled={item.quantity <= 0}
		onclick={() => changeQuantity(ingredient.id, -step, 'used')}
	>
		−
	</button>
	<output class="stepper__value">
		{#key item.quantity}
			<span class="stepper__number" in:pop>{formatQuantity(item.quantity, ingredient.unit)}</span>
		{/key}
	</output>
	<button
		class="button button--round"
		type="button"
		aria-label="Add {stepText} of {ingredient.name}"
		onclick={() => changeQuantity(ingredient.id, step, 'corrected')}
	>
		+
	</button>
</div>

<style>
	.stepper {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1);
		background: var(--color-surface-soft);
		border-radius: var(--radius-pill);
	}

	.stepper__value {
		min-inline-size: 4.5rem;
		font-weight: 600;
		text-align: center;
		font-variant-numeric: tabular-nums;
	}

	.stepper__number {
		display: inline-block;
	}

	.stepper .button {
		inline-size: 2.5rem;
		min-inline-size: 2.5rem;
		min-block-size: 2.5rem;
		color: var(--color-text);
		border-color: transparent;
	}
</style>
