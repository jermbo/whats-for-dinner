<script>
	import RecipeSource from '$lib/components/recipes/RecipeSource.svelte';
	import { shortfall } from '$lib/domain/availability';
	import { STOCK_STATES, labelOf } from '$lib/domain/options';
	import { pantryScale } from '$lib/domain/pantry-scale';
	import { splitByTimes } from '$lib/domain/step-text';
	import { formatAgo, formatQuantity } from '$lib/util/format';
	import MealPrep from './MealPrep.svelte';

	/**
	 * The back of a meal card: first what the meal needs before you can cook it, then the rating
	 * and the note from the last time, each ingredient with the stock of the pantry, and the steps.
	 * It is a panel of facts: a white face, a frame of ink, and rules of 1, 4, and 8 px.
	 * The level bars fill when it is open.
	 * @type {{
	 *   entry: import('$lib/domain/menu').MenuEntry,
	 *   kitchen: import('$lib/state/kitchen.svelte').Kitchen,
	 *   last?: import('$lib/types').CookSession,
	 *   open: boolean,
	 *   onprep: (entry: import('$lib/domain/menu').MenuEntry) => unknown
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
	<h3 class="meal-back__heading">Cook facts</h3>

	<!-- A wide panel puts the pantry at the left and the steps at the right. -->
	<div class="meal-back__col">
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
	</div>

	<div class="meal-back__col">
		{#if steps.length > 0}
			<section class="meal-back__section">
				<h3 class="meal-back__title">Steps</h3>
				<ol class="meal-back__steps">
					{#each steps as parts, index (index)}
						<li>
							<span>
								{#each parts as part, partIndex (partIndex)}
									{#if part.seconds}<strong>{part.text}</strong>{:else}{part.text}{/if}
								{/each}
							</span>
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
</div>

<style>
	.meal-back {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding: var(--space-4);
		background: var(--card);
		border: 2px solid var(--ink);
	}

	/* The two columns of a wide panel. In a narrow panel, they are one column. */
	.meal-back__col {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		min-inline-size: 0;

		/* A column with nothing in it takes no space. */
		&:empty {
			display: none;
		}
	}

	@container facts (min-width: 34rem) {
		.meal-back {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			align-items: start;
			column-gap: var(--space-6);
		}

		.meal-back__heading {
			grid-column: 1 / -1;
		}

		/* The steps are at the top of their own column. */
		.meal-back__col > .meal-back__section:first-child {
			padding-block-start: 0;
			border-block-start: 0;
		}
	}

	.meal-back__heading {
		padding-block-end: var(--space-2);
		font-size: 1.75rem;
		border-block-end: var(--rule-8) solid var(--ink);
	}

	.meal-back__section {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding-block-start: var(--space-3);
		border-block-start: var(--rule-1) solid var(--ink);

		/* The first section follows the heavy rule of the heading. */
		.meal-back__col:first-of-type > &:first-child {
			padding-block-start: 0;
			border-block-start: 0;
		}
	}

	.meal-back__last {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: var(--space-2);
		font-size: 0.875rem;
		font-weight: 700;
	}

	.meal-back__stars {
		letter-spacing: 0.1em;
	}

	.meal-back__note {
		margin: 0;
		font-size: 0.875rem;
		font-style: italic;

		&::before {
			content: '“';
		}

		&::after {
			content: '”';
		}
	}

	.meal-back__title {
		font-family: var(--font-body);
		font-size: 0.6875rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		line-height: 1.25;
	}

	.meal-back__rows {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.meal-back__row {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.15rem var(--space-2);
		font-size: 0.8125rem;
		font-weight: 500;
	}

	.meal-back__amount {
		font-weight: 800;
		font-variant-numeric: tabular-nums;
	}

	/* The stock in the pantry. It fills, one row after the other, when the back is open. */
	.meal-back__bar {
		grid-column: 1 / -1;
		block-size: 0.5rem;
		background: var(--paper-deep);

		&::before {
			display: block;
			inline-size: calc(var(--level) * 100%);
			block-size: 100%;
			content: '';
			background: var(--ink);
			transform-origin: left;
			scale: 0 1;
			transition: scale 0.6s var(--ease-out) calc(0.1s + var(--n) * 50ms);
		}
	}

	.meal-back--open .meal-back__bar::before {
		scale: 1 1;
	}

	/* A level that is not enough: amber on the bar, and tomato on the words. */
	.meal-back__row--short {
		& .meal-back__amount {
			color: var(--tomato-text);
		}

		& .meal-back__bar::before {
			background: var(--amber);
		}
	}

	/* Each step has its number in Anton. */
	.meal-back__steps {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
		counter-reset: step;

		& li {
			display: grid;
			grid-template-columns: 1.25rem 1fr;
			gap: var(--space-2);
			align-items: baseline;
			font-size: 0.875rem;
			counter-increment: step;

			&::before {
				content: counter(step);
				font-family: var(--font-display);
				font-size: 1.125rem;
				line-height: 1;
			}
		}
	}
</style>
