<script>
	import { findIngredient, parseLine } from '$lib/data/ingredient-line';

	/** @typedef {import('$lib/types').Ingredient} Ingredient */

	/**
	 * One line that adds an ingredient to the recipe: a name and a number, such as "rice 300".
	 * The first letters of a name are sufficient: the field shows the ingredients that the app
	 * knows. Enter adds the row, and the cursor stays in the field for the next ingredient.
	 * A name that the app does not know goes to "onnew", which makes the ingredient.
	 * @type {{
	 *   ingredients: Ingredient[],
	 *   onadd: (ingredient: Ingredient, quantity: number) => void,
	 *   onnew: (name: string, quantity: number) => void
	 * }}
	 */
	let { ingredients, onadd, onnew } = $props();

	const uid = $props.id();

	let line = $state('');
	let hint = $state('');

	/** @param {SubmitEvent} event */
	function submit(event) {
		event.preventDefault();
		const { name, quantity } = parseLine(line);
		if (!name) return;

		const found = findIngredient(name, ingredients);
		if (found.many) {
			hint = `More than one ingredient starts with "${name}". Type more letters.`;
			return;
		}

		hint = '';
		line = '';
		if (found.ingredient) onadd(found.ingredient, quantity);
		else onnew(name, quantity);
	}
</script>

<form class="ingredient-line" onsubmit={submit}>
	<label class="visually-hidden" for="{uid}-line">Add an ingredient: name and quantity</label>
	<input
		class="ingredient-line__field"
		id="{uid}-line"
		list="{uid}-names"
		placeholder="Name and quantity: rice 300"
		autocomplete="off"
		autocapitalize="none"
		enterkeyhint="done"
		aria-describedby={hint ? `${uid}-hint` : undefined}
		bind:value={line}
	/>
	<datalist id="{uid}-names">
		{#each ingredients as ingredient (ingredient.id)}
			<option value={ingredient.name}></option>
		{/each}
	</datalist>
	<button class="button button--strong" type="submit">Add</button>

	{#if hint}
		<p class="muted ingredient-line__hint" id="{uid}-hint" role="status">{hint}</p>
	{/if}
</form>

<style>
	.ingredient-line {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: var(--space-2);
	}

	.ingredient-line__field {
		min-block-size: var(--tap);
		padding: var(--space-2) var(--space-5);
		background: var(--card);
		border: 2px solid var(--ink);
		border-radius: var(--radius-control);

		&::placeholder {
			color: var(--ink-soft);
		}
	}

	.ingredient-line__hint {
		grid-column: 1 / -1;
	}
</style>
