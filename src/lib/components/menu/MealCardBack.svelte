<script>
	import RecipeSource from '$lib/components/recipes/RecipeSource.svelte';
	import MealPrep from './MealPrep.svelte';
	import { shortfall } from '$lib/data/availability';
	import { STOCK_STATES, labelOf } from '$lib/data/options';
	import { pantryScale } from '$lib/data/pantry-scale';
	import { splitByTimes } from '$lib/data/step-text';
	import { formatAgo, formatQuantity } from '$lib/util/format';

	/**
	 * The back of a meal card: first what the meal needs before you can cook it, then the rating
	 * and the note from the last time, each ingredient with the stock of the pantry, and the steps. The level bars fill when it is open.
	 * @type {{
	 *   entry: import('$lib/data/menu').MenuEntry,
	 *   kitchen: import('$lib/kitchen.svelte').Kitchen,
	 *   last?: import('$lib/types').CookSession,
	 *   open: boolean,
	 *   onprep: (entry: import('$lib/data/menu').MenuEntry) => unknown
	 * }}
	 */
	let { entry, kitchen, last, open, onprep } = $props();

	const recipe = $derived(entry.recipe);
	const leftover = $derived(entry.item.kind === 'leftover');

	const rows = $derived(
		recipe.ingredients.flatMap((row) => {
			const ingredient = kitchen.ingredientsById.get(row.ingredientId);
			if (!ingredient) return [];

			const item = kitchen.pantryByIngredient.get(ingredient.id);
			const short = shortfall(ingredient, row.quantity, item);
			const scale = item && pantryScale(item, ingredient);
			const counted = ingredient.tracking === 'quantity';

			let amount = formatQuantity(row.quantity, ingredient.unit);
			if (!counted) amount = item && !short ? labelOf(STOCK_STATES, item.state) : 'Out';
			else if (short) amount = `Short ${formatQuantity(short, ingredient.unit)}`;

			return [
				{
					name: ingredient.name,
					amount,
					short: short > 0,
					level: scale?.toFraction(scale.value) ?? 0
				}
			];
		})
	);

	/** The text of each step in parts. A part that is a time, such as "12 minutes", is bold. */
	const steps = $derived(
		recipe.steps.filter((step) => step.text).map((step) => splitByTimes(step.text))
	);
</script>

<div class={['meal-back', open && 'meal-back--open']}>
	{#if !leftover && recipe.prepSteps.length > 0}
		<section class="meal-back__section">
			<h3 class="meal-back__title">
				{entry.state === 'todo'
					? 'Before you cook'
					: entry.state === 'waiting'
						? 'In preparation'
						: 'Preparation'}
			</h3>
			<MealPrep {entry} {onprep} />
		</section>
	{/if}

	<section class="meal-back__section">
		{#if last}
			<p class="meal-back__last">
				<span>Last time: {formatAgo(last.cookedAt)}</span>
				{#if last.rating}
					<span class="meal-back__stars" role="img" aria-label="Rating {last.rating} of 5">
						{'★'.repeat(last.rating)}{'☆'.repeat(5 - last.rating)}
					</span>
				{/if}
			</p>
			{#if last.note}
				<blockquote class="meal-back__note">{last.note}</blockquote>
			{/if}
		{:else}
			<p class="muted">Not cooked yet. This is a new recipe.</p>
		{/if}
	</section>

	<section class="meal-back__section">
		<h3 class="meal-back__title">From the pantry</h3>

		{#if leftover}
			<p class="muted">Leftovers use no ingredients.</p>
		{:else if rows.length === 0}
			<p class="muted">This recipe has no ingredient list.</p>
		{:else}
			<ul class="meal-back__rows">
				{#each rows as row, index (index)}
					<li
						class={['meal-back__row', row.short && 'meal-back__row--short']}
						style:--level={row.level}
						style:--n={index}
					>
						<span>{row.name}</span>
						<span class="meal-back__amount">{row.amount}</span>
						<span class="meal-back__bar" aria-hidden="true"></span>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	{#if steps.length > 0}
		<section class="meal-back__section">
			<h3 class="meal-back__title">Steps</h3>
			<ol class="meal-back__steps">
				{#each steps as parts, index (index)}
					<li>
						{#each parts as part, partIndex (partIndex)}
							{#if part.seconds}<strong>{part.text}</strong>{:else}{part.text}{/if}
						{/each}
					</li>
				{/each}
			</ol>
		</section>
	{/if}

	{#if recipe.source}
		<section class="meal-back__section">
			<RecipeSource source={recipe.source} />
		</section>
	{/if}
</div>

<style>
	.meal-back {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.meal-back__section {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.meal-back__last {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: var(--space-2);
		font-weight: 600;
	}

	.meal-back__stars {
		color: var(--color-low-strong);
		letter-spacing: 0.1em;
	}

	.meal-back__note {
		margin: 0;
		padding: var(--space-3) var(--space-4);
		font-style: italic;
		background: var(--color-notice);
		border-radius: calc(var(--radius) / 2);

		&::before {
			content: '“';
		}

		&::after {
			content: '”';
		}
	}

	.meal-back__title {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.meal-back__rows {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.meal-back__row {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.2rem var(--space-2);
	}

	.meal-back__amount {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	/* The stock in the pantry. It fills, one row after the other, when the back is open. */
	.meal-back__bar {
		grid-column: 1 / -1;
		block-size: 0.35rem;
		background: var(--color-surface-soft);
		border-radius: var(--radius-pill);

		&::before {
			display: block;
			inline-size: calc(var(--level) * 100%);
			block-size: 100%;
			content: '';
			background: var(--color-accent);
			border-radius: inherit;
			transform-origin: left;
			scale: 0 1;
			transition: scale 0.6s var(--ease-out) calc(0.1s + var(--n) * 50ms);
		}
	}

	.meal-back--open .meal-back__bar::before {
		scale: 1 1;
	}

	.meal-back__row--short {
		& .meal-back__amount {
			color: var(--color-danger);
		}

		& .meal-back__bar::before {
			background: var(--color-low-strong);
		}
	}

	/* Each step has its number in a teal circle. */
	.meal-back__steps {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		margin: 0;
		padding: 0;
		list-style: none;
		counter-reset: step;

		& li {
			display: grid;
			grid-template-columns: 2rem 1fr;
			gap: var(--space-3);
			align-items: baseline;
			counter-increment: step;

			&::before {
				display: grid;
				place-items: center;
				inline-size: 2rem;
				block-size: 2rem;
				content: counter(step);
				font-weight: 600;
				color: var(--color-accent-strong);
				background: var(--color-accent-soft);
				border-radius: 50%;
			}
		}
	}
</style>
