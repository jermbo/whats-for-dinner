<script>
	import { resolve } from '$app/paths';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { addToMenu, recipesOnMenu } from '$lib/data/menu';
	import { MEAL_TYPES, labelOf } from '$lib/data/options';
	import { db } from '$lib/db/db';
	import { live } from '$lib/live.svelte';
	import { status } from '$lib/status.svelte';
	import { indexBy } from '$lib/util/collections';
	import CookHistory from './CookHistory.svelte';
	import RecipeIngredientList from './RecipeIngredientList.svelte';
	import RecipePhoto from './RecipePhoto.svelte';
	import RecipeSource from './RecipeSource.svelte';

	/** @type {{ id: string }} */
	let { id } = $props();

	const recipe = live(() => db.recipes.get(id), undefined);
	const sessions = live(() => db.sessions.where('recipeId').equals(id).toArray(), []);
	const ingredients = live(() => db.ingredients.toArray(), []);
	const pantry = live(() => db.pantry.toArray(), []);
	const menu = live(() => db.menu.where('recipeId').equals(id).toArray(), []);
	const onMenu = $derived(recipesOnMenu(menu.current).has(id));

	const ingredientsById = $derived(indexBy(ingredients.current, 'id'));
	const pantryByIngredient = $derived(indexBy(pantry.current, 'ingredientId'));

	async function add() {
		await addToMenu(id);
		status.say('Added to the menu.');
	}
</script>

{#if recipe.current}
	{@const current = recipe.current}

	<div class="wide">
		<RecipePhoto recipe={current} variant="hero" />
	</div>

	<PageHeader title={current.name}>
		<a class="button" href={resolve('/recipes/[id]/edit', { id })}>Edit</a>
	</PageHeader>

	<p class="muted">
		{labelOf(MEAL_TYPES, current.mealType)} · {current.servings} servings
		{#if current.inRotation}· In rotation{/if}
	</p>

	<RecipeSource source={current.source} />

	<div>
		{#if onMenu}
			<span class="badge badge--good">On the menu</span>
		{:else}
			<button class="button button--primary" type="button" onclick={add}>Add to the menu</button>
		{/if}
	</div>

	<div class="grid">
		<section class="stack stack--tight" aria-labelledby="recipe-ingredients">
			<h2 id="recipe-ingredients">Ingredients</h2>
			<RecipeIngredientList recipe={current} {ingredientsById} {pantryByIngredient} />
		</section>

		{#if current.prepSteps.length > 0}
			<section class="stack stack--tight" aria-labelledby="recipe-prep">
				<h2 id="recipe-prep">Preparation</h2>
				<ul>
					{#each current.prepSteps as step, index (index)}
						<li>{step.text} <span class="muted">({step.leadHours} hours before)</span></li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if current.steps}
			<section class="stack stack--tight" aria-labelledby="recipe-steps">
				<h2 id="recipe-steps">Steps</h2>
				<p class="recipe-detail__steps">{current.steps}</p>
			</section>
		{/if}

		<section class="stack stack--tight" aria-labelledby="recipe-history">
			<h2 id="recipe-history">Cook history</h2>
			<CookHistory sessions={sessions.current} />
		</section>
	</div>
{:else}
	<PageHeader title="Recipe" />
	<p class="muted">This recipe is not on this device.</p>
{/if}

<style>
	.recipe-detail__steps {
		white-space: pre-wrap;
	}
</style>
