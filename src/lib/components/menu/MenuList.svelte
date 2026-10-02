<script>
	import { resolve } from '$app/paths';
	import { entryName } from '$lib/data/menu';
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
			<li class="list__item cluster cluster--between">
				<span class="stack stack--tight">
					<a href={resolve('/recipes/[id]', { id: entry.recipe.id })}>{entryName(entry)}</a>
					<span class="muted">Added {formatDate(entry.item.addedAt)}</span>
				</span>
				<button class="button" type="button" onclick={() => onremove(entry)}>
					Remove <span class="visually-hidden">{entryName(entry)} from the menu</span>
				</button>
			</li>
		{/each}
	</ul>
{/if}
