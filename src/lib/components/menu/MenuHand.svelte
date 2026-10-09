<script>
	import MealSheet from '$lib/components/meal/MealSheet.svelte';
	import { lessMotion } from '$lib/motion/less-motion.svelte';
	import { pop, reorder } from '$lib/motion/transitions';
	import MiniMealCard from './MiniMealCard.svelte';

	/** @typedef {import('$lib/domain/menu').MenuEntry} MenuEntry */

	/**
	 * The meals that are on the menu now, as one row of small meal cards: a "shelf" of the layout.
	 * These are the cards of the hand on the "Today" screen. A tap turns a card: its back opens
	 * on the full screen, and "Remove from the menu" is there.
	 * After the cards, the row shows one dashed place for each night that has no meal yet. The
	 * first of them is the place of the next meal.
	 * @type {{
	 *   entries: MenuEntry[],
	 *   open?: number,
	 *   lastSessions: Map<string, import('$lib/types').CookSession>,
	 *   onremove: (entry: MenuEntry) => void,
	 *   onprep: (entry: MenuEntry) => unknown
	 * }}
	 *   open: the number of nights with no meal.
	 */
	let { entries, open = 0, lastSessions, onremove, onprep } = $props();

	/** @type {MealSheet | undefined} */
	let sheet = $state();
	/** @type {HTMLElement | undefined} */
	let row = $state();

	/** The number of meals at the last look. It is not state: the screen does not show it. */
	let before = 0;

	// A new meal is the last card of the row. The row scrolls to it.
	$effect(() => {
		const count = entries.length;
		if (before > 0 && count === before + 1) {
			row?.scrollTo({
				left: row.scrollWidth,
				behavior: lessMotion.current ? 'auto' : 'smooth'
			});
		}
		before = count;
	});
</script>

{#if entries.length === 0 && open === 0}
	<p class="muted">The menu is empty. Add the meal below, or look at the next one.</p>
{:else}
	<ul class="shelf" aria-label="Meals on the menu" bind:this={row}>
		{#each entries as entry (entry.item.id)}
			<li class="menu-hand__item" animate:reorder transition:pop>
				<MiniMealCard {entry} onturn={(card) => sheet?.open(entry.item.id, card)} />
			</li>
		{/each}
		{#each { length: open }, index (index)}
			<li
				class={['menu-hand__item', 'menu-hand__place', index === 0 && 'menu-hand__place--next']}
				aria-hidden="true"
				transition:pop
			></li>
		{/each}
	</ul>
{/if}

<MealSheet bind:this={sheet} {entries} {lastSessions} {onremove} {onprep} />

<style>
	.menu-hand__item {
		flex: none;
		inline-size: 4.5rem;
	}

	/* A night with no meal: a dashed place, as high as the photo of a card. */
	.menu-hand__place {
		block-size: 4.5rem;
		border: 2px dashed var(--hairline);
		border-radius: var(--radius-control);
	}

	/* The place of the next meal. */
	.menu-hand__place--next {
		border-color: var(--ink);
	}
</style>
