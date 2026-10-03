<script>
	import { resolve } from '$app/paths';
	import MealFilter from '$lib/components/menu/MealFilter.svelte';
	import RecipeCard from '$lib/components/recipes/RecipeCard.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import ToggleChip from '$lib/components/ui/ToggleChip.svelte';
	import { canMake, pantryCount } from '$lib/data/availability';
	import { useKitchen } from '$lib/kitchen.svelte';
	import { sortByName } from '$lib/util/collections';

	const kitchen = useKitchen();

	/** "Cook now": only the recipes that the pantry can make in full. */
	let cookNow = $state(false);
	let filter = $state('all');

	const sorted = $derived(sortByName(kitchen.recipes));
	const ofType = $derived(
		sorted.filter((recipe) => filter === 'all' || recipe.mealType === filter)
	);
	const able = $derived(
		ofType.filter((recipe) => canMake(recipe, kitchen.ingredientsById, kitchen.pantryByIngredient))
	);
	const shown = $derived(cookNow ? able : ofType);
</script>

<PageHeader title="Recipes">
	<a class="button button--primary" href={resolve('/recipes/new')}>New recipe</a>
</PageHeader>

{#if sorted.length === 0}
	<p class="muted">There are no recipes. Add the first one.</p>
{:else}
	<div class="cluster">
		<ToggleChip label="Cook now ({able.length})" bind:checked={cookNow} />
		<MealFilter bind:value={filter} />
	</div>

	{#if shown.length === 0}
		<p class="muted">
			{cookNow
				? 'The pantry does not have all ingredients for a recipe.'
				: 'There are no recipes for this meal type.'}
		</p>
	{:else}
		<ul class="grid recipe-grid">
			{#each shown as recipe, index (recipe.id)}
				<RecipeCard
					{recipe}
					{index}
					count={pantryCount(recipe, kitchen.ingredientsById, kitchen.pantryByIngredient)}
				/>
			{/each}
		</ul>
	{/if}
{/if}

<style>
	/* Two photo cards side by side on a phone, and more on a desktop. */
	.recipe-grid {
		--grid-min: 9.5rem;

		margin: 0;
		padding: 0;
		gap: var(--space-4);

		@media (min-width: 40rem) {
			--grid-min: 14rem;
		}
	}
</style>
