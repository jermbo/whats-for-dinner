<script lang="ts">
	import type { Kitchen } from '../../kitchen-state.svelte';
	import type { CookedDish } from '../../kitchen/cook-actions';
	import { courseOf, personCards, type MenuDish } from '../../occasion/menu';
	import { OPEN } from '../../occasion/occasion-note';
	import type { Occasion } from '../../occasion/occasions';
	import { typeOf } from '../../recipes/browse';
	import type { RecipeEntry } from '../../recipes/types';
	import AddInCard from './AddInCard.svelte';
	import DishRow from './DishRow.svelte';
	import PlaceCard from './PlaceCard.svelte';

	// One place card for you, one for each guest with a job, and one for the open jobs. A guest
	// with no job only comes, so the guest list has the guest, and this has no card.
	type Props = {
		kitchen: Kitchen;
		occasion: Occasion;
		menu: MenuDish[];
		guests: string[];
		offered: RecipeEntry[];
		entryOf: (path: string | null) => RecipeEntry | null;
		onpick: (index: number) => void;
		oncook: (path: string, scale: number, dish: CookedDish) => void;
	};
	let { kitchen, occasion, menu, guests, offered, entryOf, onpick, oncook }: Props = $props();

	const { path } = $derived(occasion);
	const cards = $derived(personCards(menu, guests));
	// The card with the open field. undefined: none.
	let adding = $state<string | null | undefined>(undefined);

	// A dish of a different person keeps its course in the line, so the course is not a guess later.
	function add(person: string | null, dish: { path: string | null; name: string }) {
		const entry = entryOf(dish.path);
		const course = person === null ? null : courseOf({ course: null }, entry ? typeOf(entry) : null);
		void kitchen.occasion.addDish(path, { ...dish, person, course });
	}
</script>

<div class="wfd-who">
	{#each cards as card (card.person ?? '')}
		{@const title = card.person === null ? 'You' : card.person === OPEN ? 'Open' : card.person}
		<PlaceCard {title} empty={card.person === OPEN && !card.dishes.length}>
			{#each card.dishes as one (`${one.index}:${one.dish.path ?? one.dish.name}`)}
				{@const entry = entryOf(one.dish.path)}
				<DishRow
					{one}
					{entry}
					onpick={() => onpick(one.index)}
					onready={(ready) => kitchen.occasion.setReady(path, one.index, ready)}
					onchange={(change) => kitchen.occasion.changeDish(path, one.index, change)}
					oncook={() => entry && oncook(entry.path, one.dish.scale, { occasion: path, index: one.index })}
				/>
			{:else}
				<p class="wfd-who__none">{card.person === OPEN ? 'Nothing open' : 'Nothing yet'}</p>
			{/each}
			{#snippet foot()}
				<AddInCard
					label={card.person === OPEN ? 'Add a job' : 'Add a dish'}
					open={adding === card.person}
					recipes={offered}
					ontoggle={() => (adding = adding === card.person ? undefined : card.person)}
					onadd={(dish) => add(card.person, dish)}
				/>
			{/snippet}
		</PlaceCard>
	{/each}
</div>

<style>
	.wfd-who {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
		gap: var(--wfd-space-stack);
		align-items: start;
	}

	.wfd-who__none {
		margin: 0;
		padding-block: var(--wfd-space-group);
		color: var(--wfd-color-text-muted);
	}
</style>
