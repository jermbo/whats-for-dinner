<script lang="ts">
	import Chip from './Chip.svelte';
	import IngredientList from './IngredientList.svelte';
	import type { Status } from './match/match';
	import { showName } from './match/names';
	import type { Ingredient, IngredientGroup } from './recipemd/types';

	type Props = {
		ingredients: Ingredient[];
		groups: IngredientGroup[];
		// What the pantry has of an ingredient.
		statusOf: (ingredient: Ingredient) => Status | undefined;
	};
	let { ingredients, groups, statusOf }: Props = $props();

	const words: Record<Status, string> = {
		enough: 'have',
		unknown: 'have, amount not checked',
		short: 'not enough',
		missing: 'missing'
	};
</script>

<div class="ingredients">
	{#if ingredients.length}
		<ul class="ingredients__list">
			{#each ingredients as ingredient}
				{@const status = statusOf(ingredient)}
				<li class="ingredients__item">
					<span class="ingredients__amount">{ingredient.amount?.text ?? ''}</span>
					<span class="ingredients__name">
						{showName(ingredient.name)}
						{#if ingredient.link}
							<Chip label="recipe" />
						{/if}
					</span>
					{#if status}
						<span class="ingredients__status ingredients__status--{status}">{words[status]}</span>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}

	{#each groups as group}
		<section class="ingredients__group">
			<h4 class="ingredients__heading">{group.title}</h4>
			<IngredientList ingredients={group.ingredients} groups={group.groups} {statusOf} />
		</section>
	{/each}
</div>

<style>
	/* All rows use the columns of the list, so the names start at the same position. */
	.ingredients__list {
		display: grid;
		grid-template-columns: max-content 1fr auto;
		column-gap: var(--size-4-3);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.ingredients__item {
		display: grid;
		grid-template-columns: subgrid;
		grid-column: 1 / -1;
		padding-block: var(--size-2-3);
		border-block-start: var(--border-width) solid var(--background-modifier-border);
	}

	.ingredients__amount {
		color: var(--text-muted);
		font-variant-numeric: tabular-nums;
	}

	.ingredients__status {
		font-size: var(--font-ui-smaller);
		text-align: end;
	}

	.ingredients__status--enough,
	.ingredients__status--unknown {
		color: var(--text-success);
	}

	.ingredients__status--short {
		color: var(--text-warning);
	}

	.ingredients__status--missing {
		color: var(--text-error);
	}

	.ingredients__heading {
		margin-block: var(--size-4-3) var(--size-4-1);
		color: var(--text-muted);
		font-size: var(--font-ui-small);
		font-weight: var(--font-semibold);
	}

	/* A group in a group moves in. The inner group is in a different instance of this component. */
	.ingredients__group :global(.ingredients__group) {
		padding-inline-start: var(--size-4-4);
	}
</style>
