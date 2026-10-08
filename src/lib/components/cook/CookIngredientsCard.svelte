<script>
	import { checkIngredient } from '$lib/data/cooking';
	import { shortfall } from '$lib/domain/availability';
	import { pop } from '$lib/motion/transitions';
	import { formatQuantity } from '$lib/util/format';

	/**
	 * The first card of Cook mode: "Get out". It is a checklist of all ingredients with their
	 * quantities. The owner taps each one when it is on the counter, and finds what is gone
	 * before the pan is hot. The cook session keeps the checks.
	 * On a wide card, the title is the left half and the list is the right half.
	 * @type {{
	 *   recipe: import('$lib/types').Recipe,
	 *   session: import('$lib/types').CookSession,
	 *   ingredientsById: Map<string, import('$lib/types').Ingredient>,
	 *   pantryByIngredient: Map<string, import('$lib/types').PantryItem>
	 * }}
	 */
	let { recipe, session, ingredientsById, pantryByIngredient } = $props();

	const uid = $props.id();

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

	const out = $derived(rows.filter((row) => row.checked).length);
</script>

<section class="cook-ingredients" aria-labelledby="{uid}-title">
	<div class="cook-ingredients__head">
		<div>
			<p class="label">{recipe.name}</p>
			<h2 class="cook-ingredients__title" id="{uid}-title">Get out</h2>
		</div>
		<p class="cook-ingredients__count" aria-live="polite">
			<span class="count">
				{#key out}<span class="cook-ingredients__out" in:pop>{out}</span>{/key}<span
					class="count__total"
					><span aria-hidden="true">/</span><span class="visually-hidden">of</span
					>{rows.length}</span
				>
			</span>
			<span class="cook-ingredients__where">on the counter</span>
		</p>
	</div>

	<ul class="cook-ingredients__list">
		{#each rows as row, index (index)}
			<li>
				<label class={['cook-ingredients__row', row.checked && 'cook-ingredients__row--checked']}>
					<input
						class="cook-ingredients__box"
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
		flex: 1;
		flex-direction: column;
		gap: var(--space-3);
	}

	.cook-ingredients__head {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: var(--space-3);
		padding-block-end: var(--space-3);
		border-block-end: var(--rule-8) solid var(--ink);
	}

	.cook-ingredients__title {
		margin-block-start: var(--space-1);
		font-size: clamp(3.25rem, 20cqi, 5rem);
		line-height: 0.86;
	}

	.cook-ingredients__count {
		display: grid;
		justify-items: end;
		gap: var(--space-1);
	}

	/* A transform needs a box. */
	.cook-ingredients__out {
		display: inline-block;
		transform-origin: bottom center;
	}

	.cook-ingredients__where {
		font-size: 0.8125rem;
		font-weight: 700;
		white-space: nowrap;
		color: var(--ink-soft);
	}

	.cook-ingredients__list {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* The full row is the target: a knuckle is sufficient. */
	.cook-ingredients__row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-block-size: 3.75rem;
		padding-block: var(--space-2);
		font-size: 1.35rem;
		border-block-end: var(--rule-1) solid var(--ink);
		cursor: pointer;
		transition: color 0.25s;

		&:has(:focus-visible) {
			outline: var(--focus-ring);
			outline-offset: 2px;
		}
	}

	/* A square box. Checked: ink, with a white check that the clip path cuts. */
	.cook-ingredients__box {
		position: relative;
		flex: none;
		inline-size: 2rem;
		block-size: 2rem;
		margin: 0;
		background: var(--card);
		border: 2px solid var(--ink);
		border-radius: var(--radius-sticker);
		appearance: none;
		cursor: pointer;
		transition: background-color 0.15s;

		&:checked {
			background: var(--ink);
		}

		&:checked::after {
			position: absolute;
			inset: 22%;
			content: '';
			background: var(--card);
			clip-path: polygon(14% 44%, 0 65%, 44% 100%, 100% 18%, 82% 4%, 40% 66%);
		}

		/* The row shows the focus. */
		&:focus-visible {
			outline: none;
			box-shadow: none;
		}
	}

	.cook-ingredients__name {
		flex: 1;
		font-weight: 600;
	}

	.cook-ingredients__amount {
		font-family: var(--font-display);
		font-size: 1.5rem;
		line-height: 1;
		white-space: nowrap;
	}

	/* A row that is on the counter goes quiet: the rows to get stay ink. */
	.cook-ingredients__row--checked {
		color: var(--hairline);
	}

	/* A wide card has two halves: the title at the left, and the list at the right. */
	@container cook-card (min-width: 48rem) {
		.cook-ingredients {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: 0;
		}

		.cook-ingredients__head {
			flex-direction: column;
			align-items: start;
			padding: var(--space-4) var(--space-8) var(--space-4) var(--space-4);
			border-block-end: 0;
			border-inline-end: var(--rule-4) solid var(--ink);
		}

		.cook-ingredients__title {
			font-size: clamp(5rem, 13cqi, 11rem);
		}

		.cook-ingredients__count {
			justify-items: start;

			& .count {
				font-size: 5rem;
			}
		}

		.cook-ingredients__list {
			padding: var(--space-4) var(--space-4) var(--space-4) var(--space-8);
			overflow-y: auto;
		}
	}
</style>
