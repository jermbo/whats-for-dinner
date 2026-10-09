<script>
	import { resolve } from '$app/paths';
	import RecipePhoto from '$lib/components/recipes/RecipePhoto.svelte';
	import { hasPhoto } from '$lib/domain/recipe-photo';
	import { photoMorph } from '$lib/motion/photo-morph';

	/**
	 * One recipe that can go on the menu, as a pack: the photo, the olive band with the name, the
	 * pantry count, and the food to use first that the recipe uses up. Food that is selected has
	 * an ink fill.
	 * The children are the actions of the card. They are at the bottom of the card.
	 * @type {{
	 *   idea: import('$lib/domain/use-up').UseUpIdea,
	 *   selected: Set<string>,
	 *   facts?: string,
	 *   children?: import('svelte').Snippet
	 * }}
	 *   facts: a small line above the name, such as "Last 5/5 · 45 min".
	 */
	let { idea, selected, facts = '', children } = $props();

	const recipe = $derived(idea.recipe);
	const photo = $derived(hasPhoto(recipe));
</script>

<article class={['idea-card', 'card', 'pack', !photo && 'pack--plain']} use:photoMorph>
	{#if photo}
		<!-- The title below is the link for the keyboard and for screen readers. -->
		<a
			class="pack__media"
			href={resolve('/recipes/[id]', { id: recipe.id })}
			tabindex="-1"
			aria-hidden="true"
		>
			{#key recipe.id}
				<RecipePhoto {recipe} />
			{/key}
		</a>
	{/if}

	<div class="pack__band">
		{#if recipe.prepSteps.length > 0}
			<p class="pack__flag">
				<span class="sticker sticker--paper">
					<span class="sticker__dot"></span>
					Needs preparation
				</span>
			</p>
		{/if}
		<h3 class="pack__name">
			<a href={resolve('/recipes/[id]', { id: recipe.id })}>{recipe.name}</a>
		</h3>
		{#if facts}
			<p class="label">{facts}</p>
		{/if}
	</div>

	<div class="pack__foot">
		<div class="pack__line">
			<p>
				<span class="label">{idea.uses.length > 0 ? 'Uses up' : 'In the pantry'}</span>
				<span class="idea-card__uses">
					{#each idea.uses as soon (soon.ingredient.id)}
						<span
							class={[
								'idea-card__use',
								selected.has(soon.ingredient.id) && 'idea-card__use--selected'
							]}
						>
							{soon.ingredient.name}
						</span>
					{:else}
						<span class="pack__sub">
							{idea.missing === 0 ? 'All ingredients are here.' : `${idea.missing} to buy.`}
						</span>
					{/each}
				</span>
			</p>
			{#if idea.count.need > 0}
				<p class="count">
					<span aria-hidden="true">
						{idea.count.have}<span class="count__total">/{idea.count.need}</span>
					</span>
					<span class="visually-hidden">
						The pantry has {idea.count.have} of {idea.count.need} ingredients.
					</span>
				</p>
			{/if}
		</div>

		{@render children?.()}
	</div>
</article>

<style>
	/* A wide photo, so that the card and its buttons fit on one screen. */
	.idea-card :global(.recipe-photo--card) {
		aspect-ratio: 16 / 9;
	}

	.idea-card.pack--plain :global(.pack__band) {
		min-block-size: 10rem;
	}

	.idea-card__uses {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
		margin-block-start: var(--space-1);
	}

	/* The food that this recipe saves. A selected item has an ink fill. */
	.idea-card__use {
		padding: 0.1rem var(--space-2);
		font-size: 0.8125rem;
		font-weight: 700;
		background: var(--olive);
		border-radius: var(--radius-sticker);

		&.idea-card__use--selected {
			color: var(--paper);
			background: var(--ink);
		}
	}
</style>
