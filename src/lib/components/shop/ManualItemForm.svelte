<script>
	import { addManualItem } from '$lib/data/shopping';

	/**
	 * Adds an item to the shopping list by hand.
	 * A name that is an ingredient goes into the pantry when it is bought.
	 * @type {{ ingredients: import('$lib/types').Ingredient[] }}
	 */
	let { ingredients } = $props();

	const uid = $props.id();

	/** @param {SubmitEvent & { currentTarget: HTMLFormElement }} event */
	async function submit(event) {
		event.preventDefault();
		const form = event.currentTarget;
		const data = new FormData(form);
		const name = String(data.get('name') ?? '').trim();
		if (!name) return;
		await addManualItem(name, Number(data.get('quantity')) || 0, ingredients);
		form.reset();
	}
</script>

<form class="manual-item" onsubmit={submit}>
	<div class="field">
		<label class="field__label" for="{uid}-name">Item</label>
		<input
			class="field__control"
			id="{uid}-name"
			name="name"
			list="{uid}-names"
			autocomplete="off"
			required
		/>
		<datalist id="{uid}-names">
			{#each ingredients as ingredient (ingredient.id)}
				<option value={ingredient.name}></option>
			{/each}
		</datalist>
	</div>

	<div class="field">
		<label class="field__label" for="{uid}-quantity">Quantity</label>
		<input
			class="field__control"
			id="{uid}-quantity"
			name="quantity"
			type="number"
			inputmode="decimal"
			min="0"
			step="any"
		/>
	</div>

	<button class="button" type="submit">Add</button>
</form>

<style>
	.manual-item {
		display: grid;
		grid-template-columns: 1fr 6rem auto;
		align-items: end;
		gap: var(--space-2);
	}
</style>
