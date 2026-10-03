<script>
	import { collapse, reorder } from '$lib/motion/transitions';
	import UseUpCard from './UseUpCard.svelte';

	/**
	 * Recipes that can go on the menu. A recipe moves to its new place when the order changes.
	 * A recipe that goes on the menu leaves the list.
	 * @type {{
	 *   ideas: import('$lib/data/use-up').UseUpIdea[],
	 *   selected: Set<string>,
	 *   onadd: (recipe: import('$lib/types').Recipe) => void
	 * }}
	 */
	let { ideas, selected, onadd } = $props();
</script>

<ul class="list">
	{#each ideas as idea (idea.recipe.id)}
		<li class="list__item" animate:reorder transition:collapse>
			<UseUpCard {idea} {selected} {onadd} />
		</li>
	{/each}
</ul>
