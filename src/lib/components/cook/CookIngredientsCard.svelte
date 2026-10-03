<script>
	import { shortfall } from '$lib/data/availability';
	import { checkIngredient } from '$lib/data/cooking';
	import { formatQuantity } from '$lib/util/format';

	/**
	 * The first card of Cook mode: a checklist of all ingredients with their quantities. The
	 * owner taps each one when it is on the counter, and finds what is gone before the pan is
	 * hot. The cook session keeps the checks.
	 * @type {{
	 *   recipe: import('$lib/types').Recipe,
	 *   session: import('$lib/types').CookSession,
	 *   ingredientsById: Map<string, import('$lib/types').Ingredient>,
	 *   pantryByIngredient: Map<string, import('$lib/types').PantryItem>
	 * }}
	 */
	let { recipe, session, ingredientsById, pantryByIngredient } = $props();

	const rows = $derived(
		recipe.ingredients.flatMap((row) => {
			const ingredient = ingredientsById.get(row.ingredientId);
			if (!ingredient) return [];
			const short = shortfall(ingredient, row.quantity, pantryByIngredient.get(ingredient.id));
			return [
				{
					ingredient,
					amount:
						ingredient.tracking === 'quantity' ? formatQuantity(row.quantity, ingredient.unit) : '',
					short: short > 0,
					checked: session.checked.includes(ingredient.id)
				}
			];
		})
	);

	const left = $derived(rows.filter((row) => !row.checked).length);
</script>

<section class="cook-ingredients" aria-labelledby="cook-ingredients-title">
	<div class="cook-ingredients__head">
		<h2 id="cook-ingredients-title">Get the ingredients</h2>
		<p class="muted" aria-live="polite">{left === 0 ? 'All on the counter' : `${left} to get`}</p>
	</div>

	<ul class="cook-ingredients__list">
		{#each rows as row, index (index)}
			<li>
				<label class={['cook-ingredients__row', row.checked && 'cook-ingredients__row--checked']}>
					<input
						type="checkbox"
						checked={row.checked}
						onchange={(event) =>
							checkIngredient(session.id, row.ingredient.id, event.currentTarget.checked)}
					/>
					<span class="cook-ingredients__name">{row.ingredient.name}</span>
					{#if row.short}
						<span class="badge">Not in pantry</span>
					{/if}
					<span class="cook-ingredients__amount">{row.amount}</span>
				</label>
			</li>
		{/each}
	</ul>
</section>

<style>
	.cook-ingredients {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.cook-ingredients__head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-2);
	}

	.cook-ingredients__list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* The full row is the target: a knuckle is sufficient. */
	.cook-ingredients__row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-block-size: 3.5rem;
		padding: var(--space-2) var(--space-4);
		font-size: 1.15rem;
		background: var(--color-surface-soft);
		border-radius: 1rem;
		cursor: pointer;
		transition:
			background-color 0.2s,
			color 0.2s;

		&:has(:focus-visible) {
			outline: 3px solid var(--color-accent-strong);
			outline-offset: 2px;
		}
	}

	.cook-ingredients__name {
		flex: 1;
		font-weight: 500;
	}

	.cook-ingredients__amount {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.cook-ingredients__row--checked {
		color: var(--color-muted);
		background: var(--color-accent-soft);

		& .cook-ingredients__name {
			text-decoration: line-through;
		}
	}
</style>
