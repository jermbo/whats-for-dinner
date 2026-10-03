<script>
	import NewProductForm from './NewProductForm.svelte';

	/**
	 * @typedef {import('$lib/types').Ingredient} Ingredient
	 * @typedef {import('$lib/types').Product} Product
	 */

	const uid = $props.id();

	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state();
	/** @type {Ingredient | undefined} */
	let ingredient = $state.raw();
	/** @type {(product: Product) => void} */
	let done = () => {};
	// A new key gives a new, empty form each time the dialog opens.
	let opened = $state(0);

	/**
	 * Opens the form of a new product for an ingredient: a photo, the package size, and an
	 * optional barcode.
	 * @param {Ingredient} forIngredient
	 * @param {(product: Product) => void} ondone Gets the product, new or known.
	 */
	export function open(forIngredient, ondone) {
		ingredient = forIngredient;
		done = ondone;
		opened += 1;
		dialog?.showModal();
	}

	/** @param {Product} product */
	function saved(product) {
		dialog?.close();
		done(product);
	}
</script>

<dialog bind:this={dialog} aria-labelledby="{uid}-title" onclose={() => (opened += 1)}>
	{#if ingredient}
		<div class="stack">
			<h2 id="{uid}-title">New product: {ingredient.name}</h2>
			{#key opened}
				<NewProductForm {ingredient} onsave={saved} oncancel={() => dialog?.close()} />
			{/key}
		</div>
	{/if}
</dialog>
