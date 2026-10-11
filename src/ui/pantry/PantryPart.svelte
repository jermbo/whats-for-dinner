<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade, slide } from 'svelte/transition';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import type { FoodNote } from '../../note';
	import { levelOf, type Level } from '../../pantry/level';
	import { totalOf } from '../../pantry/total';
	import type { Stock } from '../../pantry/types';
	import {
		byLow,
		byName,
		byPlace,
		bySoon,
		daysLeft,
		isFound,
		isLow,
		isSoon,
		stockRows,
		type StockRow
	} from '../../pantry/views';
	import { showMeasure } from '../../units';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import FindField from '../parts/FindField.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import PartHead from '../parts/PartHead.svelte';
	import StockEditor from './StockEditor.svelte';
	import StockGauge from './StockGauge.svelte';
	import StockLine from './StockLine.svelte';

	let { kitchen }: { kitchen: Kitchen } = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	type Sort = 'place' | 'low' | 'soon' | 'name';
	const sorts: { value: Sort; label: string }[] = [
		{ value: 'place', label: 'By place' },
		{ value: 'low', label: 'Low first' },
		{ value: 'soon', label: 'Use first' },
		{ value: 'name', label: 'A to Z' }
	];
	let sort = $state<Sort>('place');

	// The text that finds a food item.
	let find = $state('');
	// The filters. One is on at a time: a filter that comes on puts the others off.
	type Only = 'low' | 'soon' | 'out';
	let only = $state<Only | null>(null);
	let place = $state<string | null>(null);
	const showOnly = (next: Only) => ((only = only === next ? null : next), (place = null));
	const showPlace = (next: string) => ((place = place === next ? null : next), (only = null));
	// A place goes out of the pantry with its last food. Its filter goes with it.
	const placeOn = $derived(place !== null && kitchen.places.includes(place) ? place : null);

	const all = $derived(stockRows(kitchen.foods));
	// A food item with no row is out. It stays in view, as a reminder to buy it again.
	const allOut = $derived(
		kitchen.foods
			.filter((food) => !food.item.stocks.length)
			.sort((a, b) => a.item.name.localeCompare(b.item.name))
	);
	const soon = $derived(all.filter((row) => isSoon(row.stock, kitchen.today)).length);
	// A food item in two places is low one time.
	const low = $derived(new Set(all.filter(isLow).map((row) => row.food.path)).size);

	const rows = $derived(
		only === 'out'
			? []
			: all.filter(
					(row) =>
						isFound(row.food, find) &&
						(only !== 'low' || isLow(row)) &&
						(only !== 'soon' || isSoon(row.stock, kitchen.today)) &&
						(!placeOn || row.stock.place === placeOn)
				)
	);
	const groups = $derived.by(() => {
		if (sort === 'place') return byPlace(rows);
		if (sort === 'low') return byLow(rows);
		return sort === 'soon' ? bySoon(rows, kitchen.today) : byName(rows);
	});
	// Food that is out has no place, no level, and no date, so the other filters hide it.
	const out = $derived(
		only === 'low' || only === 'soon' || placeOn
			? []
			: allOut.filter((food) => isFound(food, find))
	);

	// The row that is open: the key of a row, the path of a food item that is out, or "new".
	let open = $state<string | null>(null);
	// An open row shows its bar first. The form has the place and the date of one row of the food
	// item: this is the number of that row, or null while the bar shows.
	let form = $state<number | null>(null);
	function toggle(key: string) {
		open = open === key ? null : key;
		form = null;
	}

	// The name that the form for new food starts with.
	let newName = $state('');
	function startNew(name: string) {
		newName = name;
		open = 'new';
	}

	const factsOf = (food: FoodNote) => [
		...(food.item.brands.length ? [`Brands: ${food.item.brands.join(', ')}`] : []),
		...(food.item.aliases.length ? [`Other names: ${food.item.aliases.join(', ')}`] : [])
	];

	const placesOf = (food: FoodNote) => new Set(food.item.stocks.map((stock) => stock.place)).size;

	// In the view by place, the line below the name tells where more of the food is.
	function noteOf({ food, stock }: StockRow) {
		if (sort !== 'place') return stock.place;
		const places = placesOf(food);
		return places > 1 ? `${totalOf(food.item.stocks)} in ${places} places` : '';
	}

	// The count of a group, with the count of its rows that are low.
	function countOf(group: { rows: StockRow[] }) {
		const lowRows = group.rows.filter(isLow).length;
		return lowRows && sort !== 'low' ? `${group.rows.length} · ${lowRows} low` : `${group.rows.length}`;
	}

	// The low line for the form: your own text, and the line of the plugin as a hint.
	const lowOf = (food: FoodNote, level: Level | null) => ({
		text: food.item.low?.text ?? '',
		hint: level ? showMeasure({ kind: level.kind, value: level.low }) : '200 g'
	});

	// The low line is written only when you changed it. The writes go one after the other.
	async function keepLow(food: FoodNote, lowText: string | undefined) {
		if (lowText !== undefined && lowText !== (food.item.low?.text ?? '')) {
			await kitchen.setLow(food.path, lowText);
		}
	}

	// Changes one row of a food item, or removes it.
	async function change(food: FoodNote, at: number, stock: Stock | null, lowText?: string) {
		open = null;
		const stocks = food.item.stocks.flatMap((old, index) =>
			index !== at ? [old] : stock ? [stock] : []
		);
		await kitchen.setStocks(food.path, stocks);
		await keepLow(food, lowText);
	}

	// Writes all rows of a food item, after a change of the bar.
	async function save(food: FoodNote, stocks: Stock[]) {
		open = null;
		await kitchen.setStocks(food.path, stocks);
	}

	async function add(name: string, stock: Stock, food?: FoodNote, lowText?: string) {
		open = null;
		await kitchen.addStock(name, stock);
		if (food) await keepLow(food, lowText);
	}
</script>

<section class="wfd-pantry" aria-label="Pantry">
	<PartHead title="Pantry">
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
		{/snippet}
	</PartHead>

	<div class="wfd-pantry__bar">
		<div class="wfd-pantry__tools">
			<div class="wfd-pantry__find">
				<FindField label="Find food" bind:value={find} />
			</div>

			<div class="wfd-pantry__filters">
				<select class="wfd-pantry__sort" aria-label="Sequence of the pantry" bind:value={sort}>
					{#each sorts as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>

				<div class="wfd-pantry__chips" role="group" aria-label="Filters">
					<Chip label="Low" on={only === 'low'} onclick={() => showOnly('low')} />
					<Chip label="Use soon" on={only === 'soon'} onclick={() => showOnly('soon')} />
					<Chip label="Out" on={only === 'out'} onclick={() => showOnly('out')} />
					{#each kitchen.places as option (option)}
						<Chip label={option} on={placeOn === option} onclick={() => showPlace(option)} />
					{/each}
				</div>
			</div>

			<Button
				kind="main"
				aria-label="Add food"
				onclick={() => (open === 'new' ? (open = null) : startNew(''))}
			>
				<span class="wfd-pantry__plus" aria-hidden="true">+</span>
			</Button>
		</div>
	</div>

	{#if open === 'new'}
		<div transition:slide={{ duration }}>
			<StockEditor
				title="Add to pantry"
				names={kitchen.foods.map(({ item }) => item.name).sort()}
				startName={newName}
				places={kitchen.places}
				onsave={(stock, name) => add(name, stock)}
				oncancel={() => (open = null)}
			/>
		</div>
	{/if}

	{#if !kitchen.foods.length}
		<p class="wfd-pantry__empty">The pantry is empty. Add your first food with the plus button.</p>
	{:else if !rows.length && !out.length}
		<div class="wfd-pantry__none" aria-live="polite">
			{#if find.trim()}
				<p class="wfd-pantry__empty">No food has the name "{find.trim()}".</p>
				{#if open !== 'new'}
					<Button onclick={() => startNew(find.trim())}>Add it to the pantry</Button>
				{/if}
			{:else}
				<p class="wfd-pantry__empty">No food passes this filter.</p>
			{/if}
		</div>
	{/if}

	<!-- Food that is out: a dashed row for each food item. A tap adds the food again. -->
	{#snippet outGroup()}
		{#if out.length}
			<section class="wfd-pantry__group" transition:slide={{ duration }}>
				<GroupHead title="Out" note={String(out.length)} />
				{#each out as food (food.path)}
					<div transition:slide={{ duration }}>
						{#if open === food.path}
							<div class="wfd-pantry__open" transition:slide={{ duration }}>
								<StockEditor
									title={food.item.name}
									places={kitchen.places}
									low={lowOf(food, levelOf(food.item))}
									facts={factsOf(food)}
									onsave={(stock, _, lowText) => add(food.item.name, stock, food, lowText)}
									oncancel={() => (open = null)}
									onopen={() => kitchen.open(food.path)}
								/>
							</div>
						{:else}
							<StockLine
								name={food.item.name}
								note=""
								amount=""
								bar={null}
								days={null}
								soon={false}
								onclick={() => toggle(food.path)}
							/>
						{/if}
					</div>
				{/each}
			</section>
		{/if}
	{/snippet}

	<!-- A new sequence comes in as one block. A filter or a search moves only the rows that change. -->
	{#key sort}
		<div class="wfd-pantry__groups" in:slide={{ duration }}>
			<!-- In the sequence "Low first", the food that is out is the most empty, so it is first. -->
			{#if sort === 'low'}{@render outGroup()}{/if}

			{#each groups as group (group.title)}
				<section class="wfd-pantry__group" transition:slide={{ duration }}>
					<GroupHead title={group.title} note={countOf(group)} />
					{#each group.rows as row (row.key)}
						<div transition:slide={{ duration }}>
							{#if open === row.key}
								<div class="wfd-pantry__open" transition:slide={{ duration }}>
									<!-- A row that the plugin can count opens as a bar that you drag. -->
									{#if row.level && row.bar && form === null}
										<StockGauge
											name={row.food.item.name}
											stocks={row.food.item.stocks}
											at={row.at}
											level={row.level}
											onsave={(stocks) => save(row.food, stocks)}
											ondetails={(at) => (form = at)}
											oncancel={() => (open = null)}
										/>
									{:else}
										<!-- The form is for the place that was on in the bar. -->
										{@const at = form ?? row.at}
										<div in:fade={{ duration }}>
											<StockEditor
												title={row.food.item.name}
												stock={row.food.item.stocks[at] ?? row.stock}
												places={kitchen.places}
												low={lowOf(row.food, row.level)}
												facts={factsOf(row.food)}
												onsave={(stock, _, lowText) => change(row.food, at, stock, lowText)}
												onusedup={() => change(row.food, at, null)}
												oncancel={() => (open = null)}
												onopen={() => kitchen.open(row.food.path)}
											/>
										</div>
									{/if}
								</div>
							{:else}
								<StockLine
									name={row.food.item.name}
									note={noteOf(row)}
									amount={row.stock.amountText}
									bar={row.bar}
									days={daysLeft(row.stock, kitchen.today)}
									soon={isSoon(row.stock, kitchen.today)}
									onclick={() => toggle(row.key)}
								/>
							{/if}
						</div>
					{/each}
				</section>
			{/each}

			{#if sort !== 'low'}{@render outGroup()}{/if}
		</div>
	{/key}
</section>

<style>
	.wfd-pantry {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
	}

	.wfd-pantry__fact {
		display: inline-flex;
		gap: 5px;
		align-items: baseline;
	}

	.wfd-pantry__number {
		font-size: 22px;
	}

	/* The bar asks its own width: a phone gets two rows, and a wide tab gets one row. */
	.wfd-pantry__bar {
		container-type: inline-size;
	}

	.wfd-pantry__tools {
		display: grid;
		grid-template:
			'find add' auto
			'filters filters' auto / minmax(0, 1fr) auto;
		gap: 6px 12px;
		align-items: center;
	}

	.wfd-pantry__find {
		grid-area: find;
	}

	.wfd-pantry__tools > :global(button.wfd-button) {
		grid-area: add;
	}

	/* One row: the sequence stays, and the filters scroll to the side. */
	.wfd-pantry__filters {
		display: flex;
		grid-area: filters;
		gap: 10px;
		align-items: center;
		min-inline-size: 0;
	}

	.wfd-pantry :global(select.wfd-pantry__sort) {
		flex: none;
		min-block-size: 36px;
		padding-inline: 10px 28px;
		font-size: 14px;
		font-weight: 700;
	}

	.wfd-pantry__chips {
		display: flex;
		gap: 8px;
		min-inline-size: 0;
		overflow-x: auto;
		scrollbar-width: none;
	}

	@container (inline-size > 46rem) {
		.wfd-pantry__tools {
			grid-template: 'find filters add' auto / minmax(12rem, 18rem) minmax(0, 1fr) auto;
		}
	}

	.wfd-pantry__plus {
		font-size: 26px;
		line-height: 1;
	}

	.wfd-pantry__none {
		display: grid;
		gap: 10px;
		justify-items: start;
	}

	.wfd-pantry__empty {
		margin: 0;
		color: var(--wfd-ink-2);
	}

	/* On a wide tab, the groups are in columns, so that you see more places at one time. */
	.wfd-pantry__groups {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
		gap: 4px 32px;
		align-items: start;
	}

	.wfd-pantry__open {
		padding-block: 10px;
	}
</style>
