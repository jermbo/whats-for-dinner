<script>
	import { resolve } from '$app/paths';
	import { MEAL_TYPES, labelOf } from '$lib/domain/options';
	import { photoMorph } from '$lib/motion/photo-morph';
	import PantryCount from './PantryCount.svelte';
	import RecipePhoto from './RecipePhoto.svelte';

	/**
	 * One recipe as a card with its photo. The full card is the link to the recipe.
	 * The count on the photo tells how many of the ingredients the pantry has.
	 * @type {{
	 *   recipe: import('$lib/types').Recipe,
	 *   count: { have: number, need: number },
	 *   index?: number
	 * }}
	 */
	let { recipe, count, index = 0 } = $props();
</script>

<li class="card card--media card--link rise" style:--i={index} use:photoMorph>
	<div class="card__media">
		<RecipePhoto {recipe} />
		<span class="card__tag">{labelOf(MEAL_TYPES, recipe.mealType)}</span>
		<span class="recipe-card__count"><PantryCount {...count} onPhoto /></span>
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

<style>
	.card__title {
		font-size: 1.25rem;
	}

	/* The pantry count lies at the bottom of the photo, clear of the meal label at the top. */
	.recipe-card__count {
		position: absolute;
		inset-block-end: var(--space-3);
		inset-inline-end: var(--space-3);
		display: flex;
	}
</style>
