<script lang="ts">
	import type { Kitchen } from '../../kitchen-state.svelte';
	import type { CookedDish } from '../../kitchen/cook-actions';
	import { comingOf, guestsOf, jobsOf } from '../../occasion/guests';
	import { showName } from '../../match/names';
	import { courseOptions, menuDishes, personOf } from '../../occasion/menu';
	import { isOnTheList } from '../../occasion/occasion-list';
	import { OPEN } from '../../occasion/occasion-note';
	import type { Occasion } from '../../occasion/occasions';
	import { typeOf } from '../../recipes/browse';
	import type { RecipeEntry } from '../../recipes/types';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import GuestList from './GuestList.svelte';
	import MenuCards from './MenuCards.svelte';
	import OccasionCard, { type Section } from './OccasionCard.svelte';
	import OccasionMenu from './OccasionMenu.svelte';
	import OccasionTasks from './OccasionTasks.svelte';
	import ToBuy from './ToBuy.svelte';
	import WhoBrings from './WhoBrings.svelte';
	import WhoSheet, { type SheetDish } from './WhoSheet.svelte';

	// The screen of one occasion, as one page: the ink card, who brings what with the guest list,
	// the menu by course, what to buy, and the tasks.
	type Props = {
		kitchen: Kitchen;
		occasion: Occasion;
		oncook: (path: string, scale: number, dish: CookedDish) => void;
	};
	let { kitchen, occasion, oncook }: Props = $props();
	const headId = $props.id();

	const { path } = $derived(occasion);
	const entryOf = (recipe: string | null): RecipeEntry | null =>
		recipe ? (kitchen.recipes.find((entry) => entry.path === recipe) ?? null) : null;
	const typeOfDish = (recipe: string | null) => {
		const entry = entryOf(recipe);
		return entry ? typeOf(entry) : null;
	};

	const menu = $derived(menuDishes(occasion.dishes, (dish) => typeOfDish(dish.path)));
	const guests = $derived(guestsOf(occasion));
	const names = $derived(guests.map((guest) => guest.name));
	const courses = $derived(courseOptions(menu.map((one) => one.course)));
	const inOccasion = $derived(new Set(occasion.dishes.flatMap((dish) => (dish.path ? [dish.path] : []))));
	const offered = $derived(kitchen.recipes.filter((entry) => !inOccasion.has(entry.path)));

	const toBuy = $derived(kitchen.toBuyOf(occasion));
	const listed = $derived(isOnTheList(occasion, kitchen.today));
	const isOnList = (key: string) =>
		kitchen.list.some((row) => row.key === key) || kitchen.cart.some((row) => row.key === key);

	// "Who brings" or its second tab, the guest list.
	let guestTab = $state(false);
	const boxes: Partial<Record<Section, HTMLElement>> = {};
	function go(section: Section) {
		if (section === 'guests') guestTab = true;
		if (section === 'who') guestTab = false;
		boxes[section === 'guests' ? 'who' : section]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	// The dish of "Who brings?", by its place in the note.
	let picking = $state<number | null>(null);
	const sheetDish = $derived.by((): SheetDish | null => {
		const one = menu.find((dish) => dish.index === picking);
		if (!one) return null;
		const entry = entryOf(one.dish.path);
		return {
			name: entry ? showName(entry.recipe.title) : one.dish.name,
			person: personOf(one.dish),
			course: one.course,
			scale: one.dish.scale
		};
	});

	// A dish of a different person keeps its course in the line, so the course is not a guess later.
	// The same person is no change, so a person that is a link, such as [[Mum]], stays a link.
	function setPerson(index: number, next: string | null) {
		const one = menu.find((dish) => dish.index === index);
		if (!one || personOf(one.dish) === next) return;
		void kitchen.occasion.changeDish(
			path,
			index,
			next === null ? { person: null } : { person: next, course: one.dish.course ?? one.course }
		);
	}

	async function newPerson(index: number, name: string) {
		await kitchen.occasion.addGuest(path, name);
		setPerson(index, name);
	}

	// A dish from a card of the menu has its course, and nobody brings it yet.
	function addToCourse(course: string, dish: { path: string | null; name: string }) {
		void kitchen.occasion.addDish(path, { ...dish, course, person: OPEN });
	}

	const close = () => (picking = null);
</script>

<section class="wfd-occasion" aria-labelledby={headId}>
	<div><Button kind="link" onclick={() => kitchen.closeOccasion()}>← Occasions</Button></div>
	<h2 class="wfd-hidden" id={headId}>{occasion.name}</h2>

	<OccasionCard {kitchen} {occasion} onpick={go}>
		{#snippet side()}
			<OccasionMenu
				name={occasion.name}
				onopen={() => kitchen.open(path)}
				ondelete={() => void kitchen.occasion.remove(path).then(() => kitchen.closeOccasion())}
			/>
		{/snippet}
	</OccasionCard>

	<div class="wfd-occasion__section" bind:this={boxes.who}>
		<div class="wfd-occasion__tabs" role="group" aria-label="People">
			<Chip label="Who brings" on={!guestTab} onclick={() => (guestTab = false)} />
			<Chip label="Guest list · {comingOf(occasion)}" on={guestTab} onclick={() => (guestTab = true)} />
		</div>
		{#if guestTab}
			<GuestList
				{guests}
				coming={comingOf(occasion)}
				jobsOf={(person) => jobsOf(occasion, person)}
				onadd={(name) => kitchen.occasion.addGuest(path, name)}
				onsize={(name, size) => kitchen.occasion.setGuestSize(path, name, size)}
				onremove={(name) => kitchen.occasion.removeGuest(path, name)}
			/>
		{:else}
			<WhoBrings
				{kitchen}
				{occasion}
				{menu}
				guests={names}
				{offered}
				{entryOf}
				onpick={(index) => (picking = index)}
				{oncook}
			/>
		{/if}
	</div>

	<div class="wfd-occasion__section">
		<GroupHead title="Menu" note={String(occasion.dishes.length)} />
		<MenuCards {menu} {offered} {entryOf} onpick={(index) => (picking = index)} onadd={addToCourse} />
	</div>

	<div class="wfd-occasion__section" bind:this={boxes.buy}>
		<ToBuy rows={toBuy} {listed} {isOnList} onadd={(key) => kitchen.shop.addExtra(key)} />
	</div>

	<div class="wfd-occasion__section" bind:this={boxes.todo}>
		<OccasionTasks
			tasks={occasion.tasks}
			ondone={(index, done) => kitchen.occasion.setTaskDone(path, index, done)}
			onadd={(task) => kitchen.occasion.addTask(path, task)}
		/>
	</div>

	<WhoSheet
		dish={sheetDish}
		guests={names}
		{courses}
		onperson={(person) => {
			if (picking !== null) setPerson(picking, person);
			close();
		}}
		onnewperson={(name) => {
			if (picking !== null) void newPerson(picking, name);
			close();
		}}
		oncourse={(course) => picking !== null && kitchen.occasion.changeDish(path, picking, { course })}
		onscale={(scale) => picking !== null && kitchen.occasion.changeDish(path, picking, { scale })}
		onremove={() => {
			if (picking !== null) void kitchen.occasion.removeDish(path, picking);
			close();
		}}
		onclose={close}
	/>
</section>

<style>
	.wfd-occasion,
	.wfd-occasion__section {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-stack);
	}

	/* The nav sticks at the top, so a section stops below it. */
	.wfd-occasion__section {
		scroll-margin-block-start: calc(var(--wfd-nav-size) + var(--wfd-space-section));
	}

	.wfd-occasion__tabs {
		display: flex;
		gap: var(--wfd-space-group);
		overflow-x: auto;
		scrollbar-width: none;
	}

	/* The name is on the ink card. A screen reader gets it as the head of the section. */
</style>
