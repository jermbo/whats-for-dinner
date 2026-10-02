<script>
	import { changeQuantity } from '$lib/data/pantry';
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
		class="button"
		type="button"
		aria-label="Use {stepText} of {ingredient.name}"
		disabled={item.quantity <= 0}
		onclick={() => changeQuantity(ingredient.id, -step, 'used')}
	>
		−
	</button>
	<output class="stepper__value">{formatQuantity(item.quantity, ingredient.unit)}</output>
	<button
		class="button"
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
		gap: var(--space-2);
	}

	.stepper__value {
		min-inline-size: 4.5rem;
		font-weight: 600;
		text-align: center;
		font-variant-numeric: tabular-nums;
	}
</style>
