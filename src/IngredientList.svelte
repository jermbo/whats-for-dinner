<script lang="ts">
	import Chip from './Chip.svelte';
	import IngredientList from './IngredientList.svelte';
	import type { Ingredient, IngredientGroup } from './recipemd/types';

	let { ingredients, groups }: { ingredients: Ingredient[]; groups: IngredientGroup[] } = $props();
</script>

<div class="ingredients">
	{#if ingredients.length}
		<ul class="ingredients__list">
			{#each ingredients as ingredient}
				<li class="ingredients__item">
					<span class="ingredients__amount">{ingredient.amount?.text ?? ''}</span>
					<span class="ingredients__name">
						{ingredient.name}
						{#if ingredient.link}
							<Chip label="recipe" />
						{/if}
					</span>
				</li>
			{/each}
		</ul>
	{/if}

	{#each groups as group}
		<section class="ingredients__group">
			<h4 class="ingredients__heading">{group.title}</h4>
			<IngredientList ingredients={group.ingredients} groups={group.groups} />
		</section>
	{/each}
</div>

<style>
	/* All rows use the columns of the list, so the names start at the same position. */
	.ingredients__list {
		display: grid;
		grid-template-columns: max-content 1fr;
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
