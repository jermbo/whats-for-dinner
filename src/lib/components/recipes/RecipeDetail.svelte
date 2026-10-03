<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ActionBar from '$lib/components/ui/ActionBar.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { pantryCount } from '$lib/data/availability';
	import { stepsToCook } from '$lib/data/cook-cards';
	import { isCooking, startCook } from '$lib/data/cooking';
	import { finishedPhotos } from '$lib/data/finished-photos';
	import { addToMenu } from '$lib/data/menu';
	import { MEAL_TYPES, labelOf } from '$lib/data/options';
	import { shareRecipe } from '$lib/data/share';
	import { notesByStep } from '$lib/data/step-notes';
	import { db } from '$lib/db/db';
	import { live } from '$lib/live.svelte';
	import { status } from '$lib/status.svelte';
	import { indexBy } from '$lib/util/collections';
	import CookHistory from './CookHistory.svelte';
	import CoverCarousel from './CoverCarousel.svelte';
	import PantryCount from './PantryCount.svelte';
	import RecipeIngredientList from './RecipeIngredientList.svelte';
	import RecipePhoto from './RecipePhoto.svelte';
	import RecipeSource from './RecipeSource.svelte';
	import RecipeStepRow from './RecipeStepRow.svelte';

	/** @type {{ id: string }} */
	let { id } = $props();

	const recipe = live(() => db.recipes.get(id), undefined);
	const sessions = live(() => db.sessions.where('recipeId').equals(id).toArray(), []);
	const ingredients = live(() => db.ingredients.toArray(), []);
	const pantry = live(() => db.pantry.toArray(), []);
	const menu = live(() => db.menu.where('recipeId').equals(id).toArray(), []);

	/** The recipe as a meal to cook on the menu. Leftovers are a different meal. */
	const item = $derived(menu.current.find((entry) => entry.kind === 'recipe'));
	const ingredientsById = $derived(indexBy(ingredients.current, 'id'));
	const pantryByIngredient = $derived(indexBy(pantry.current, 'ingredientId'));

	/** The cook history has only the meals that are cooked. An open session is not history. */
	const cooked = $derived(sessions.current.filter((session) => session.cookedAt));
	const cooking = $derived(
		sessions.current.some(
			(session) =>
				!session.cookedAt && session.menuItem.id === item?.id && isCooking(session, Date.now())
		)
	);
	const notes = $derived(notesByStep(sessions.current));
	const photos = $derived(recipe.current ? finishedPhotos(recipe.current, sessions.current) : []);
	const steps = $derived(recipe.current ? stepsToCook(recipe.current) : []);

	const count = $derived(
		recipe.current
			? pantryCount(recipe.current, ingredientsById, pantryByIngredient)
			: { have: 0, need: 0 }
	);
	const toBuy = $derived(count.need - count.have);

	/** The label tells the result before the tap: how many ingredients the owner must buy. */
	const addLabel = $derived.by(() => {
		if (count.need === 0) return 'Add to the menu';
		return toBuy > 0 ? `Add to the menu · ${toBuy} to buy` : 'Add to the menu · the pantry has all';
	});

	async function add() {
		await addToMenu(id);
		status.say('Added to the menu.');
	}

	async function cook() {
		if (!item) return;
		const sessionId = await startCook(item);
		goto(resolve('/cook/[id]', { id: sessionId }));
	}

	async function share() {
		if (!recipe.current) return;
		const result = await shareRecipe(recipe.current);
		if (result === 'downloaded') status.say('The recipe file is in the downloads.');
	}
</script>

{#if recipe.current}
	{@const current = recipe.current}

	<!--
		The photo, the name, and the ingredients are the card of the recipe: the side column, at
		the left, which stays in view. The work is the main column.
	-->
	<div class="split split--reverse split--loose">
		<div class="split__side split__side--sticky">
			<!-- With two or more finished photos, the owner swipes them and selects the cover. -->
			{#if photos.length > 1}
				<CoverCarousel recipe={current} {photos} />
			{:else}
				<RecipePhoto recipe={current} variant="hero" />
			{/if}

			<PageHeader title={current.name}>
				<button class="button recipe-detail__share" type="button" onclick={share}>
					<Icon name="share" />
					Share
				</button>
				<a class="button" href={resolve('/recipes/[id]/edit', { id })}>Edit</a>
			</PageHeader>

			<p class="muted">
				{labelOf(MEAL_TYPES, current.mealType)} · {current.servings} servings
				{#if current.inRotation}· In rotation{/if}
			</p>

			<RecipeSource source={current.source} />

			{#if !item}
				<ActionBar>
					<button class="button button--primary button--wide" type="button" onclick={add}>
						{addLabel}
					</button>
				</ActionBar>
			{:else}
				<div>
					<span class="badge badge--good">On the menu</span>
				</div>
				{#if steps.length > 0}
					<ActionBar>
						<button class="button button--primary button--wide" type="button" onclick={cook}>
							{cooking ? 'Continue to cook' : 'Cook'}
						</button>
					</ActionBar>
				{/if}
				{#if toBuy > 0}
					<a class="button" href={resolve('/shop')}>Open the shopping list</a>
				{/if}
			{/if}

			<section class="stack stack--tight" aria-labelledby="recipe-ingredients">
				<div class="cluster cluster--between">
					<h2 id="recipe-ingredients">Ingredients</h2>
					<PantryCount {...count} />
				</div>
				<RecipeIngredientList recipe={current} {ingredientsById} {pantryByIngredient} />
			</section>
		</div>

		<div class="stack">
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

			{#if steps.length > 0}
				<section class="stack stack--tight" aria-labelledby="recipe-steps">
					<h2 id="recipe-steps">Steps</h2>
					<ol class="recipe-detail__steps">
						{#each steps as step, index (step.id)}
							<RecipeStepRow
								recipeId={id}
								{step}
								number={index + 1}
								notes={notes.get(step.id) ?? []}
							/>
						{/each}
					</ol>
				</section>
			{/if}

			<section class="stack stack--tight" aria-labelledby="recipe-history">
				<h2 id="recipe-history">Cook history</h2>
				<CookHistory sessions={cooked} recipe={current} />
			</section>
		</div>
	</div>
{:else}
	<PageHeader title="Recipe" />
	<p class="muted">This recipe is not on this device.</p>
{/if}

<style>
	.recipe-detail__steps {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		max-inline-size: var(--measure);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.recipe-detail__share {
		gap: var(--space-2);
	}
</style>
