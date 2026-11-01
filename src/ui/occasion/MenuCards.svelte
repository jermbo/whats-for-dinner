<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { showName } from '../../match/names';
	import { courseCards, personOf, type MenuDish } from '../../occasion/menu';
	import { OPEN } from '../../occasion/occasion-note';
	import type { RecipeEntry } from '../../recipes/types';
	import Sticker from '../parts/Sticker.svelte';
	import Struck from '../parts/Struck.svelte';
	import AddInCard from './AddInCard.svelte';
	import PlaceCard from './PlaceCard.svelte';

	// The menu as a sign-up sheet: one card for each course. A known course with no dish is an empty
	// slot, so you see that nobody brings a dessert yet. A dish shows a sticker of its person.
	type Props = {
		menu: MenuDish[];
		offered: RecipeEntry[];
		entryOf: (path: string | null) => RecipeEntry | null;
		onpick: (index: number) => void;
		onadd: (course: string, dish: { path: string | null; name: string }) => void;
	};
	let { menu, offered, entryOf, onpick, onadd }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	const cards = $derived(courseCards(menu));
	let adding = $state<string | null>(null);

	const title = (course: string) => course.charAt(0).toUpperCase() + course.slice(1);
	const nameOf = (one: MenuDish) => {
		const entry = entryOf(one.dish.path);
		return entry ? showName(entry.recipe.title) : one.dish.name;
	};
</script>

<div class="wfd-menu">
	{#each cards as card (card.course)}
		<PlaceCard title={title(card.course)} empty={!card.dishes.length}>
			{#each card.dishes as one (`${one.index}:${one.dish.path ?? one.dish.name}`)}
				{@const person = personOf(one.dish)}
				<button class="wfd-menu__dish" type="button" aria-haspopup="dialog" onclick={() => onpick(one.index)} in:fade={{ duration }}>
					<span class="wfd-menu__name"><Struck on={one.dish.ready}>{nameOf(one)}</Struck></span>
					{#if person === null}
						<Sticker label="You" kind="olive" />
					{:else if person === OPEN}
						<Sticker label="Who brings?" kind="dashed" />
					{:else}
						<Sticker label={person} />
					{/if}
				</button>
			{:else}
				<p class="wfd-menu__none">No {card.course} yet</p>
			{/each}
			{#snippet foot()}
				<AddInCard
					label={card.course === 'things' ? 'Add a thing' : `Add a ${card.course}`}
					open={adding === card.course}
					recipes={offered}
					ontoggle={() => (adding = adding === card.course ? null : card.course)}
					onadd={(dish) => onadd(card.course, dish)}
				/>
			{/snippet}
		</PlaceCard>
	{/each}
</div>

<style>
	.wfd-menu {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
		gap: var(--wfd-space-stack);
		align-items: start;
	}

	button.wfd-menu__dish {
		display: flex;
		gap: var(--wfd-space-group);
		align-items: center;
		inline-size: 100%;
		block-size: auto;
		min-block-size: var(--wfd-control);
		padding: 0;
		border: 0;
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-track);
		border-radius: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		text-align: start;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	.wfd-menu__name {
		flex: 1;
		min-inline-size: 0;
		font-size: var(--wfd-font-size-name);
		font-weight: 600;
		overflow-wrap: anywhere;
	}

	.wfd-menu__none {
		margin: 0;
		padding-block: var(--wfd-space-group);
		color: var(--wfd-color-text-muted);
	}
</style>
