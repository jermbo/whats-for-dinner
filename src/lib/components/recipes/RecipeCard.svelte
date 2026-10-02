<script>
	import { resolve } from '$app/paths';
	import { MEAL_TYPES, labelOf } from '$lib/data/options';
	import { photoMorph } from '$lib/motion/photo-morph';
	import RecipePhoto from './RecipePhoto.svelte';

	/**
	 * One recipe as a card with its photo. The full card is the link to the recipe.
	 * @type {{ recipe: import('$lib/types').Recipe, index?: number }}
	 */
	let { recipe, index = 0 } = $props();
</script>

<li class="card card--media card--link rise" style:--i={index} use:photoMorph>
	<div class="card__media">
		<RecipePhoto {recipe} />
		<span class="card__tag">{labelOf(MEAL_TYPES, recipe.mealType)}</span>
	</div>

	<div class="card__body">
		<h2 class="card__title">
			<a class="card__link" href={resolve('/recipes/[id]', { id: recipe.id })}>{recipe.name}</a>
		</h2>
		<p class="muted">
			{recipe.ingredients.length === 0 ? 'Reference recipe' : `${recipe.servings} servings`}
			{#if recipe.inRotation}· In rotation{/if}
		</p>
	</div>
</li>
