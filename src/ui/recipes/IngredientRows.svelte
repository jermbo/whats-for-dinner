<script lang="ts">
	import type { Status } from '../../match/match';
	import { showName } from '../../match/names';
	import type { Ingredient, IngredientGroup } from '../../recipemd/types';
	import Sticker from '../parts/Sticker.svelte';
	import IngredientRows from './IngredientRows.svelte';

	type Props = {
		ingredients: Ingredient[];
		groups: IngredientGroup[];
		// What the pantry has of an ingredient.
		statusOf: (ingredient: Ingredient) => Status | undefined;
	};
	let { ingredients, groups, statusOf }: Props = $props();
</script>

<div class="wfd-rows">
	{#if ingredients.length}
		<ul class="wfd-rows__list">
			{#each ingredients as ingredient}
				{@const status = statusOf(ingredient)}
				<li class="wfd-rows__row" class:wfd-rows__row--none={status === 'missing'}>
					<span class="wfd-rows__name">
						{showName(ingredient.name)}
						{#if ingredient.link}<span class="wfd-rows__mark wfd-label">recipe</span>{/if}
					</span>
					{#if status === 'missing'}
						<Sticker label="None" kind="dashed" />
					{:else if status === 'short'}
						<Sticker label="Low" kind="amber" />
					{:else if status === 'unknown'}
						<Sticker label="Check" />
					{:else if status}
						<span class="wfd-rows__have" role="img" aria-label="In the pantry">✓</span>
					{/if}
					<span class="wfd-rows__amount">{ingredient.amount?.text ?? ''}</span>
				</li>
			{/each}
		</ul>
	{/if}

	{#each groups as group}
		<section class="wfd-rows__group">
			<h4 class="wfd-rows__heading wfd-label">{group.title}</h4>
			<IngredientRows ingredients={group.ingredients} groups={group.groups} {statusOf} />
		</section>
	{/each}
</div>

<style>
	.wfd-rows__list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-rows__row {
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: var(--wfd-space-stack);
		align-items: center;
		min-block-size: 40px;
		padding-block: var(--wfd-space-tight);
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-border);
	}

	.wfd-rows__row--none {
		border-block-end-style: dashed;
		color: var(--wfd-color-text-muted);
	}

	.wfd-rows__name {
		font-size: var(--wfd-font-size-text);
	}

	.wfd-rows__mark {
		margin-inline-start: var(--wfd-space-group);
		color: var(--wfd-color-text-muted);
	}

	/* Food that you have is quiet. Only food that is low or missing gets a sticker. */
	.wfd-rows__have {
		color: var(--wfd-color-text-faint);
		font-weight: 800;
	}

	.wfd-rows__amount {
		min-inline-size: 3ch;
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		text-align: end;
	}

	.wfd-rows__heading {
		margin-block: var(--wfd-space-section) var(--wfd-space-tight);
		color: var(--wfd-color-text-muted);
	}

	/* A group in a group moves in. The inner group is in a different instance of this component. */
	.wfd-rows__group :global(.wfd-rows__group) {
		padding-inline-start: var(--wfd-space-inset);
	}
</style>
