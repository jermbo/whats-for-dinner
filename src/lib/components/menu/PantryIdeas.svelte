<script>
	import { resolve } from '$app/paths';

	/** @typedef {import('$lib/types').Recipe} Recipe */

	/**
	 * The answer when no meal is ready: recipes that the pantry can make now.
	 * @type {{ recipes: Recipe[], onadd: (recipe: Recipe) => void }}
	 */
	let { recipes, onadd } = $props();
</script>

<div class="card card--notice">
	<h3 class="card__title">No meal on the menu is ready</h3>

	{#if recipes.length === 0}
		<p>The pantry does not have all ingredients for a recipe that needs no preparation.</p>
	{:else}
		<p>The pantry can make these recipes now:</p>
		<ul class="list">
			{#each recipes as recipe (recipe.id)}
				<li class="list__item cluster cluster--between">
					<a href={resolve('/recipes/[id]', { id: recipe.id })}>{recipe.name}</a>
					<button class="button button--strong" type="button" onclick={() => onadd(recipe)}>
						Add <span class="visually-hidden">{recipe.name}</span> to the menu
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
