<script>
	import { resolve } from '$app/paths';
	import PantryCount from '$lib/components/recipes/PantryCount.svelte';
	import RecipePhoto from '$lib/components/recipes/RecipePhoto.svelte';
	import { photoMorph } from '$lib/motion/photo-morph';

	/**
	 * One recipe that can go on the menu, as a card: the photo, the name, the pantry count, and
	 * the food to use first that the recipe uses up. Food that is selected has a teal fill.
	 * The children are the actions of the card. They are at the bottom of the card.
	 * @type {{
	 *   idea: import('$lib/data/use-up').UseUpIdea,
	 *   selected: Set<string>,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let { idea, selected, children } = $props();

	const recipe = $derived(idea.recipe);
</script>

<article class="idea-card card card--media" use:photoMorph>
	<!-- The title below is the link for the keyboard and for screen readers. -->
	<a
		class="card__media"
		href={resolve('/recipes/[id]', { id: recipe.id })}
		tabindex="-1"
		aria-hidden="true"
	>
		{#key recipe.id}
			<RecipePhoto {recipe} />
		{/key}
	</a>

	<div class="card__body">
		<div class="idea-card__head">
			<h3 class="card__title">
				<a href={resolve('/recipes/[id]', { id: recipe.id })}>{recipe.name}</a>
			</h3>
			<PantryCount {...idea.count} />
		</div>

		{#if idea.uses.length > 0 || recipe.prepSteps.length > 0}
			<p class="idea-card__tags">
				{#if idea.uses.length > 0}
					<span class="visually-hidden">Uses up:</span>
				{/if}
				{#each idea.uses as soon (soon.ingredient.id)}
					<span
						class={[
							'idea-card__use',
							selected.has(soon.ingredient.id) && 'idea-card__use--selected'
						]}
					>
						{soon.ingredient.name}
					</span>
				{/each}
				{#if recipe.prepSteps.length > 0}
					<span class="badge">Needs preparation</span>
				{/if}
			</p>
		{/if}

		{@render children?.()}
	</div>
</article>

<style>
	/* A wide photo, so that the card and its buttons fit on one screen. */
	.idea-card :global(.recipe-photo) {
		aspect-ratio: 9 / 4;
	}

	/* The name, and the pantry count at its right. */
	.idea-card__head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.card__title a {
		color: inherit;
		text-decoration: none;
	}

	.idea-card__tags {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-1);
	}

	/* The food that this recipe saves. A selected item has a teal fill. */
	.idea-card__use {
		padding: 0.1rem var(--space-2);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-note-ink);
		background: var(--color-note);
		border-radius: var(--radius-pill);

		&.idea-card__use--selected {
			color: var(--color-on-accent);
			background: var(--color-accent-strong);
		}
	}
</style>
