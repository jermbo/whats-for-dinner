<script>
	import { resolve } from '$app/paths';
	import { missingFor } from '$lib/data/availability';

	/** @typedef {import('$lib/types').Recipe} Recipe */

	/**
	 * A group of recipes that the owner can add to the menu.
	 * Each recipe shows if the pantry can make it now.
	 * @type {{
	 *   title: string,
	 *   recipes: Recipe[],
	 *   ingredientsById: Map<string, import('$lib/types').Ingredient>,
	 *   pantryByIngredient: Map<string, import('$lib/types').PantryItem>,
	 *   onadd: (recipe: Recipe) => void
	 * }}
	 */
	let { title, recipes, ingredientsById, pantryByIngredient, onadd } = $props();

	const uid = $props.id();

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
			<li class="list__item cluster cluster--between">
				<span class="stack stack--tight">
					<a href={resolve('/recipes/[id]', { id: recipe.id })}>{recipe.name}</a>
					<span>
						<span class={['badge', pantry.good && 'badge--good']}>{pantry.text}</span>
						{#if recipe.prepSteps.length > 0}
							<span class="badge">Needs preparation</span>
						{/if}
					</span>
				</span>
				<button class="button" type="button" onclick={() => onadd(recipe)}>
					Add <span class="visually-hidden">{recipe.name} to the menu</span>
				</button>
			</li>
		{/each}
	</ul>
</section>
