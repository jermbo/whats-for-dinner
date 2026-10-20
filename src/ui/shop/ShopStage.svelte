<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { SvelteSet } from 'svelte/reactivity';
	import { slide } from 'svelte/transition';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import { brandAt, brandCell } from '../../shop/bought-brand';
	import type { Only, Sort } from '../../shop/browse';
	import {
		anyRegularPrice,
		filterShopRows,
		regularPriceSum,
		shopHasMixedList,
		shopListGroups
	} from '../../shop/shop-stage-view';
	import { readPrice, showPrice } from '../../shop/price';
	import { proposalsFor } from '../../shop/proposals';
	import type { ShoppingRow } from '../../shop/shopping-list';
	import type { BarState } from '../bar-state.svelte';
	import { tilesOf } from '../brand-tiles';
	import Bar from '../parts/Bar.svelte';
	import BrandPhoto from '../parts/BrandPhoto.svelte';
	import BrandStrip from '../parts/BrandStrip.svelte';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import HiddenName from '../parts/HiddenName.svelte';
	import ListLine from '../parts/ListLine.svelte';
	import Sticker from '../parts/Sticker.svelte';
	import AddToCart from './AddToCart.svelte';
	import CartLine from './CartLine.svelte';
	import StageFoot from './StageFoot.svelte';
	import TripStore from './TripStore.svelte';

	type Props = {
		kitchen: Kitchen;
		bar: BarState<Sort, Only>;
		// Opens the stage Put away.
		onputaway: () => void;
	};
	let { kitchen, bar, onputaway }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	const needed = $derived(kitchen.list);
	const inCart = $derived(kitchen.cart);
	// Each item of the trip: to get, or in the cart.
	const all = $derived([...needed, ...inCart]);

	// A store that has a receipt has its order, so the list can follow it.
	const hasOrder = $derived(kitchen.storeOrder.size > 0);
	const sorts = $derived<{ value: Sort; label: string }[]>([
		{ value: 'name', label: 'A to Z' },
		{ value: 'meal', label: 'By meal' },
		...(hasOrder ? [{ value: 'store' as const, label: 'Store order' }] : [])
	]);

	// The text that finds a row.
	const text = $derived(bar.find.trim());
	// With rows of one kind only, a filter hides nothing. So the filters are there only when the
	// list has rows for a meal and rows of an extra.
	const mixed = $derived(shopHasMixedList(needed));
	const count = $derived(mixed ? bar.only.size : 0);

	const shown = $derived(filterShopRows(needed, bar.find, bar.only, mixed));
	// The sequence by meal has one group for each meal. The sequences by name and by store are one
	// list. With no order of a store, "Store order" is A to Z.
	const groups = $derived.by(() =>
		shopListGroups(shown, bar.sort, hasOrder, kitchen.storeOrder)
	);

	// When you select a store with an order, the list follows it at once.
	function pickStore(store: string) {
		kitchen.shop.setTripStore(store);
		if (kitchen.storeOrder.size) bar.sort = 'store';
		else if (bar.sort === 'store') bar.sort = 'name';
	}

	// The rows that you ticked, and that are not in the cart yet. You see the tick before the row
	// goes, so that you know that your tap counted.
	const ticked = new SvelteSet<string>();
	const TICK_SHOWS = 180;

	// With a brand, the task keeps the brand that you took.
	function tick(key: string, brand?: string) {
		if (ticked.has(key)) return;
		ticked.add(key);
		setTimeout(async () => {
			// The tick goes when the write fails, so that you can tap the row again.
			if (!(await kitchen.shop.putInCart(key, brand))) ticked.delete(key);
		}, prefersReducedMotion.current ? 0 : TICK_SHOWS);
	}

	// --- The photos of the brands. ---

	const urlFor = (row: ShoppingRow) => (photo: string) =>
		kitchen.photoUrl(photo, row.food?.path ?? '');
	const brandsOf = (row: ShoppingRow) => row.food?.item.brands ?? [];

	// The photo that shows large: its row, the name of its file, and the small photo that it grows
	// from. The brand comes from the note, so a new photo gets its brand when the note is read.
	let large = $state<{ key: string; path: string; photo: string; from: HTMLElement } | null>(null);
	const largeBrand = $derived.by(() => {
		const row = large && all.find((one) => one.key === large?.key);
		return row ? brandsOf(row).find((brand) => brand.photos[0] === large?.photo) : undefined;
	});

	function showLarge(row: ShoppingRow, at: number, from: HTMLElement) {
		const photo = brandsOf(row)[at]?.photos[0];
		if (photo && row.food) large = { key: row.key, path: row.food.path, photo, from };
	}

	// "In cart" ticks the row with the brand of the large photo. An item of the cart gets the new
	// brand in place of its own.
	function intoCart() {
		if (!large) return;
		const { key, photo } = large;
		const brand = largeBrand ? brandCell(largeBrand) : `[[${photo}]]`;
		large = null;
		opened.delete(key);
		if (inCart.some((one) => one.key === key)) void kitchen.shop.putInCart(key, brand);
		else tick(key, brand);
	}

	// The photo of a new package is a new brand with no name. It shows large at once, so that "In
	// cart" is one tap away.
	async function takeNew(row: ShoppingRow, photo: Blob, from: HTMLElement) {
		if (!row.food) return;
		const { path } = row.food;
		const name = await kitchen.brands.addBrandPhoto(path, photo);
		if (name) large = { key: row.key, path, photo: name, from };
	}

	// An item of the cart shows only the brand that you took. A tap on it shows each brand again,
	// so that you can take a different one.
	const opened = new SvelteSet<string>();
	function cartBrandOf(row: ShoppingRow): number | null {
		const item = kitchen.trip.find((one) => one.key === row.key);
		return item ? brandAt(item.brand, brandsOf(row)) : null;
	}

	// A row that "Undo" brings back has no tick.
	$effect(() => {
		for (const key of ticked) if (!needed.some((row) => row.key === key)) ticked.delete(key);
	});

	// The text found no row, so it can add an item that is not on the list. With a filter on, the
	// text can be a row that the filter hides, so it adds nothing.
	const proposals = $derived(
		text && !shown.length && !count
			? proposalsFor(text, kitchen.foods, kitchen.itemNotes).filter(
					({ path }) => !all.some((row) => row.key === path)
				)
			: []
	);
	const canAdd = $derived(Boolean(text) && !shown.length && !count);

	function take(add: () => Promise<unknown>) {
		bar.find = '';
		void add();
	}

	// What an item usually costs. The total is "about", because the price is for the amount of the
	// receipt.
	const priceOf = (row: ShoppingRow) => readPrice(kitchen.regularOf(row.key));
	const sumOf = (rows: ShoppingRow[]) =>
		regularPriceSum(rows, (key) => kitchen.regularOf(key), readPrice);
	const priced = $derived(anyRegularPrice(all, (key) => kitchen.regularOf(key), readPrice));

	// --- The screen stays on in the store, if the settings say so. ---

	$effect(() => {
		if (!kitchen.settings.keepScreenOn) return;
		let lock: WakeLockSentinel | undefined;
		const keepOn = async () => {
			try {
				lock = await navigator.wakeLock?.request('screen');
			} catch {
				// The device can refuse, for example when the battery is low.
			}
		};
		// The device releases the lock when the app is not in view.
		const again = () => document.visibilityState === 'visible' && void keepOn();

		void keepOn();
		document.addEventListener('visibilitychange', again);
		return () => {
			document.removeEventListener('visibilitychange', again);
			void lock?.release();
		};
	});

	// A piece of the bar gets its width when its row comes on the list, and gives it back after.
	const grow = (_: Element, { duration }: { duration: number }) => ({
		duration,
		css: (t: number) => `flex-grow: ${t}`
	});

	const uid = $props.id();
</script>

<section class="wfd-shop" aria-labelledby="{uid}-name">
	<HiddenName id="{uid}-name" text="Shop" />
	<TripStore store={kitchen.tripStore} stores={kitchen.stores} onchange={pickStore} />

	<Bar
		label="Find an item or a meal"
		sequence="Sequence of the list"
		{sorts}
		{count}
		bind:find={bar.find}
		bind:sort={bar.sort}
		bind:open={bar.open}
	>
		{#snippet chips()}
			{#if mixed}
				<Chip label="For a meal" on={bar.only.has('meal')} onclick={() => bar.flip('meal')} />
				<Chip label="Extras" on={bar.only.has('extra')} onclick={() => bar.flip('extra')} />
			{/if}
		{/snippet}
	</Bar>

	{#if all.length}
		<!-- One piece for each item, and one piece of ink for each item of the cart. -->
		<div class="wfd-shop__pieces" aria-hidden="true">
			{#each all, at}
				<span
					class="wfd-shop__piece"
					class:wfd-shop__piece--done={at < inCart.length}
					transition:grow={{ duration }}
				></span>
			{/each}
		</div>
	{/if}

	<GroupHead title="To get" note={String(needed.length)} />

	{#if canAdd}
		<AddToCart
			{text}
			{proposals}
			onadd={(path) => take(() => kitchen.shop.addToCart(path))}
			onaddnew={(name) => take(() => kitchen.shop.addNewToCart(name))}
		/>
	{:else if !needed.length}
		<p class="wfd-shop__empty">{inCart.length ? 'Each item is in the cart.' : 'Nothing to get.'}</p>
	{:else if !shown.length}
		<div class="wfd-shop__none" aria-live="polite">
			<p class="wfd-shop__empty">
				No item {text ? `with "${text}" ` : ''}passes
				{count === 1 ? 'this filter' : 'these filters'}.
			</p>
			{#if count}
				<Button onclick={() => bar.clear()}>Remove the filters</Button>
			{/if}
		</div>
	{/if}

	<!-- A new sequence comes in as one block. A filter or a search moves only the rows that change. -->
	{#key bar.sort}
		<div class="wfd-shop__groups" in:slide={{ duration }}>
			{#each groups as group (group.title)}
				<section class="wfd-shop__group" transition:slide={{ duration }}>
					{#if group.title}
						<GroupHead title={group.title} note={String(group.rows.length)} />
					{/if}
					<ul class="wfd-shop__list">
						{#each group.rows as row (row.key)}
							<li class="wfd-shop__item" transition:slide={{ duration }}>
								<!-- One tap on the row puts the item in the cart. -->
								<button
									class="wfd-shop__row"
									type="button"
									aria-pressed={ticked.has(row.key)}
									onclick={() => tick(row.key)}
								>
									<ListLine
										name={row.name}
										small={row.recipes.join(', ') || undefined}
										number={row.amount}
										numberSmall={priceOf(row) !== null ? showPrice(kitchen.regularOf(row.key)) : undefined}
									>
										{#snippet mark()}
											<span
												class="wfd-shop__box"
												class:wfd-shop__box--ticked={ticked.has(row.key)}
												aria-hidden="true">✓</span
											>
										{/snippet}
										{#snippet tag()}
											{#if row.extra}<Sticker label="Extra" />{/if}
										{/snippet}
									</ListLine>
								</button>
								{#if row.extra}
									<Button
										kind="link"
										aria-label="Remove {row.name}"
										onclick={() => kitchen.shop.removeExtra(row.key)}
									>
										Remove
									</Button>
								{/if}
								{#if row.food}
									<div class="wfd-shop__brands">
										<BrandStrip
											brands={tilesOf(brandsOf(row), urlFor(row))}
											of={row.name}
											tapChips={false}
											ontap={(at, tile) => showLarge(row, at, tile)}
											onrest={() => tick(row.key)}
											ontake={(photo, tile) => takeNew(row, photo, tile)}
										/>
									</div>
								{/if}
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>
	{/key}

	{#if inCart.length}
		<div transition:slide={{ duration }}>
			<CartLine
				cart={inCart}
				priceOf={(key) => showPrice(kitchen.regularOf(key))}
				onundo={(key) => kitchen.shop.takeOutOfCart(key)}
			>
				{#snippet brands(row)}
					{@const all = brandsOf(row)}
					{@const chosen = cartBrandOf(row)}
					{@const only = chosen !== null && !opened.has(row.key)}
					{#if all.length}
						<BrandStrip
							brands={tilesOf(chosen !== null && only ? [all[chosen]] : all, urlFor(row))}
							of={row.name}
							tapChips={false}
							ontap={(at, tile) =>
								only ? opened.add(row.key) : showLarge(row, at, tile)}
						/>
					{/if}
				{/snippet}
			</CartLine>
		</div>
	{/if}

	{#if large}
		<BrandPhoto
			url={kitchen.photoUrl(large.photo, large.path)}
			name={largeBrand?.name ?? ''}
			from={large.from}
			onclose={() => (large = null)}
		>
			<Button kind="main" onclick={intoCart}>In cart</Button>
		</BrandPhoto>
	{/if}

	{#if inCart.length || priced}
		<StageFoot>
			{#if priced}
				<p class="wfd-shop__totals">
					About <strong class="wfd-number">{sumOf(inCart).toFixed(2)}</strong> in the cart ·
					<strong class="wfd-number">{sumOf(all).toFixed(2)}</strong> in all
				</p>
			{/if}
			{#if inCart.length}
				<Button kind="main" onclick={onputaway}>
					Put away {inCart.length} <span aria-hidden="true">→</span>
				</Button>
			{/if}
		</StageFoot>
	{/if}
</section>

<style>
	.wfd-shop {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-stack);
	}

	.wfd-shop__pieces {
		display: flex;
		gap: var(--wfd-space-tight);
	}

	.wfd-shop__piece {
		flex: 1;
		block-size: 8px;
		background: var(--wfd-color-track);
		transition: background-color var(--wfd-motion-change) var(--wfd-ease-out);
	}

	.wfd-shop__piece--done {
		background: var(--wfd-color-selected);
	}

	.wfd-shop__empty {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}

	.wfd-shop__list {
		--box-size: 26px;

		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
		gap: 0 var(--wfd-space-section);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* The row is the button. "Remove" is next to it, because a button cannot be in a button. */
	.wfd-shop__item {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: var(--wfd-space-section);
		align-items: center;
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-border);
	}

	button.wfd-shop__row {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: center;
		inline-size: 100%;
		block-size: auto;
		min-block-size: 64px;
		padding: var(--wfd-space-inset) 0;
		border: 0;
		border-radius: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		text-align: start;
		white-space: normal;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: -3px;
		}
	}

	/* The box to tick. The tick is there from the start, with no colour, so that it can fade in. */
	.wfd-shop__box {
		display: grid;
		place-items: center;
		inline-size: var(--box-size);
		block-size: var(--box-size);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-sticker);
		color: transparent;
		font-size: var(--wfd-font-size-text);
		font-weight: 800;
		transition:
			background-color var(--wfd-chip-motion),
			color var(--wfd-chip-motion),
			scale var(--wfd-chip-motion);
	}

	.wfd-shop__box--ticked {
		background: var(--wfd-color-selected);
		color: var(--wfd-color-on-selected);
		scale: 1.1;
	}

	.wfd-shop__none {
		display: grid;
		gap: var(--wfd-space-stack);
		justify-items: start;
	}

	.wfd-shop__groups,
	.wfd-shop__group {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
	}

	/* The photos are below the text of the row, in line with the name. */
	.wfd-shop__brands {
		grid-column: 1 / -1;
		padding: 0 0 var(--wfd-space-inset) calc(var(--box-size) + var(--wfd-space-stack));
	}

	.wfd-shop__totals {
		margin: 0;
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
		font-weight: 600;
		text-align: end;

		& strong {
			color: var(--wfd-color-text);
			font-size: var(--wfd-font-size-text);
		}
	}
</style>
