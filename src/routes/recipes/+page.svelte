<script>
	import { resolve } from '$app/paths';
	import RecipeCard from '$lib/components/recipes/RecipeCard.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { db } from '$lib/db/db';
	import { live } from '$lib/live.svelte';
	import { sortByName } from '$lib/util/collections';

	const recipes = live(() => db.recipes.toArray(), []);
	const sorted = $derived(sortByName(recipes.current));
</script>

<PageHeader title="Recipes">
	<a class="button button--primary" href={resolve('/recipes/new')}>New recipe</a>
</PageHeader>

{#if sorted.length === 0}
	<p class="muted">There are no recipes. Add the first one.</p>
{:else}
	<ul class="grid recipe-grid">
		{#each sorted as recipe, index (recipe.id)}
			<RecipeCard {recipe} {index} />
		{/each}
	</ul>
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
