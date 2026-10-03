<script>
	import { resolve } from '$app/paths';
	import PantryCount from '$lib/components/recipes/PantryCount.svelte';
	import RecipePhoto from '$lib/components/recipes/RecipePhoto.svelte';
	import { photoMorph } from '$lib/motion/photo-morph';

	/** @typedef {import('$lib/types').Recipe} Recipe */

	/**
	 * One recipe that can go on the menu: the food that it uses up, the pantry count, and "Add".
	 * @type {{
	 *   idea: import('$lib/data/use-up').UseUpIdea,
	 *   selected: Set<string>,
	 *   onadd: (recipe: Recipe) => void
	 * }}
	 */
	let { idea, selected, onadd } = $props();

	const recipe = $derived(idea.recipe);
</script>

<div class="use-up" use:photoMorph>
	<RecipePhoto {recipe} variant="thumb" />

	<div class="use-up__text">
		<a class="use-up__name" href={resolve('/recipes/[id]', { id: recipe.id })}>{recipe.name}</a>

		{#if idea.uses.length > 0}
			<p class="use-up__uses">
				<span class="visually-hidden">Uses up:</span>
				{#each idea.uses as soon (soon.ingredient.id)}
					<span
						class={['use-up__use', selected.has(soon.ingredient.id) && 'use-up__use--selected']}
					>
						{soon.ingredient.name}
					</span>
				{/each}
			</p>
		{/if}

		<p class="use-up__pantry">
			<PantryCount {...idea.count} />
			{#if recipe.ingredients.length === 0}
				<span class="badge">Reference recipe</span>
			{/if}
			{#if recipe.prepSteps.length > 0}
				<span class="badge">Needs preparation</span>
			{/if}
		</p>
	</div>

	<button class="button button--strong" type="button" onclick={() => onadd(recipe)}>
		Add <span class="visually-hidden">{recipe.name} to the menu</span>
	</button>
</div>

<style>
	.use-up {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: var(--space-3);
	}

	.use-up__text {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		min-inline-size: 0;
	}

	.use-up__name {
		font-weight: 600;
		color: inherit;
		text-decoration: none;
	}

	.use-up__uses,
	.use-up__pantry {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
	}

	/* The food that this recipe saves. A selected item has a teal fill. */
	.use-up__use {
		padding: 0.1rem var(--space-2);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-note-ink);
		background: var(--color-note);
		border-radius: var(--radius-pill);
		transition:
			background-color 0.2s,
			color 0.2s;

		&.use-up__use--selected {
			color: var(--color-on-accent);
			background: var(--color-accent-strong);
		}
	}
</style>
