<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { Note } from './note';
	import RecipeCard from './RecipeCard.svelte';

	let { notes }: { notes: Note[] } = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	const recipes = $derived(
		notes
			.flatMap(({ path, result }) => (result.ok ? [{ path, recipe: result.recipe }] : []))
			.sort((a, b) => a.recipe.title.localeCompare(b.recipe.title))
	);
	const rejected = $derived(
		notes
			.flatMap(({ path, result }) => (result.ok ? [] : [{ path, reason: result.reason }]))
			.sort((a, b) => a.path.localeCompare(b.path))
	);

	const plural = (count: number, one: string, many: string) =>
		`${count} ${count === 1 ? one : many}`;
</script>

<section class="recipes" aria-label="Recipes">
	<p class="recipes__count" aria-live="polite">{plural(recipes.length, 'recipe', 'recipes')}</p>

	<ul class="recipes__list">
		{#each recipes as { path, recipe } (path)}
			<li transition:slide={{ duration }}>
				<RecipeCard {path} {recipe} />
			</li>
		{/each}
	</ul>

	{#if rejected.length}
		<details class="recipes__rejected">
			<summary class="recipes__rejected-summary">
				{plural(rejected.length, 'note is not a recipe', 'notes are not recipes')}
			</summary>
			<ul class="recipes__reasons">
				{#each rejected as { path, reason } (path)}
					<li class="recipes__reason" transition:slide={{ duration }}>
						<span class="recipes__path">{path}</span>
						<span class="recipes__why">{reason}</span>
					</li>
				{/each}
			</ul>
		</details>
	{/if}
</section>

<style>
	.recipes__count {
		margin-block: 0 var(--size-4-3);
		color: var(--text-muted);
	}

	.recipes__list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
		gap: var(--size-4-3);
		align-items: start;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.recipes__rejected {
		margin-block-start: var(--size-4-6);
	}

	.recipes__rejected-summary {
		display: flex;
		align-items: center;
		min-block-size: 44px;
		color: var(--text-muted);
		cursor: pointer;

		&:focus-visible {
			outline: 2px solid var(--interactive-accent);
			outline-offset: 2px;
		}
	}

	.recipes__reasons {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.recipes__reason {
		display: grid;
		gap: var(--size-2-1);
		padding-block: var(--size-4-2);
		border-block-end: var(--border-width) solid var(--background-modifier-border);
	}

	.recipes__why {
		color: var(--text-muted);
		font-size: var(--font-ui-small);
	}
</style>
