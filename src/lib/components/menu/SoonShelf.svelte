<script>
	import { reorder } from '$lib/motion/transitions';
	import SoonItem from './SoonItem.svelte';

	/**
	 * The food to use first, in one row that scrolls sideways. When the menu uses up an item, the
	 * item moves to the end of the row.
	 * @type {{
	 *   items: import('$lib/data/use-up').SoonItem[],
	 *   selected: Set<string>,
	 *   ontoggle: (ingredientId: string) => void
	 * }}
	 */
	let { items, selected, ontoggle } = $props();
</script>

<ul class="soon-shelf" aria-label="Food to use first">
	{#each items as soon (soon.ingredient.id)}
		<li class="soon-shelf__item" animate:reorder>
			<SoonItem
				{soon}
				pressed={selected.has(soon.ingredient.id)}
				ontoggle={() => ontoggle(soon.ingredient.id)}
			/>
		</li>
	{/each}
</ul>

<style>
	/*
	 * The row goes to the edges of the screen.
	 * "position: relative" keeps the hidden texts of the items in the row. Without it, a hidden
	 * text takes its place from the page: an item far to the right then makes the page scroll
	 * sideways.
	 */
	.soon-shelf {
		position: relative;
		display: flex;
		gap: var(--space-3);
		margin: 0 calc(-1 * var(--space-5));
		padding: var(--space-1) var(--space-5) var(--space-4);
		overflow-x: auto;
		list-style: none;
		scroll-snap-type: x proximity;
		scrollbar-width: none;
	}

	.soon-shelf__item {
		flex: none;
		scroll-snap-align: start;
	}

	@media (min-width: 60rem) {
		.soon-shelf {
			flex-wrap: wrap;
			margin-inline: 0;
			padding-inline: 0;
			overflow-x: visible;
		}
	}
</style>
