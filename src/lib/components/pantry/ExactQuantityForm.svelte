<script>
	import { setQuantity } from '$lib/data/pantry';
	import { unitLabel } from '$lib/util/format';

	/**
	 * Sets the quantity of one pantry item to an exact number.
	 * @type {{
	 *   item: import('$lib/types').PantryItem,
	 *   ingredient: import('$lib/types').Ingredient,
	 *   ondone?: () => void
	 * }}
	 */
	let { item, ingredient, ondone } = $props();

	const uid = $props.id();

	/** @param {SubmitEvent & { currentTarget: HTMLFormElement }} event */
	async function submit(event) {
		event.preventDefault();
		const quantity = Number(new FormData(event.currentTarget).get('quantity'));
		if (Number.isNaN(quantity)) return;
		await setQuantity(ingredient.id, quantity, 'corrected');
		ondone?.();
	}
</script>

<form class="exact-quantity" onsubmit={submit}>
	<div class="field">
		<label class="field__label" for="{uid}-quantity">
			Exact quantity of {ingredient.name} ({unitLabel(ingredient.unit)})
		</label>
		<input
			class="field__control"
			id="{uid}-quantity"
			name="quantity"
			type="number"
			inputmode="decimal"
			min="0"
			step="any"
			value={item.quantity}
			required
		/>
	</div>
	<button class="button" type="submit">Set</button>
</form>

<style>
	.exact-quantity {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: end;
		gap: var(--space-2);
	}
</style>
