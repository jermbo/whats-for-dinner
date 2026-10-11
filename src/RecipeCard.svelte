<script lang="ts">
	import Card from './Card.svelte';
	import IngredientList from './IngredientList.svelte';
	import type { RecipeEntry } from './kitchen-state.svelte';
	import type { Ingredient } from './recipemd/types';

	type Props = {
		entry: RecipeEntry;
		planned: boolean;
		onplan: () => void;
		onunplan: () => void;
		oncook: () => void;
		onopen: () => void;
	};
	let { entry, planned, onplan, onunplan, oncook, onopen }: Props = $props();

	const { recipe, match } = $derived(entry);

	const meta = $derived(
		[
			`${match.inPantry} of ${match.ingredients.length} in the pantry`,
			...recipe.yields.map((amount) => amount.text)
		].join(' · ')
	);
	const tags = $derived([
		...match.useSoon.map((name) => `Use soon: ${name}`),
		...(entry.rating ? [`${'★'.repeat(entry.rating)}`] : []),
		...recipe.tags
	]);

	const statuses = $derived(new Map(match.ingredients.map((one) => [one.ingredient, one.status])));
	const statusOf = (ingredient: Ingredient) => statuses.get(ingredient);
</script>

<Card title={recipe.title} {meta} {tags}>
	{#if recipe.description}
		<p class="recipe__description">{recipe.description}</p>
	{/if}
	<IngredientList ingredients={recipe.ingredients} groups={recipe.groups} {statusOf} />

	<div class="recipe__actions">
		<button class="recipe__button" type="button" onclick={onopen}>Open note</button>
		{#if planned}
			<button class="recipe__button" type="button" onclick={onunplan}>Remove from the week</button>
		{:else}
			<button class="recipe__button" type="button" onclick={onplan}>Add to the week</button>
		{/if}
		<button class="recipe__button mod-cta" type="button" onclick={oncook}>Cook</button>
	</div>
</Card>

<style>
	.recipe__description {
		margin-block: 0 var(--size-4-3);
		font-size: var(--font-ui-small);
		white-space: pre-line;
	}

	.recipe__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--size-4-2);
		justify-content: end;
		margin-block-start: var(--size-4-3);
	}

	.recipe__button {
		min-block-size: 44px;
	}
</style>
