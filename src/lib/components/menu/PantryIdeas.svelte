<script>
	import { resolve } from '$app/paths';
	import RecipePhoto from '$lib/components/recipes/RecipePhoto.svelte';
	import { photoMorph } from '$lib/motion/photo-morph';

	/** @typedef {import('$lib/types').Recipe} Recipe */

	/**
	 * The answer when no meal is ready: recipes that the pantry can make now.
	 * @type {{ recipes: Recipe[], onadd: (recipe: Recipe) => void }}
	 */
	let { recipes, onadd } = $props();
</script>

<div class="card card--notice rise">
	<h3 class="card__title">No meal on the menu is ready</h3>

	{#if recipes.length === 0}
		<p>The pantry does not have all ingredients for a recipe that needs no preparation.</p>
	{:else}
		<p>The pantry can make these recipes now:</p>
		<ul class="list">
			{#each recipes as recipe (recipe.id)}
				<li class="list__item idea-row" use:photoMorph>
					<RecipePhoto {recipe} variant="thumb" />
					<a class="idea-row__name" href={resolve('/recipes/[id]', { id: recipe.id })}>
						{recipe.name}
					</a>
					<button class="button button--strong" type="button" onclick={() => onadd(recipe)}>
						Add <span class="visually-hidden">{recipe.name} to the menu</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.idea-row {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: var(--space-3);
	}

	.idea-row__name {
		font-weight: 600;
		color: inherit;
		text-decoration: none;
	}
</style>
