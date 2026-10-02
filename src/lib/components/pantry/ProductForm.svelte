<script>
	import IngredientDialog from '$lib/components/ingredients/IngredientDialog.svelte';
	import { saveProduct } from '$lib/data/products';
	import { sortByName } from '$lib/util/collections';
	import { unitLabel } from '$lib/util/format';

	/** @typedef {import('$lib/types').Product} Product */

	/**
	 * Links a scanned product to an ingredient. The owner does this one time for each product.
	 * @type {{
	 *   product: Omit<Product, 'updatedAt'>,
	 *   ingredients: import('$lib/types').Ingredient[],
	 *   onsave: (product: Omit<Product, 'updatedAt'>) => void,
	 *   oncancel: () => void
	 * }}
	 */
	let { product, ingredients, onsave, oncancel } = $props();

	const uid = $props.id();
	const initial = () => ({ ...product });
	let form = $state(initial());

	/** @type {IngredientDialog | undefined} */
	let dialog = $state();

	const sorted = $derived(sortByName(ingredients));
	const selected = $derived(ingredients.find((i) => i.id === form.ingredientId));

	/** @param {SubmitEvent} event */
	async function submit(event) {
		event.preventDefault();
		const saved = { ...$state.snapshot(form), quantity: Number(form.quantity) || 0 };
		await saveProduct(saved);
		onsave(saved);
	}
</script>

<form class="stack" onsubmit={submit}>
	<p class="muted">Barcode {form.barcode}</p>

	<div class="field">
		<label class="field__label" for="{uid}-name">Product name</label>
		<input class="field__control" id="{uid}-name" bind:value={form.name} required />
	</div>

	<div class="field">
		<label class="field__label" for="{uid}-ingredient">This product is the ingredient</label>
		<select class="field__control" id="{uid}-ingredient" bind:value={form.ingredientId} required>
			<option value="">Select an ingredient</option>
			{#each sorted as ingredient (ingredient.id)}
				<option value={ingredient.id}>{ingredient.name}</option>
			{/each}
		</select>
	</div>

	<div>
		<button class="button" type="button" onclick={() => dialog?.open()}>New ingredient</button>
	</div>

	{#if selected?.tracking === 'quantity'}
		<div class="field field--narrow">
			<label class="field__label" for="{uid}-quantity">
				Package size ({unitLabel(selected.unit)})
			</label>
			<input
				class="field__control"
				id="{uid}-quantity"
				type="number"
				inputmode="decimal"
				min="0"
				step="any"
				bind:value={form.quantity}
				required
			/>
		</div>
	{/if}

	<div class="cluster">
		<button class="button button--primary" type="submit">Save and add to the pantry</button>
		<button class="button" type="button" onclick={oncancel}>Cancel</button>
	</div>
</form>

<IngredientDialog bind:this={dialog} onsave={(ingredient) => (form.ingredientId = ingredient.id)} />
