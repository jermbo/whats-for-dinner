<script>
	import { shortfall } from '$lib/data/availability';
	import { formatQuantity } from '$lib/util/format';

	/**
	 * The ingredients of one recipe, with the pantry status of each.
	 * @type {{
	 *   recipe: import('$lib/types').Recipe,
	 *   ingredientsById: Map<string, import('$lib/types').Ingredient>,
	 *   pantryByIngredient: Map<string, import('$lib/types').PantryItem>
	 * }}
	 */
	let { recipe, ingredientsById, pantryByIngredient } = $props();

	const rows = $derived(
		recipe.ingredients.flatMap((row) => {
			const ingredient = ingredientsById.get(row.ingredientId);
			if (!ingredient) return [];
			const short = shortfall(ingredient, row.quantity, pantryByIngredient.get(ingredient.id)) > 0;
			return [{ ingredient, quantity: row.quantity, short }];
		})
	);
</script>

{#if rows.length === 0}
	<p class="muted">
		This is a reference recipe. It has no ingredient list, so it does not update the pantry.
	</p>
{:else}
	<ul class="list">
		{#each rows as row, index (index)}
			<li class="list__item cluster cluster--between">
				<span>
					{row.ingredient.name}
					{#if row.ingredient.tracking === 'quantity'}
						<span class="muted">{formatQuantity(row.quantity, row.ingredient.unit)}</span>
					{/if}
				</span>
				<span class={['badge', !row.short && 'badge--good']}>
					{row.short ? 'Not in pantry' : 'In pantry'}
				</span>
			</li>
		{/each}
	</ul>
{/if}
