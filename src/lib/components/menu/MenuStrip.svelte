<script>
	import { resolve } from '$app/paths';
	import RecipePhoto from '$lib/components/recipes/RecipePhoto.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { entryName } from '$lib/data/menu';
	import { photoMorph } from '$lib/motion/photo-morph';
	import { pop, reorder } from '$lib/motion/transitions';

	/** @typedef {import('$lib/data/menu').MenuEntry} MenuEntry */

	/**
	 * The meals that are on the menu now, as one row of small photos that scrolls sideways.
	 * A meal stays until it is cooked or removed. The button goes to the shopping list, and
	 * tells how many items the menu needs.
	 * @type {{ entries: MenuEntry[], toBuy: number, onremove: (entry: MenuEntry) => void }}
	 */
	let { entries, toBuy, onremove } = $props();
</script>

<section class="stack stack--tight" aria-labelledby="menu-current">
	<div class="cluster cluster--between">
		<h2 id="menu-current">Your menu ({entries.length})</h2>
		{#if entries.length > 0}
			<a class="button button--primary" href={resolve('/shop')}>
				Shopping list
				{#if toBuy > 0}
					<span aria-hidden="true">&nbsp;· {toBuy}</span>
					<span class="visually-hidden">: {toBuy} items to buy</span>
				{/if}
			</a>
		{/if}
	</div>

	{#if entries.length === 0}
		<p class="muted">The menu is empty. Add meals from the list below.</p>
	{:else}
		<ul class="menu-strip">
			{#each entries as entry (entry.item.id)}
				<li class="menu-strip__item" animate:reorder transition:pop use:photoMorph>
					<a class="menu-strip__link" href={resolve('/recipes/[id]', { id: entry.recipe.id })}>
						<RecipePhoto recipe={entry.recipe} variant="thumb" />
						<span class="menu-strip__name">{entryName(entry)}</span>
					</a>
					<button class="menu-strip__remove" type="button" onclick={() => onremove(entry)}>
						<Icon name="close" />
						<span class="visually-hidden">Remove {entryName(entry)} from the menu</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	/*
	 * The row goes to the edges of the screen.
	 * "position: relative" keeps the hidden texts of the items in the row: see SoonShelf.
	 */
	.menu-strip {
		position: relative;
		display: flex;
		gap: var(--space-3);
		margin: 0 calc(-1 * var(--space-5));
		padding: var(--space-2) var(--space-5);
		overflow-x: auto;
		list-style: none;
		scrollbar-width: none;
	}

	.menu-strip__item {
		position: relative;
		flex: none;
		inline-size: 5.5rem;
	}

	.menu-strip__link {
		display: grid;
		gap: var(--space-1);
		color: inherit;
		text-decoration: none;

		& :global(.recipe-photo) {
			inline-size: 100%;
		}
	}

	/* The name has two lines at most. */
	.menu-strip__name {
		display: -webkit-box;
		overflow: hidden;
		font-size: 0.8rem;
		font-weight: 600;
		line-height: 1.25;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	/* A small round button on the corner of the photo. */
	.menu-strip__remove {
		position: absolute;
		inset-block-start: calc(-1 * var(--space-2));
		inset-inline-end: calc(-1 * var(--space-2));
		display: grid;
		place-items: center;
		inline-size: 1.75rem;
		block-size: 1.75rem;
		padding: 0;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 50%;
		box-shadow: var(--shadow);
		cursor: pointer;
		transition: scale 0.25s var(--ease-spring);

		& :global(.icon) {
			inline-size: 1rem;
			block-size: 1rem;
		}

		/* The finger gets a larger target than the eye sees. */
		&::before {
			position: absolute;
			inset: -0.5rem;
			content: '';
		}

		&:active {
			scale: 0.9;
		}
	}

	@media (min-width: 60rem) {
		.menu-strip {
			flex-wrap: wrap;
			margin-inline: 0;
			padding-inline: 0;
			overflow-x: visible;
		}
	}
</style>
