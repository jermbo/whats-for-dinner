<script>
	import { resolve } from '$app/paths';
	import ActionBar from '$lib/components/ui/ActionBar.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { pantryCount } from '$lib/domain/availability';
	import { stepsToCook } from '$lib/domain/cook-cards';
	import { isCooking } from '$lib/domain/cook-session';
	import { finishedPhotos } from '$lib/domain/finished-photos';
	import { MEAL_TYPES, labelOf } from '$lib/domain/options';
	import { notesByStep } from '$lib/domain/step-notes';
	import { useKitchen } from '$lib/state/kitchen.svelte';
	import CookHistory from './CookHistory.svelte';
	import CoverCarousel from './CoverCarousel.svelte';
	import PantryCount from './PantryCount.svelte';
	import RecipeIngredientList from './RecipeIngredientList.svelte';
	import RecipePhoto from './RecipePhoto.svelte';
	import RecipeSource from './RecipeSource.svelte';
	import RecipeStepRow from './RecipeStepRow.svelte';

	/**
	 * The page of one recipe: its card at the side, and its steps and its cook history.
	 * @type {{
	 *   recipe: import('$lib/types').Recipe,
	 *   sessions: import('$lib/types').CookSession[],
	 *   item?: import('$lib/types').MenuItem,
	 *   onadd: () => void,
	 *   oncook: () => void,
	 *   onshare: () => void
	 * }}
	 *   sessions: all cook sessions of the recipe. item: the recipe as a meal on the menu.
	 */
	let { recipe, sessions, item, onadd, oncook, onshare } = $props();

	const uid = $props.id();

	const kitchen = useKitchen();
	const { ingredientsById, pantryByIngredient } = $derived(kitchen);
	const id = $derived(recipe.id);

	/** The cook history has only the meals that are cooked. An open session is not history. */
	const cooked = $derived(sessions.filter((session) => session.cookedAt));
	const cooking = $derived(
		sessions.some(
			(session) =>
				!session.cookedAt && session.menuItem.id === item?.id && isCooking(session, Date.now())
		)
	);
	const notes = $derived(notesByStep(sessions));
	const photos = $derived(finishedPhotos(recipe, sessions));
	const steps = $derived(stepsToCook(recipe));

	const count = $derived(pantryCount(recipe, ingredientsById, pantryByIngredient));
	const toBuy = $derived(count.need - count.have);

	/** The label tells the result before the tap: how many ingredients the owner must buy. */
	const addLabel = $derived.by(() => {
		if (count.need === 0) return 'Add to the menu';
		return toBuy > 0 ? `Add to the menu · ${toBuy} to buy` : 'Add to the menu · the pantry has all';
	});
</script>

<!--
		The photo, the name, and the ingredients are the card of the recipe: the side column, at
		the left, which stays in view. The work is the main column.
	-->
<div class="split split--reverse split--loose">
	<div class="split__side split__side--sticky">
		<!-- With two or more finished photos, the owner swipes them and selects the cover. -->
		{#if photos.length > 1}
			<CoverCarousel {recipe} {photos} />
		{:else}
			<RecipePhoto {recipe} variant="hero" />
		{/if}

		<PageHeader title={recipe.name}>
			<button class="button recipe-detail__share" type="button" onclick={onshare}>
				<Icon name="share" />
				Share
			</button>
			<a class="button" href={resolve('/recipes/[id]/edit', { id })}>Edit</a>
		</PageHeader>

		<p class="muted">
			{labelOf(MEAL_TYPES, recipe.mealType)} · {recipe.servings} servings
			{#if recipe.inRotation}· In rotation{/if}
		</p>

		<RecipeSource source={recipe.source} />

		{#if !item}
			<ActionBar>
				<button class="button button--primary button--wide" type="button" onclick={onadd}>
					{addLabel}
				</button>
			</ActionBar>
		{:else}
			<div>
				<span class="badge badge--good">On the menu</span>
			</div>
			{#if steps.length > 0}
				<ActionBar>
					<button class="button button--primary button--wide" type="button" onclick={oncook}>
						{cooking ? 'Continue to cook' : 'Cook'}
					</button>
				</ActionBar>
			{/if}
			{#if toBuy > 0}
				<a class="button" href={resolve('/shop')}>Open the shopping list</a>
			{/if}
		{/if}

		<section class="stack stack--tight" aria-labelledby="{uid}-ingredients">
			<div class="cluster cluster--between">
				<h2 id="{uid}-ingredients">Ingredients</h2>
				<PantryCount {...count} />
			</div>
			<RecipeIngredientList {recipe} {ingredientsById} {pantryByIngredient} />
		</section>
	</div>

	<div class="stack">
		{#if recipe.prepSteps.length > 0}
			<section class="stack stack--tight" aria-labelledby="{uid}-prep">
				<h2 id="{uid}-prep">Preparation</h2>
				<ul>
					{#each recipe.prepSteps as step, index (index)}
						<li>{step.text} <span class="muted">({step.leadHours} hours before)</span></li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if steps.length > 0}
			<section class="stack stack--tight" aria-labelledby="{uid}-steps">
				<h2 id="{uid}-steps">Steps</h2>
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

		<section class="stack stack--tight" aria-labelledby="{uid}-history">
			<h2 id="{uid}-history">Cook history</h2>
			<CookHistory sessions={cooked} {recipe} />
		</section>
	</div>
</div>

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
