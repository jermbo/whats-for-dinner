<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade, slide } from 'svelte/transition';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import type { BrandDraft } from '../../kitchen/brand-actions';
	import type { FoodNote } from '../../note';
	import { changeRows, isOut, withFood } from '../../pantry/empty-row';
	import { levelOf, type Level } from '../../pantry/level';
	import { barOf as packageBarOf, lastPackage, stockAt } from '../../pantry/open-line';
	import type { StapleLabel } from '../../pantry/staple';
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
		type Only,
		type Sort,
		type StockRow
	} from '../../pantry/views';
	import { withPackage } from '../../pantry/write';
	import { showLike } from '../../units';
	import type { BarState } from '../bar-state.svelte';
	import Bar from '../parts/Bar.svelte';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import PartHead from '../parts/PartHead.svelte';
	import OnTheList from './OnTheList.svelte';
	import StockEditor from './StockEditor.svelte';
	import PackageGauge from './PackageGauge.svelte';
	import StockLine from './StockLine.svelte';

	let { kitchen, bar }: { kitchen: Kitchen; bar: BarState<Sort, Only> } = $props();

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
	const lowPercent = $derived(kitchen.settings.lowPercent);

	const all = $derived(stockRows(kitchen.foods, lowPercent));
	// A food item with no row, or with only empty rows, is out. It stays in view, as a reminder to
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

	// The line that is open: the key of a line, the path of a food item that is out, or "new".
	let open = $state<string | null>(null);
	// An open line shows its packages first. The form has the place, the date, and the size of one
	// package: this is the number of its row, or null while the packages show.
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

	const factsOf = (food: FoodNote) =>
		food.item.aliases.length ? [`Other names: ${food.item.aliases.join(', ')}`] : [];

	const urlFor = (food: FoodNote) => (photo: string) => kitchen.photoUrl(photo, food.path);

	const placesOf = (food: FoodNote) =>
		new Set(withFood(food.item.stocks).map((stock) => stock.place)).size;

	// In the view by place, the line below the name tells where more of the food is.
	function noteOf({ food, place }: StockRow) {
		if (bar.sort !== 'place') return place;
		const places = placesOf(food);
		return places > 1 ? `${totalOf(food.item.stocks)} in ${places} places` : '';
	}

	// The count of a group, with the count of its rows that are low.
	function countOf(group: { rows: StockRow[] }) {
		const lowRows = group.rows.filter(isLow).length;
		return lowRows && bar.sort !== 'low'
			? `${group.rows.length} · ${lowRows} low`
			: `${group.rows.length}`;
	}

	// The low line for the form: your own text, and the line of the plugin as a hint.
	const lowOf = (food: FoodNote, level: Level | null) => ({
		text: food.item.low?.text ?? '',
		hint: level
			? showLike({ kind: level.kind, value: level.low }, food.item.full?.unit ?? null)
			: '200 g'
	});

	// What the form tells about the food item, and not about one row.
	type Labels = { low: string; staple: StapleLabel };

	const labelOf = ({ item }: FoodNote): StapleLabel => (item.neverAsk ? 'never' : item.staple);

	// The low line and the kind are written only when you changed them. The writes go one after the
	// other.
	async function keepLabels(food: FoodNote, labels: Labels | undefined) {
		if (!labels) return;
		if (labels.low !== (food.item.low?.text ?? '')) await kitchen.setLow(food.path, labels.low);
		if (labels.staple !== labelOf(food)) await kitchen.setStaple(food.path, labels.staple);
	}

	const isOnList = (path: string) =>
		kitchen.list.some((row) => row.key === path) || kitchen.cart.some((row) => row.key === path);

	// Changes one package of a food item. The brands of the form go after the row.
	async function change(
		food: FoodNote,
		at: number,
		stock: Stock,
		labels?: Labels,
		brands: BrandDraft[] = []
	) {
		open = null;
		await kitchen.changeStocks(food.path, (stocks) => changeRows(stocks, [{ at, stock }]));
		await keepLabels(food, labels);
		if (brands.length) await kitchen.saveBrands(food.item.name, brands);
	}

	// "Used up" in the form makes the package an empty row.
	function usedUp(food: FoodNote, at: number) {
		const stock = food.item.stocks[at];
		if (stock) void change(food, at, stockAt(stock, packageBarOf({ stock, at }), 0));
	}

	// The packages of the open line: your drags, and the new sealed packages.
	async function write(
		food: FoodNote,
		changes: { at: number; stock: Stock }[],
		added: Stock[],
		close: boolean
	) {
		if (close) open = null;
		await kitchen.changeStocks(food.path, (stocks) =>
			added.reduce(withPackage, changeRows(stocks, changes))
		);
	}

	const canOpen = (row: StockRow) => row.packages.some(({ stock }) => stock.amount && stock.size);

	// A new food item gets its note from the row, so its brands go after it.
	async function add(
		name: string,
		stock: Stock,
		brands: BrandDraft[],
		food?: FoodNote,
		labels?: Labels
	) {
		open = null;
		await kitchen.addStock(name, stock);
		if (food) await keepLabels(food, labels);
		if (brands.length) await kitchen.saveBrands(name, brands);
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
			<Button
				kind="main"
				aria-label="Add food"
				onclick={() => (open === 'new' ? (open = null) : startNew(''))}
			>
				<span class="wfd-pantry__plus" aria-hidden="true">+</span>
			</Button>
		{/snippet}
	</Bar>

	{#if open === 'new'}
		<div transition:slide={{ duration }}>
			<StockEditor
				units={kitchen.settings.units}
				title="Add to pantry"
				names={kitchen.foods.map(({ item }) => item.name).sort()}
				startName={newName}
				places={kitchen.places}
				onsave={(stock, name, _, brands) => add(name, stock, brands)}
				oncancel={() => (open = null)}
			/>
		</div>
	{/if}

	{#if !kitchen.foods.length}
		<p class="wfd-pantry__empty">The pantry is empty. Add your first food with the plus button.</p>
	{:else if !rows.length && !out.length}
		<div class="wfd-pantry__none" aria-live="polite">
			{#if text && !count}
				<p class="wfd-pantry__empty">No food has the name "{text}".</p>
				{#if open !== 'new'}
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
									units={kitchen.settings.units}
									title={food.item.name}
									places={kitchen.places}
									low={lowOf(food, levelOf(food.item, lowPercent))}
									staple={labelOf(food)}
									facts={factsOf(food)}
									brands={food.item.brands}
									urlOf={urlFor(food)}
									loose={food.item.loose}
									onloose={(on) => kitchen.setLoose(food.path, on)}
									onsave={(stock, _, labels, brands) =>
										add(food.item.name, stock, brands, food, labels)}
									oncancel={() => (open = null)}
									onopen={() => kitchen.open(food.path)}
								/>
								<OnTheList
									onList={isOnList(food.path)}
									onadd={() => kitchen.addExtra(food.path)}
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
	{#key bar.sort}
		<div class="wfd-pantry__groups" in:slide={{ duration }}>
			<!-- In the sequence "Low first", the food that is out is the most empty, so it is first. -->
			{#if bar.sort === 'low'}{@render outGroup()}{/if}

			{#each groups as group (group.title)}
				<section class="wfd-pantry__group" transition:slide={{ duration }}>
					<GroupHead title={group.title} note={countOf(group)} />
					{#each group.rows as row (row.key)}
						<div transition:slide={{ duration }}>
							{#if open === row.key}
								<div class="wfd-pantry__open" transition:slide={{ duration }}>
									<!-- A line that the plugin can count opens as its packages. -->
									{#if canOpen(row) && form === null}
										<PackageGauge
											name={row.food.item.name}
											place={row.place}
											packages={row.packages}
											loose={row.food.item.loose}
											level={row.level}
											last={lastPackage(row.food.item.stocks, row.place)}
											onwrite={(changes, added, close) => write(row.food, changes, added, close)}
											ondetails={(at) => (form = at)}
											oncancel={() => (open = null)}
										/>
									{:else}
										<!-- The form is for one package of the line. -->
										{@const at = form ?? row.packages[0].at}
										<div in:fade={{ duration }}>
											<StockEditor
												units={kitchen.settings.units}
												title={row.food.item.name}
												stock={row.food.item.stocks[at] ?? row.packages[0].stock}
												places={kitchen.places}
												low={lowOf(row.food, row.level)}
												staple={labelOf(row.food)}
												facts={factsOf(row.food)}
												brands={row.food.item.brands}
												urlOf={urlFor(row.food)}
												loose={row.food.item.loose}
												onloose={(on) => kitchen.setLoose(row.food.path, on)}
												onsave={(stock, _, labels, brands) =>
													change(row.food, at, stock, labels, brands)}
												onusedup={() => usedUp(row.food, at)}
												oncancel={() => (open = null)}
												onopen={() => kitchen.open(row.food.path)}
											/>
										</div>
									{/if}
									<OnTheList
										onList={isOnList(row.food.path)}
										onadd={() => kitchen.addExtra(row.food.path)}
									/>
								</div>
							{:else}
								<StockLine
									name={row.food.item.name}
									note={noteOf(row)}
									amount={row.total}
									packages={row.packages.length}
									bar={row.bar}
									days={daysLeft(row, kitchen.today)}
									soon={isSoon(row, kitchen.today, soonDays)}
									onclick={() => toggle(row.key)}
								/>
							{/if}
						</div>
					{/each}
				</section>
			{/each}

			{#if bar.sort !== 'low'}{@render outGroup()}{/if}
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
