<script>
	import { saveIngredient } from '$lib/data/ingredients';
	import { CATEGORIES, TRACKING, UNITS } from '$lib/data/options';

	/** @typedef {import('$lib/types').Ingredient} Ingredient */

	/**
	 * @type {{ ingredient: Ingredient, onsave: (ingredient: Ingredient) => void, oncancel?: () => void }}
	 */
	let { ingredient, onsave, oncancel } = $props();

	const uid = $props.id();
	const initial = () => ({ ...ingredient });
	let form = $state(initial());

	/** @param {SubmitEvent} event */
	async function submit(event) {
		event.preventDefault();
		onsave(await saveIngredient($state.snapshot(form)));
	}
</script>

<form class="stack" onsubmit={submit}>
	<div class="field">
		<label class="field__label" for="{uid}-name">Name</label>
		<input
			class="field__control"
			id="{uid}-name"
			bind:value={form.name}
			required
			autocomplete="off"
		/>
	</div>

	<div class="field">
		<label class="field__label" for="{uid}-unit">Unit</label>
		<select class="field__control" id="{uid}-unit" bind:value={form.unit}>
			{#each UNITS as unit (unit.value)}
				<option value={unit.value}>{unit.label}</option>
			{/each}
		</select>
		<span class="field__hint">Recipes and the pantry use this one unit.</span>
	</div>

	<div class="field">
		<label class="field__label" for="{uid}-tracking">Pantry tracking</label>
		<select class="field__control" id="{uid}-tracking" bind:value={form.tracking}>
			{#each TRACKING as tracking (tracking.value)}
				<option value={tracking.value}>{tracking.label}</option>
			{/each}
		</select>
		<span class="field__hint">Use "Have, low, or out" for staples such as salt and oil.</span>
	</div>

	<div class="field">
		<label class="field__label" for="{uid}-category">Store category</label>
		<input
			class="field__control"
			id="{uid}-category"
			list="{uid}-categories"
			bind:value={form.category}
			autocomplete="off"
		/>
		<datalist id="{uid}-categories">
			{#each CATEGORIES as category (category)}
				<option value={category}></option>
			{/each}
		</datalist>
	</div>

	<label class="field field--inline">
		<input type="checkbox" bind:checked={form.perishable} />
		<span>Perishable (spoils fast)</span>
	</label>

	<div class="cluster">
		<button class="button button--primary" type="submit">Save ingredient</button>
		{#if oncancel}
			<button class="button" type="button" onclick={oncancel}>Cancel</button>
		{/if}
	</div>
</form>
