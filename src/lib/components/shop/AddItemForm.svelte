<script>
	import { addManualItem } from '$lib/data/shopping';

	/**
	 * Adds an item that no meal needs, such as soap. It has one text field.
	 * A name that is an ingredient goes into the pantry when the owner puts it away.
	 * @type {{ ingredients: import('$lib/types').Ingredient[] }}
	 */
	let { ingredients } = $props();

	const uid = $props.id();

	/** @param {SubmitEvent & { currentTarget: HTMLFormElement }} event */
	async function submit(event) {
		event.preventDefault();
		const form = event.currentTarget;
		const name = String(new FormData(form).get('name') ?? '').trim();
		if (!name) return;
		await addManualItem(name, ingredients);
		form.reset();
	}
</script>

<form class="add-item" onsubmit={submit}>
	<div class="field">
		<label class="field__label" for="{uid}-name">Add an item</label>
		<input
			class="field__control"
			id="{uid}-name"
			name="name"
			list="{uid}-names"
			autocomplete="off"
			enterkeyhint="done"
			required
		/>
		<datalist id="{uid}-names">
			{#each ingredients as ingredient (ingredient.id)}
				<option value={ingredient.name}></option>
			{/each}
		</datalist>
	</div>

	<button class="button" type="submit">Add</button>
</form>

<style>
	.add-item {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: end;
		gap: var(--space-2);
	}
</style>
