<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import type { FoodNote } from '../../note';
	import { totalOf } from '../../pantry/total';
	import type { Stock } from '../../pantry/types';
	import {
		byName,
		byPlace,
		bySoon,
		daysLeft,
		isSoon,
		stockRows,
		type StockRow
	} from '../../pantry/views';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import PartHead from '../parts/PartHead.svelte';
	import StockEditor from './StockEditor.svelte';
	import StockLine from './StockLine.svelte';

	let { kitchen }: { kitchen: Kitchen } = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	type View = 'place' | 'soon' | 'name';
	const views: { value: View; label: string }[] = [
		{ value: 'place', label: 'By place' },
		{ value: 'soon', label: 'Use soon' },
		{ value: 'name', label: 'A to Z' }
	];
	let view = $state<View>('place');

	const rows = $derived(stockRows(kitchen.foods));
	const groups = $derived(
		view === 'place' ? byPlace(rows) : view === 'soon' ? bySoon(rows, kitchen.today) : byName(rows)
	);
	// A food item with no row is out. It stays in view, as a reminder to buy it again.
	const out = $derived(
		kitchen.foods
			.filter((food) => !food.item.stocks.length)
			.sort((a, b) => a.item.name.localeCompare(b.item.name))
	);
	const soon = $derived(rows.filter((row) => isSoon(row.stock, kitchen.today)).length);

	// The row that is open: the key of a row, the path of a food item that is out, or "new".
	let open = $state<string | null>(null);
	const toggle = (key: string) => (open = open === key ? null : key);

	const factsOf = (food: FoodNote) => [
		...(food.item.brands.length ? [`Brands: ${food.item.brands.join(', ')}`] : []),
		...(food.item.aliases.length ? [`Other names: ${food.item.aliases.join(', ')}`] : [])
	];

	// In the view by place, the line below the name tells where more of the food is.
	function noteOf({ food, stock }: StockRow) {
		if (view !== 'place') return stock.place;
		const places = new Set(food.item.stocks.map((other) => other.place)).size;
		return places > 1 ? `${totalOf(food.item.stocks)} in ${places} places` : '';
	}

	function change({ food, at }: StockRow, stock: Stock | null) {
		const stocks = food.item.stocks.flatMap((old, index) =>
			index !== at ? [old] : stock ? [stock] : []
		);
		void kitchen.setStocks(food.path, stocks);
		open = null;
	}

	function add(name: string, stock: Stock) {
		void kitchen.addStock(name, stock);
		open = null;
	}
</script>

<section class="wfd-pantry" aria-label="Pantry">
	<PartHead title="Pantry">
		{#snippet side()}
			{#if soon}
				<span class="wfd-pantry__fact">
					<span class="wfd-pantry__number wfd-display">{soon}</span>
					<span class="wfd-label">use soon</span>
				</span>
			{/if}
			{#if out.length}
				<span class="wfd-pantry__fact">
					<span class="wfd-pantry__number wfd-display">{out.length}</span>
					<span class="wfd-label">out</span>
				</span>
			{/if}
		{/snippet}
	</PartHead>

	<div class="wfd-pantry__bar">
		<div class="wfd-pantry__views" role="group" aria-label="Sequence of the pantry">
			{#each views as option}
				<Chip label={option.label} on={view === option.value} onclick={() => (view = option.value)} />
			{/each}
		</div>
		<Button kind="main" aria-label="Add food" onclick={() => toggle('new')}>
			<span class="wfd-pantry__plus" aria-hidden="true">+</span>
		</Button>
	</div>

	{#if open === 'new'}
		<div transition:slide={{ duration }}>
			<StockEditor
				title="Add to pantry"
				names={kitchen.foods.map(({ item }) => item.name).sort()}
				places={kitchen.places}
				onsave={(stock, name) => add(name, stock)}
				oncancel={() => (open = null)}
			/>
		</div>
	{/if}

	{#if !kitchen.foods.length}
		<p class="wfd-pantry__empty">The pantry is empty. Add your first food with the plus button.</p>
	{/if}

	{#key view}
		<div class="wfd-pantry__groups" in:slide={{ duration }}>
			{#each groups as group (group.title)}
				<section class="wfd-pantry__group">
					<GroupHead title={group.title} note={String(group.rows.length)} />
					{#each group.rows as row (row.key)}
						{#if open === row.key}
							<div class="wfd-pantry__open" transition:slide={{ duration }}>
								<StockEditor
									title={row.food.item.name}
									stock={row.stock}
									places={kitchen.places}
									facts={factsOf(row.food)}
									onsave={(stock) => change(row, stock)}
									onusedup={() => change(row, null)}
									oncancel={() => (open = null)}
									onopen={() => kitchen.open(row.food.path)}
								/>
							</div>
						{:else}
							<StockLine
								name={row.food.item.name}
								note={noteOf(row)}
								amount={row.stock.amountText}
								days={daysLeft(row.stock, kitchen.today)}
								soon={isSoon(row.stock, kitchen.today)}
								onclick={() => toggle(row.key)}
							/>
						{/if}
					{/each}
				</section>
			{/each}

			{#if out.length}
				<section class="wfd-pantry__group">
					<GroupHead title="Out" note={String(out.length)} />
					{#each out as food (food.path)}
						{#if open === food.path}
							<div class="wfd-pantry__open" transition:slide={{ duration }}>
								<StockEditor
									title={food.item.name}
									places={kitchen.places}
									facts={factsOf(food)}
									onsave={(stock) => add(food.item.name, stock)}
									oncancel={() => (open = null)}
									onopen={() => kitchen.open(food.path)}
								/>
							</div>
						{:else}
							<StockLine
								name={food.item.name}
								note=""
								amount=""
								days={null}
								soon={false}
								onclick={() => toggle(food.path)}
							/>
						{/if}
					{/each}
				</section>
			{/if}
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

	.wfd-pantry__bar {
		display: flex;
		gap: 12px;
		align-items: center;
		justify-content: space-between;
	}

	.wfd-pantry__views {
		display: flex;
		gap: 8px;
		overflow-x: auto;
	}

	.wfd-pantry__plus {
		font-size: 26px;
		line-height: 1;
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
