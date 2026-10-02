<script>
	import IngredientDialog from '$lib/components/ingredients/IngredientDialog.svelte';
	import { stock } from '$lib/data/pantry';
	import { status } from '$lib/status.svelte';
	import { sortByName } from '$lib/util/collections';
	import { unitLabel } from '$lib/util/format';

	/**
	 * Adds an item to the pantry by hand.
	 * @type {{ ingredients: import('$lib/types').Ingredient[] }}
	 */
	let { ingredients } = $props();

	const uid = $props.id();

	let ingredientId = $state('');
	/** @type {number | null} */
	let quantity = $state(null);
	/** @type {IngredientDialog | undefined} */
	let dialog = $state();

	const sorted = $derived(sortByName(ingredients));
	const selected = $derived(ingredients.find((ingredient) => ingredient.id === ingredientId));

	/** @param {SubmitEvent} event */
	async function submit(event) {
		event.preventDefault();
		if (!selected) return;
		await stock(selected, quantity ?? 0, 'corrected');
		status.say(`${selected.name} is in the pantry.`);
		ingredientId = '';
		quantity = null;
	}
</script>

<form class="stack" onsubmit={submit}>
	<div class="field">
		<label class="field__label" for="{uid}-ingredient">Ingredient</label>
		<select class="field__control" id="{uid}-ingredient" bind:value={ingredientId} required>
			<option value="">Select an ingredient</option>
			{#each sorted as ingredient (ingredient.id)}
				<option value={ingredient.id}>{ingredient.name}</option>
			{/each}
		</select>
	</div>

	{#if selected?.tracking === 'quantity'}
		<div class="field field--narrow">
			<label class="field__label" for="{uid}-quantity">
				Quantity ({unitLabel(selected.unit)})
			</label>
			<input
				class="field__control"
				id="{uid}-quantity"
				type="number"
				inputmode="decimal"
				min="0"
				step="any"
				bind:value={quantity}
				required
			/>
		</div>
	{/if}

	<div class="cluster">
		<button class="button button--primary" type="submit">Add to the pantry</button>
		<button class="button" type="button" onclick={() => dialog?.open()}>New ingredient</button>
	</div>
</form>

<IngredientDialog bind:this={dialog} onsave={(ingredient) => (ingredientId = ingredient.id)} />
