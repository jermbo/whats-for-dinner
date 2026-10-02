<script>
	import { blankIngredient } from '$lib/data/ingredients';
	import IngredientForm from './IngredientForm.svelte';

	/** @typedef {import('$lib/types').Ingredient} Ingredient */

	/**
	 * @type {{ onsave?: (ingredient: Ingredient) => void }}
	 */
	let { onsave } = $props();

	const uid = $props.id();

	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state();
	let ingredient = $state.raw(blankIngredient());
	// A new key gives a new, empty form each time the dialog opens.
	let opened = $state(0);

	/** @param {Ingredient} [value] */
	export function open(value = blankIngredient()) {
		ingredient = value;
		opened += 1;
		dialog?.showModal();
	}

	/** @param {Ingredient} saved */
	function save(saved) {
		dialog?.close();
		onsave?.(saved);
	}
</script>

<dialog bind:this={dialog} aria-labelledby="{uid}-title">
	<div class="stack">
		<h2 id="{uid}-title">{ingredient.id ? 'Edit ingredient' : 'New ingredient'}</h2>
		{#key opened}
			<IngredientForm {ingredient} onsave={save} oncancel={() => dialog?.close()} />
		{/key}
	</div>
</dialog>
