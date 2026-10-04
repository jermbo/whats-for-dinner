<script>
	import PantryOffer from './PantryOffer.svelte';

	/** The most offers that the screen shows. */
	const MAX = 2;

	/**
	 * The answer when no meal is ready: the meals that the pantry can make now, as cards. The
	 * best offer is first: the one that uses up the oldest food.
	 * @type {{
	 *   ideas: import('$lib/data/use-up').UseUpIdea[],
	 *   oncook: (recipe: import('$lib/types').Recipe) => void,
	 *   onadd: (recipe: import('$lib/types').Recipe) => void
	 * }}
	 */
	let { ideas, oncook, onadd } = $props();
</script>

{#if ideas.length > 0}
	<ul class="offers" aria-label="From the pantry">
		{#each ideas.slice(0, MAX) as idea (idea.recipe.id)}
			<li class="offers__item rise">
				<PantryOffer {idea} {oncook} {onadd} />
			</li>
		{/each}
	</ul>
{/if}

<style>
	.offers {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 20rem));
		gap: var(--space-5);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.offers__item {
		display: grid;
	}
</style>
