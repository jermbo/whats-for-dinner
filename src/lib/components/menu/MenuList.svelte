<script>
	import { resolve } from '$app/paths';
	import RecipePhoto from '$lib/components/recipes/RecipePhoto.svelte';
	import { entryName } from '$lib/data/menu';
	import { photoMorph } from '$lib/motion/photo-morph';
	import { collapse } from '$lib/motion/transitions';
	import { formatDate } from '$lib/util/format';

	/** @typedef {import('$lib/data/menu').MenuEntry} MenuEntry */

	/**
	 * The meals that are on the menu now. A meal stays until it is cooked or removed.
	 * @type {{ entries: MenuEntry[], onremove: (entry: MenuEntry) => void }}
	 */
	let { entries, onremove } = $props();
</script>

{#if entries.length === 0}
	<p class="muted">The menu is empty. Add meals from the recipes below.</p>
{:else}
	<ul class="list">
		{#each entries as entry (entry.item.id)}
			<li class="list__item" transition:collapse use:photoMorph>
				<div class="menu-row">
					<RecipePhoto recipe={entry.recipe} variant="thumb" />

					<span class="menu-row__text stack stack--tight">
						<a href={resolve('/recipes/[id]', { id: entry.recipe.id })}>{entryName(entry)}</a>
						<span class="muted">Added {formatDate(entry.item.addedAt)}</span>
					</span>

					<button class="button" type="button" onclick={() => onremove(entry)}>
						Remove <span class="visually-hidden">{entryName(entry)} from the menu</span>
					</button>
				</div>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.menu-row {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: var(--space-3);
	}

	.menu-row__text a {
		font-weight: 600;
		color: inherit;
		text-decoration: none;
	}
</style>
