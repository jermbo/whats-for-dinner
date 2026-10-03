<script>
	import { reorder } from '$lib/motion/transitions';
	import SoonItem from './SoonItem.svelte';

	/**
	 * The food to use first, in one row: a "shelf" of the layout. When the menu uses up an item,
	 * the item moves to the end of the row.
	 * With no "ontoggle", the items only show the food: a tap does nothing.
	 * @type {{
	 *   items: import('$lib/data/use-up').SoonItem[],
	 *   selected?: Set<string>,
	 *   ontoggle?: (ingredientId: string) => void
	 * }}
	 */
	let { items, selected, ontoggle } = $props();
</script>

<ul class="shelf soon-shelf" aria-label="Food to use first">
	{#each items as soon (soon.ingredient.id)}
		<li class="soon-shelf__item" animate:reorder>
			<SoonItem
				{soon}
				pressed={selected?.has(soon.ingredient.id) ?? false}
				ontoggle={ontoggle && (() => ontoggle(soon.ingredient.id))}
			/>
		</li>
	{/each}
</ul>

<style>
	.soon-shelf {
		padding-block: var(--space-1) var(--space-4);
		scroll-snap-type: x proximity;
	}

	.soon-shelf__item {
		flex: none;
		scroll-snap-align: start;
	}
</style>
