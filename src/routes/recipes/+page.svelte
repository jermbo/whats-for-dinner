<script>
	import { resolve } from '$app/paths';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { MEAL_TYPES, labelOf } from '$lib/data/options';
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
	<ul class="list">
		{#each sorted as recipe (recipe.id)}
			<li class="list__item">
				<a class="list__link" href={resolve('/recipes/[id]', { id: recipe.id })}>{recipe.name}</a>
				<span class="muted">
					{labelOf(MEAL_TYPES, recipe.mealType)}
					{#if recipe.ingredients.length === 0}· Reference recipe{/if}
					{#if recipe.inRotation}· In rotation{/if}
				</span>
			</li>
		{/each}
	</ul>
{/if}
