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
		gap: 10px;
		align-items: center;
		min-block-size: 40px;
		padding-block: 6px;
		border-block-end: 1px solid var(--wfd-line);
	}

	.wfd-rows__row--none {
		border-block-end-style: dashed;
		color: var(--wfd-ink-2);
	}

	.wfd-rows__name {
		font-size: 16px;
	}

	.wfd-rows__mark {
		margin-inline-start: 6px;
		color: var(--wfd-ink-2);
	}

	/* Food that you have is quiet. Only food that is low or missing gets a sticker. */
	.wfd-rows__have {
		color: var(--wfd-ink-3);
		font-weight: 800;
	}

	.wfd-rows__amount {
		min-inline-size: 3ch;
		color: var(--wfd-ink-2);
		font-size: 15px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		text-align: end;
	}

	.wfd-rows__heading {
		margin-block: 14px 2px;
		color: var(--wfd-ink-2);
	}

	/* A group in a group moves in. The inner group is in a different instance of this component. */
	.wfd-rows__group :global(.wfd-rows__group) {
		padding-inline-start: 16px;
	}
</style>
