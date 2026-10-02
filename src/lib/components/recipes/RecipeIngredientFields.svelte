<script>
	import { indexBy } from '$lib/util/collections';
	import { unitLabel } from '$lib/util/format';

	/**
	 * The ingredient rows of the recipe form.
	 * @type {{
	 *   rows: import('$lib/types').RecipeIngredient[],
	 *   ingredients: import('$lib/types').Ingredient[],
	 *   onnew: () => void
	 * }}
	 */
	let { rows = $bindable(), ingredients, onnew } = $props();

	const uid = $props.id();
	const byId = $derived(indexBy(ingredients, 'id'));

	/** @param {string} ingredientId */
	function unitOf(ingredientId) {
		const ingredient = byId.get(ingredientId);
		if (!ingredient) return '';
		return ingredient.tracking === 'state' ? 'not counted' : unitLabel(ingredient.unit);
	}
</script>

<fieldset class="fieldset">
	<legend class="fieldset__legend">Ingredients</legend>

	<div class="stack stack--tight">
		<p class="muted">
			Leave this list empty for a reference recipe. A reference recipe does not update the pantry.
		</p>

		{#each rows as row, index (index)}
			<div class="ingredient-row">
				<div class="field ingredient-row__name">
					<label class="visually-hidden" for="{uid}-name-{index}">Ingredient {index + 1}</label>
					<select class="field__control" id="{uid}-name-{index}" bind:value={row.ingredientId}>
						<option value="">Select an ingredient</option>
						{#each ingredients as ingredient (ingredient.id)}
							<option value={ingredient.id}>{ingredient.name}</option>
						{/each}
					</select>
				</div>

				<div class="field ingredient-row__quantity">
					<label class="visually-hidden" for="{uid}-quantity-{index}">
						Quantity of ingredient {index + 1}
					</label>
					<input
						class="field__control"
						id="{uid}-quantity-{index}"
						type="number"
						inputmode="decimal"
						min="0"
						step="any"
						bind:value={row.quantity}
					/>
				</div>

				<span class="ingredient-row__unit">{unitOf(row.ingredientId)}</span>

				<button
					class="button"
					type="button"
					aria-label="Remove ingredient {index + 1}"
					onclick={() => rows.splice(index, 1)}
				>
					Remove
				</button>
			</div>
		{/each}

		<div class="cluster">
			<button
				class="button"
				type="button"
				onclick={() => rows.push({ ingredientId: '', quantity: 0 })}
			>
				Add ingredient row
			</button>
			<button class="button" type="button" onclick={onnew}>New ingredient</button>
		</div>
	</div>
</fieldset>

<style>
	.ingredient-row {
		display: grid;
		grid-template-columns: 1fr 5.5rem;
		grid-template-areas:
			'name name'
			'quantity unit'
			'remove remove';
		align-items: center;
		gap: var(--space-2);
		padding-block-end: var(--space-3);
		border-block-end: 1px solid var(--color-border);

		@media (min-width: 34rem) {
			grid-template-columns: 1fr 6rem 5.5rem auto;
			grid-template-areas: 'name quantity unit remove';
			padding-block-end: 0;
			border-block-end: 0;
		}
	}

	.ingredient-row__name {
		grid-area: name;
	}

	.ingredient-row__quantity {
		grid-area: quantity;
	}

	.ingredient-row__unit {
		grid-area: unit;
		color: var(--color-muted);
	}

	.ingredient-row > .button {
		grid-area: remove;
	}
</style>
