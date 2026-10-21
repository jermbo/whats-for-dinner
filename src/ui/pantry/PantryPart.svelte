<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade, slide } from 'svelte/transition';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import type { BrandDraft } from '../../kitchen/brand-actions';
	import type { FoodNote } from '../../note';
	import { fullPackage, nextSize } from '../../pantry/card';
	import { isOut, withFood } from '../../pantry/empty-row';
	import type { StapleLabel } from '../../pantry/staple';
	import type { Stock } from '../../pantry/types';
	import {
		attentionOf,
		byLow,
		byName,
		byPlace,
		bySoon,
		daysLeft,
		isFound,
		isLow,
		isSoon,
		stockRows,
		type Only,
		type Sort,
		type StockRow
	} from '../../pantry/views';
	import type { BarState } from '../bar-state.svelte';
	import Bar from '../parts/Bar.svelte';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import PartHead from '../parts/PartHead.svelte';
	import PartTop from '../parts/PartTop.svelte';
	import AddFood from './AddFood.svelte';
	import Bin from './Bin.svelte';
	import Audit from './Audit.svelte';
	import FoodCard from './FoodCard.svelte';
	import FoodForm from './FoodForm.svelte';
	import OnTheList from './OnTheList.svelte';
	import OutTag from './OutTag.svelte';
	import StockLine from './StockLine.svelte';
	import { scrollToTop } from '../scroll-to-top';

	let { kitchen, bar }: { kitchen: Kitchen; bar: BarState<Sort, Only> } = $props();
	const headId = $props.id();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	const sorts: { value: Sort; label: string }[] = [
		{ value: 'place', label: 'By place' },
		{ value: 'low', label: 'Low first' },
		{ value: 'soon', label: 'Use first' },
		{ value: 'name', label: 'A to Z' }
	];

	// The text that finds a food item.
	const text = $derived(bar.find.trim());
	// Food that is out has no place, no level, and no date. So "Out" and each other filter put
	// each other off.
	function showOnly(next: Only) {
		const on = !bar.only.has(next);
		if (next === 'out' || bar.only.has('out')) bar.clear();
		if (on) bar.only.add(next);
		else bar.only.delete(next);
	}
	function showPlace(next: string) {
		bar.only.delete('out');
		bar.pick(next);
	}
	// A place goes out of the pantry with its last food. Its filter goes with it.
	const placeOn = $derived(bar.one !== null && kitchen.places.includes(bar.one) ? bar.one : null);
	const count = $derived(bar.only.size + (placeOn ? 1 : 0));

	const soonDays = $derived(kitchen.settings.soonDays);

	const all = $derived(stockRows(kitchen.foods));
	// A food item with no package is out. It stays in view, as a reminder to
	// buy it again.
	const allOut = $derived(
		kitchen.foods
			.filter((food) => isOut(food.item))
			.sort((a, b) => a.item.name.localeCompare(b.item.name))
	);
	const soon = $derived(all.filter((row) => isSoon(row, kitchen.today, soonDays)).length);
	// A food item in two places is low one time.
	const low = $derived(new Set(all.filter(isLow).map((row) => row.food.path)).size);

	// A row shows only if it passes the text and each filter that is on.
	const rows = $derived(
		bar.only.has('out')
			? []
			: all.filter(
					(row) =>
						isFound(row.food, bar.find) &&
						(!bar.only.has('low') || isLow(row)) &&
						(!bar.only.has('soon') || isSoon(row, kitchen.today, soonDays)) &&
						(!placeOn || row.place === placeOn)
				)
	);
	const groups = $derived.by(() => {
		if (bar.sort === 'place') return byPlace(rows);
		if (bar.sort === 'low') return byLow(rows);
		return bar.sort === 'soon' ? bySoon(rows, kitchen.today, soonDays) : byName(rows);
	});
	// Food that is out has no place, no level, and no date, so the other filters hide it.
	const out = $derived(
		bar.only.has('low') || bar.only.has('soon') || placeOn
			? []
			: allOut.filter((food) => isFound(food, bar.find))
	);

	// The card that is open: a food item in one place. `add` opens it with a new package, as after
	// "Add to pantry". `form` shows the form of the food item in place of its card.
	type Open = { name: string; place: string; add: boolean; form: boolean };
	let open = $state<Open | null>(null);
	const isOpen = (name: string, place: string) => open?.name === name && open.place === place;
	function toggle(name: string, place: string) {
		open = isOpen(name, place) ? null : { name, place, add: false, form: false };
	}

	// "Add to pantry", and the name that its field starts with.
	let adding = $state(false);
	let newName = $state('');
	function startNew(name: string) {
		newName = name;
		adding = true;
		open = null;
	}

	let auditing = $state(false);

	// Food that is out has no place, so its card opens in the place for new food.
	const outPlace = $derived(kitchen.settings.newPlace.trim() || 'Kitchen');

	const urlFor = (food: FoodNote) => (photo: string) => kitchen.photoUrl(photo, food.path);

	const placesOf = (food: FoodNote) =>
		new Set(withFood(food.item.stocks).map((stock) => stock.place)).size;

	// In the view by place, the line below the name tells that more of the food is elsewhere.
	function noteOf({ food, place }: StockRow) {
		if (bar.sort !== 'place') return place;
		const places = placesOf(food);
		return places > 1 ? `In ${places} places` : '';
	}

	const labelOf = ({ item }: FoodNote): StapleLabel => (item.neverAsk ? 'never' : item.staple);

	const isOnList = (path: string) =>
		kitchen.list.some((row) => row.key === path) || kitchen.cart.some((row) => row.key === path);

	// "Done" of a card writes the rows that changed. A change of a food item to check tells that you
	// looked at it.
	async function write(food: FoodNote, rows: Stock[] | null) {
		if (!rows) return;
		if (!(await kitchen.pantry.changeStocks(food.path, () => rows))) return;
		if (food.item.check) await kitchen.pantry.setCheck(food.path, false);
	}

	// The form writes only what you changed. The writes go one after the other.
	async function saveFood(
		food: FoodNote,
		start: string,
		form: { size: string; staple: StapleLabel; brands: BrandDraft[] }
	) {
		if (open) open = { ...open, form: false };
		if (form.size !== start) await kitchen.pantry.setSize(food.path, form.size);
		if (form.staple !== labelOf(food)) await kitchen.pantry.setStaple(food.path, form.staple);
		if (form.brands.length) await kitchen.brands.saveBrands(food.item.name, form.brands);
	}

	// A known food opens its card with a new package: in the place of the filter, or in the place of
	// its newest package. The filters go, so that the card is in view.
	function addKnown(food: FoodNote) {
		const place = placeOn ?? withFood(food.item.stocks).at(-1)?.place ?? outPlace;
		adding = false;
		bar.clear();
		bar.find = '';
		open = { name: food.item.name, place, add: true, form: false };
	}

	// A new food is a note with one full package. Its card opens when the vault has the note.
	async function addNew(name: string, size: string, place: string) {
		adding = false;
		bar.clear();
		bar.find = '';
		await kitchen.pantry.addStock(name, fullPackage(place, size));
		open = { name, place, add: false, form: false };
	}

	// A card that opens out of view, such as after "Add to pantry", comes into view.
	// An open card moves to the top of the screen, under the head of the part.
	function intoView(node: HTMLElement) {
		scrollToTop(node);
	}
</script>

<section class="wfd-pantry" aria-labelledby={headId}>
	<PartTop>
		<PartHead id={headId} title="Pantry">
			{#snippet side()}
				{#if low}
					<span class="wfd-pantry__fact">
						<span class="wfd-pantry__number wfd-display">{low}</span>
						<span class="wfd-label">low</span>
					</span>
				{/if}
				{#if soon}
					<span class="wfd-pantry__fact">
						<span class="wfd-pantry__number wfd-display">{soon}</span>
						<span class="wfd-label">soon</span>
					</span>
				{/if}
				{#if allOut.length}
					<span class="wfd-pantry__fact">
						<span class="wfd-pantry__number wfd-display">{allOut.length}</span>
						<span class="wfd-label">out</span>
					</span>
				{/if}
				{#if !auditing && kitchen.foods.length}
					<Button kind="link" onclick={() => ((auditing = true), (open = null), (adding = false))}>
						Audit
					</Button>
				{/if}
			{/snippet}
		</PartHead>
		{#if !auditing}
			<Bar
				label="Find food"
				sequence="Sequence of the pantry"
				{sorts}
				{count}
				bind:find={bar.find}
				bind:sort={bar.sort}
				bind:open={bar.open}
			>
				{#snippet chips()}
					<Chip label="Low" on={bar.only.has('low')} onclick={() => showOnly('low')} />
					<Chip label="Use soon" on={bar.only.has('soon')} onclick={() => showOnly('soon')} />
					<Chip label="Out" on={bar.only.has('out')} onclick={() => showOnly('out')} />
					{#each kitchen.places as option (option)}
						<Chip label={option} on={placeOn === option} onclick={() => showPlace(option)} />
					{/each}
				{/snippet}
				{#snippet end()}
					<Button kind="main" onclick={() => (adding ? (adding = false) : startNew(bar.find.trim()))}>
						<span class="wfd-pantry__plus" aria-hidden="true">+</span>
						<span class="wfd-pantry__hidden">Add food</span>
					</Button>
				{/snippet}
			</Bar>
		{/if}
	</PartTop>

	{#if auditing}
		<div in:slide={{ duration }}>
			<Audit
				foods={kitchen.foods}
				settingsPlaces={kitchen.settings.places}
				places={kitchen.places}
				done={kitchen.settings.auditDone}
				onwrite={write}
				onright={(food) => kitchen.pantry.setCheck(food.path, false)}
				onfinish={(place) => kitchen.changeSettings({ auditDone: place })}
				onopen={(path) => kitchen.open(path)}
				onstop={() => (auditing = false)}
			/>
		</div>
	{:else}


	{#if adding}
		<div transition:slide={{ duration }}>
			<AddFood
				foods={kitchen.foods}
				places={kitchen.places}
				startName={newName}
				startPlace={placeOn ?? outPlace}
				onknown={addKnown}
				onnew={addNew}
				oncancel={() => (adding = false)}
			/>
		</div>
	{/if}

	<!-- The card of a food item in one place, or the form of the food item. -->
	{#snippet cardOf(food: FoodNote, place: string)}
		<!-- The card shows at its full height at once, so that no frame needs a new layout of the bins. -->
		<div class="wfd-pantry__open" in:fade={{ duration }} use:intoView>
			{#if open?.form}
				{@const start = nextSize(food.item, place) ?? ''}
				<FoodForm
					item={food.item}
					size={start}
					staple={labelOf(food)}
					urlOf={urlFor(food)}
					onsave={(form) => saveFood(food, start, form)}
					oncancel={() => open && (open = { ...open, form: false })}
					onopen={() => kitchen.open(food.path)}
				/>
			{:else}
				<FoodCard
					item={food.item}
					{place}
					places={kitchen.places}
					addFirst={open?.add}
					ondone={(rows) => ((open = null), write(food, rows))}
					oncancel={() => (open = null)}
					onfood={() => open && (open = { ...open, form: true, add: false })}
				/>
			{/if}
			<OnTheList onList={isOnList(food.path)} onadd={() => kitchen.shop.addExtra(food.path)} />
		</div>
	{/snippet}

	{#if !kitchen.foods.length}
		<p class="wfd-pantry__empty">The pantry is empty. Add your first food with the plus button.</p>
	{:else if !rows.length && !out.length}
		<div class="wfd-pantry__none" aria-live="polite">
			{#if text && !count}
				<p class="wfd-pantry__empty">No food has the name "{text}".</p>
				{#if !adding}
					<Button onclick={() => startNew(text)}>Add it to the pantry</Button>
				{/if}
			{:else}
				<!-- A filter can hide the food that the text names, so the text is not the cause here. -->
				<p class="wfd-pantry__empty">
					No food {text ? `with the name "${text}" ` : ''}passes
					{count === 1 ? 'this filter' : 'these filters'}.
				</p>
				<Button onclick={() => bar.clear()}>Remove the filters</Button>
			{/if}
		</div>
	{/if}

	<!-- Food that is out: a dashed tag for each food item. A tap opens its card, to add it again. -->
	{#snippet outBin(at: number)}
		{#if out.length}
			<div out:slide={{ duration }}>
				<Bin title="Out" count={out.length} out {at}>
					{#each out as food (food.path)}
						{#if isOpen(food.item.name, outPlace)}
							{@render cardOf(food, outPlace)}
						{:else}
							<OutTag name={food.item.name} onclick={() => toggle(food.item.name, outPlace)} />
						{/if}
					{/each}
				</Bin>
			</div>
		{/if}
	{/snippet}

	<!-- A new sequence comes in as new bins. A filter or a search moves only the rows that change. -->
	{#key bar.sort}
		<div class="wfd-pantry__bins" class:wfd-pantry__bins--focus={open !== null}>
			<!-- In the sequence "Low first", the food that is out is the most empty, so it is first. -->
			{#if bar.sort === 'low'}{@render outBin(0)}{/if}

			{#each groups as group, at (group.title)}
				{@const attention = attentionOf(group.rows, kitchen.today, soonDays)}
				<div out:slide={{ duration }}>
					<Bin
						title={group.title}
						count={group.rows.length}
						past={attention.past}
						soon={attention.soon}
						low={bar.sort === 'low' ? 0 : attention.low}
						at={bar.sort === 'low' && out.length ? at + 1 : at}
					>
						{#each group.rows as row (row.key)}
							<div class="wfd-pantry__row" transition:slide={{ duration }}>
								{#if isOpen(row.food.item.name, row.place)}
									{@render cardOf(row.food, row.place)}
								{:else}
									<StockLine
										name={row.food.item.name}
										note={noteOf(row)}
										amount={row.total}
										packages={row.count}
										parts={row.parts}
										bar={row.bar}
										days={daysLeft(row, kitchen.today)}
										soon={isSoon(row, kitchen.today, soonDays)}
										onclick={() => toggle(row.food.item.name, row.place)}
									/>
								{/if}
							</div>
						{/each}
					</Bin>
				</div>
			{/each}

			{#if bar.sort !== 'low'}{@render outBin(groups.length)}{/if}
		</div>
	{/key}
	{/if}
</section>

<style>
	.wfd-pantry {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-stack);
	}

	.wfd-pantry__fact {
		display: inline-flex;
		gap: var(--wfd-space-tight);
		align-items: baseline;
	}

	.wfd-pantry__number {
		font-size: var(--wfd-font-size-title);
	}

	.wfd-pantry__hidden {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.wfd-pantry__plus {
		font-size: var(--wfd-font-size-title);
		line-height: var(--wfd-line-height-single);
	}

	.wfd-pantry__none {
		display: grid;
		gap: var(--wfd-space-stack);
		justify-items: start;
	}

	.wfd-pantry__empty {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}

	/*
	 * The bins flow in columns: a bin starts under the bin before it, so no bin waits for the
	 * height of the bin next to it. A phone has one column.
	 */
	.wfd-pantry__bins {
		columns: 20rem;
		column-gap: var(--wfd-space-section);
	}

	.wfd-pantry__bins > div,
	.wfd-pantry__row {
		transition: opacity var(--wfd-card-motion);
	}

	.wfd-pantry__bins > div {
		break-inside: avoid;
	}

	/*
	 * While a card is open, the other bins step back, and so do the other lines of its bin. Only
	 * their opacity changes, so the browser needs no new layout and no new paint. A hover brings
	 * one forward again.
	 */
	.wfd-pantry__bins--focus > div:not(:has(.wfd-pantry__open)),
	.wfd-pantry__bins--focus > div:has(.wfd-pantry__open) .wfd-pantry__row:not(:has(.wfd-pantry__open)) {
		opacity: 0.45;
	}

	@media (hover: hover) {
		.wfd-pantry__bins--focus > div:hover,
		.wfd-pantry__bins--focus .wfd-pantry__row:hover {
			opacity: 1;
		}
	}

	.wfd-pantry__open {
		padding-block: var(--wfd-space-inset);
	}
</style>
