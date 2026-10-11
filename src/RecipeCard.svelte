<script lang="ts">
	import Card from './Card.svelte';
	import IngredientList from './IngredientList.svelte';
	import type { IngredientGroup, Recipe } from './recipemd/types';

	let { path, recipe }: { path: string; recipe: Recipe } = $props();

	const countIn = (groups: IngredientGroup[]): number =>
		groups.reduce((sum, group) => sum + group.ingredients.length + countIn(group.groups), 0);

	const count = $derived(recipe.ingredients.length + countIn(recipe.groups));
	const meta = $derived(
		[
			...recipe.yields.map((amount) => amount.text),
			`${count} ${count === 1 ? 'ingredient' : 'ingredients'}`
		].join(' · ')
	);
</script>

<Card title={recipe.title} {meta} tags={recipe.tags}>
	<p class="recipe__path">{path}</p>
	{#if recipe.description}
		<p class="recipe__description">{recipe.description}</p>
	{/if}
	<IngredientList ingredients={recipe.ingredients} groups={recipe.groups} />
</Card>

<style>
	.recipe__path {
		margin-block: 0 var(--size-4-2);
		color: var(--text-faint);
		font-size: var(--font-ui-smaller);
	}

	.recipe__description {
		margin-block: 0 var(--size-4-3);
		font-size: var(--font-ui-small);
		white-space: pre-line;
	}
</style>
