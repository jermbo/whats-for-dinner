<script>
	import Icon from '$lib/components/ui/Icon.svelte';
	import { indexBy } from '$lib/util/collections';
	import { unitLabel } from '$lib/util/format';
	import IngredientLine from './IngredientLine.svelte';

	/** @typedef {import('$lib/types').Ingredient} Ingredient */

	/**
	 * The ingredients of the recipe form. One line at the top adds an ingredient. Each row
	 * below it has the name, the quantity, and the unit of the ingredient.
	 * @type {{
	 *   rows: import('$lib/types').RecipeIngredient[],
	 *   ingredients: Ingredient[],
	 *   onnew: (name: string, quantity: number) => void
	 * }}
	 */
	let { rows = $bindable(), ingredients, onnew } = $props();

	const uid = $props.id();
	const byId = $derived(indexBy(ingredients, 'id'));

	/**
	 * Adds a row. An ingredient is in a recipe one time: a second line for the same ingredient
	 * changes the quantity of its row.
	 * @param {Ingredient} ingredient
	 * @param {number} quantity
	 */
	export function add(ingredient, quantity) {
		const row = rows.find((item) => item.ingredientId === ingredient.id);
		if (row) row.quantity = quantity || row.quantity;
		else rows.push({ ingredientId: ingredient.id, quantity });
	}
</script>

<fieldset class="fieldset ingredient-fields">
	<legend class="fieldset__legend">Ingredients</legend>

	<div class="stack stack--tight">
		<IngredientLine {ingredients} onadd={add} {onnew} />

		{#if rows.length === 0}
			<p class="muted">A recipe with no ingredients does not update the pantry.</p>
		{:else}
			<ul class="ingredient-fields__rows">
				{#each rows as row, index (index)}
					{@const ingredient = byId.get(row.ingredientId)}
					{@const name = ingredient?.name ?? 'An ingredient that is not on this device'}
					<li class="ingredient-row">
						{#if ingredient?.tracking === 'state'}
							<span class="ingredient-row__name">{name}</span>
							<span class="ingredient-row__unit ingredient-row__unit--wide">Not counted</span>
						{:else}
							<label class="ingredient-row__name" for="{uid}-quantity-{index}">{name}</label>
							<input
								class="ingredient-row__quantity"
								id="{uid}-quantity-{index}"
								type="number"
								inputmode="decimal"
								min="0"
								step="any"
								bind:value={row.quantity}
							/>
							<span class="ingredient-row__unit"
								>{ingredient ? unitLabel(ingredient.unit) : ''}</span
							>
						{/if}

						<button
							class="ingredient-row__remove"
							type="button"
							onclick={() => rows.splice(index, 1)}
						>
							<Icon name="close" />
							<span class="visually-hidden">Remove {name}</span>
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</fieldset>

<style>
	.ingredient-fields__rows {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* One line for each ingredient: name, quantity, unit, and the remove button. */
	.ingredient-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 5rem 2.75rem var(--tap);
		align-items: center;
		gap: var(--space-2);
		padding-block: var(--space-1);

		& + .ingredient-row {
			border-block-start: var(--rule-1) solid var(--hairline);
		}
	}

	.ingredient-row__name {
		font-weight: 500;
		overflow-wrap: anywhere;
	}

	.ingredient-row__quantity {
		inline-size: 100%;
		min-block-size: 2.5rem;
		padding: var(--space-1) var(--space-3);
		text-align: end;
		font-variant-numeric: tabular-nums;
		background: var(--card);
		border: 2px solid var(--ink);
		border-radius: var(--radius-control);
	}

	.ingredient-row__unit {
		color: var(--ink-soft);
		font-size: 0.925rem;

		&.ingredient-row__unit--wide {
			grid-column: span 2;
			text-align: end;
		}
	}

	.ingredient-row__remove {
		display: grid;
		place-items: center;
		inline-size: var(--tap);
		block-size: var(--tap);
		padding: 0;
		color: var(--ink-soft);
		background: none;
		border: 0;
		border-radius: var(--radius-control);
		cursor: pointer;

		& :global(.icon) {
			inline-size: 1.25rem;
			block-size: 1.25rem;
		}

		@media (hover: hover) {
			&:hover {
				color: var(--tomato);
				background: var(--paper-deep);
			}
		}
	}
</style>
