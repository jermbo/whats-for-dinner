<script>
	import { SvelteSet } from 'svelte/reactivity';
	import { resolve } from '$app/paths';
	import RecipePhoto from '$lib/components/recipes/RecipePhoto.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { missingFor } from '$lib/data/availability';
	import { photoMorph } from '$lib/motion/photo-morph';
	import { pop } from '$lib/motion/transitions';

	/** @typedef {import('$lib/types').Recipe} Recipe */

	/**
	 * A group of recipes that the owner can add to the menu.
	 * Each recipe shows if the pantry can make it now. A recipe that is on the menu already
	 * shows "On the menu", because a recipe is on the menu one time only.
	 * @type {{
	 *   title: string,
	 *   recipes: Recipe[],
	 *   ingredientsById: Map<string, import('$lib/types').Ingredient>,
	 *   pantryByIngredient: Map<string, import('$lib/types').PantryItem>,
	 *   onMenu: Set<string>,
	 *   onadd: (recipe: Recipe) => void
	 * }}
	 */
	let { title, recipes, ingredientsById, pantryByIngredient, onMenu, onadd } = $props();

	const uid = $props.id();

	/** The recipes that were added a moment ago. Their button shows "Added" for a short time. */
	const added = new SvelteSet();

	/** @param {Recipe} recipe */
	function add(recipe) {
		onadd(recipe);
		added.add(recipe.id);
		setTimeout(() => added.delete(recipe.id), 1600);
	}

	/** @param {Recipe} recipe */
	function pantryStatus(recipe) {
		if (recipe.ingredients.length === 0) return { text: 'Reference recipe', good: false };
		const missing = missingFor(recipe, ingredientsById, pantryByIngredient).length;
		return missing === 0
			? { text: 'Pantry has all', good: true }
			: { text: `To buy: ${missing}`, good: false };
	}
</script>

<section class="stack stack--tight" aria-labelledby="{uid}-title">
	<h3 id="{uid}-title">{title}</h3>

	<ul class="list">
		{#each recipes as recipe (recipe.id)}
			{@const pantry = pantryStatus(recipe)}
			<li class="list__item recipe-row" use:photoMorph>
				<RecipePhoto {recipe} variant="thumb" />

				<span class="recipe-row__text stack stack--tight">
					<a href={resolve('/recipes/[id]', { id: recipe.id })}>{recipe.name}</a>
					<span class="cluster">
						<span class={['badge', pantry.good && 'badge--good']}>{pantry.text}</span>
						{#if recipe.prepSteps.length > 0}
							<span class="badge">Needs preparation</span>
						{/if}
					</span>
				</span>

				{#if added.has(recipe.id)}
					<span class="button button--primary recipe-row__state" role="status">
						<span class="recipe-row__added" in:pop><Icon name="check" /></span>
						<span class="visually-hidden">{recipe.name} is added to the menu</span>
					</span>
				{:else if onMenu.has(recipe.id)}
					<span class="badge badge--good">On the menu</span>
				{:else}
					<button class="button button--strong" type="button" onclick={() => add(recipe)}>
						Add <span class="visually-hidden">{recipe.name} to the menu</span>
					</button>
				{/if}
			</li>
		{/each}
	</ul>
</section>

<style>
	.recipe-row {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: var(--space-3);
	}

	.recipe-row__text a {
		font-weight: 600;
		color: inherit;
		text-decoration: none;
	}

	.recipe-row__added {
		display: grid;
	}

	/* "Added" is a moment of feedback, not a control. */
	.recipe-row__state {
		cursor: default;
	}
</style>
