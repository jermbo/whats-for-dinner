<script lang="ts">
	import { flushSync } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
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
	import { flyTo } from '../fly';
	import { glide, glideOnNextChange } from '../glide';
	import { timeOf } from '../motion';
	import Bar from '../parts/Bar.svelte';
	import BrandPhoto from '../parts/BrandPhoto.svelte';
	import BrandStrip from '../parts/BrandStrip.svelte';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import HiddenName from '../parts/HiddenName.svelte';
	import AddToCart from './AddToCart.svelte';
	import CartView from './CartView.svelte';
	import type { ShopMoves } from './shop-moves.svelte';
	import ShopBin from './ShopBin.svelte';
	import ShopRow from './ShopRow.svelte';
	import StageFoot from './StageFoot.svelte';
	import TripStore from './TripStore.svelte';
	import UndoBar from './UndoBar.svelte';

	type Props = {
		kitchen: Kitchen;
		bar: BarState<Sort, Only>;
		moves: ShopMoves;
		// The list, or the cart. The shelf and the cart in the top of the part change it.
		view: 'list' | 'cart';
		// Opens the stage Put away.
		onputaway: (event: MouseEvent) => void;
		// A name landed on the shelf or on the cart.
		onland: (on: 'shelf' | 'cart') => void;
	};
	let { kitchen, bar, moves, view, onputaway, onland }: Props = $props();

	const needed = $derived(moves.list);
	const inCart = $derived(moves.cart);
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
	// The sequence by meal has one bin for each meal. The sequences by name and by store are one
	// bin. With no order of a store, "Store order" is A to Z.
	const groups = $derived.by(() =>
		shopListGroups(shown, bar.sort, hasOrder, kitchen.storeOrder)
	);

	// When you select a store with an order, the list follows it at once.
	function pickStore(store: string) {
		kitchen.shop.setTripStore(store);
		if (kitchen.storeOrder.size) bar.sort = 'store';
		else if (bar.sort === 'store') bar.sort = 'name';
	}

	// --- The tick, and the way back. ---

	let listBox = $state<HTMLElement>();
	const change = (next: () => void) =>
		glide(listBox, '.wfd-shop__bin, .wfd-shop__item', () => flushSync(next));
	const tabOf = (node: Element | undefined) => node?.closest<HTMLElement>('.wfd') ?? null;
	const middleOf = (node: Element | null | undefined) => {
		const box = node?.getBoundingClientRect();
		return box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : null;
	};
	const checkOf = (key: string) =>
		listBox?.querySelector(`[data-row="${CSS.escape(key)}"] [data-check]`);
	const buttonOf = (on: 'shelf' | 'cart') =>
		tabOf(listBox)?.querySelector(`[data-fly="${on}"]`);

	// The name of an item flies from one point to the shelf or the cart, or to the check of its row.
	function fly(name: string, from: { x: number; y: number } | null, to: Element | null | undefined, onlanded = () => {}) {
		const tab = tabOf(listBox);
		if (tab && from) flyTo(tab, from, to, name, onlanded);
		else onlanded();
	}

	// The row fades after one press, in one move. Then it leaves, and the vault gets the tick.
	const fadeTime = () => (listBox ? timeOf(listBox, 'press') + timeOf(listBox, 'move') : 0);

	// With a brand, the task keeps the brand that you took.
	function tick(row: ShoppingRow, brand?: string) {
		const { key } = row;
		if (moves.ticking.has(key)) return untick(row);
		navigator.vibrate?.(8);
		moves.ticking.add(key);
		moves.flying.add(key);
		fly(row.name, middleOf(checkOf(key)), buttonOf('cart'), () => {
			moves.flying.delete(key);
			onland('cart');
		});
		showUndo(row);
		setTimeout(() => {
			if (!moves.ticking.has(key)) return;
			change(() => {
				moves.ticking.delete(key);
				moves.move(row, 'cart');
			});
			// The row comes back when the write fails, so that you can tap it again.
			void kitchen.shop.putInCart(key, brand).then((done) => done || moves.forget(key));
		}, fadeTime());
	}

	// A second tap while the row fades: the item stays on the list.
	function untick(row: ShoppingRow) {
		moves.ticking.delete(row.key);
		if (last?.key === row.key) last = null;
		fly(row.name, middleOf(buttonOf('cart')), checkOf(row.key));
	}

	// The item goes from the cart back to the list. Its row comes back with its tick for one moment.
	function putBack(row: ShoppingRow) {
		moves.back.add(row.key);
		moves.move(row, 'list');
		void kitchen.shop.takeOutOfCart(row.key).then((done) => done || moves.forget(row.key));
	}

	// --- The undo bar: the last tick, for a few seconds, under the thumb. ---

	const UNDO_SHOWS = 4000;
	let last = $state<ShoppingRow | null>(null);
	let undoTimer: ReturnType<typeof setTimeout> | undefined;
	function showUndo(row: ShoppingRow) {
		clearTimeout(undoTimer);
		last = row;
		undoTimer = setTimeout(() => (last = null), UNDO_SHOWS);
	}

	function undo() {
		const row = last;
		if (!row) return;
		last = null;
		if (moves.ticking.has(row.key)) return untick(row);
		change(() => putBack(row));
		fly(row.name, middleOf(buttonOf('cart')), checkOf(row.key));
	}

	// An extra that you remove leaves when the vault has the change. The rows below glide up then.
	function remove(key: string) {
		glideOnNextChange(listBox, '.wfd-shop__bin, .wfd-shop__item');
		void kitchen.shop.removeExtra(key);
	}

	// A tap on a row of the cart view. The row has faded, so the rows below it glide up.
	function backFromCart(row: ShoppingRow, from: HTMLElement) {
		fly(row.name, middleOf(from), buttonOf('shelf'), () => onland('shelf'));
		putBack(row);
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
		const row = all.find((one) => one.key === key);
		if (inCart.some((one) => one.key === key)) void kitchen.shop.putInCart(key, brand);
		else if (row) tick(row, brand);
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
	const priceOf = (key: string) => showPrice(kitchen.regularOf(key));
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

	const uid = $props.id();
</script>

<section class="wfd-shop" aria-labelledby="{uid}-name">
	<HiddenName id="{uid}-name" text="Shop" />

	{#if view === 'list'}
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

		<!-- The bins flow down in columns, as the bins of the Pantry. -->
		<div class="wfd-shop__bins" bind:this={listBox}>
			{#each groups as group (group.title)}
				<div class="wfd-shop__bin" data-glide-surface>
					<ShopBin title={group.title || 'To get'} count={group.rows.length}>
						{#each group.rows as row (row.key)}
							<li class="wfd-shop__item" data-row={row.key}>
								<ShopRow
									{row}
									price={priceOf(row.key)}
									ticked={moves.ticking.has(row.key)}
									back={moves.back.has(row.key)}
									ontick={() => tick(row)}
									onback={() => moves.back.delete(row.key)}
									onremove={row.extra ? () => remove(row.key) : undefined}
								>
									{#snippet brands()}
										{#if row.food}
											<BrandStrip
												brands={tilesOf(brandsOf(row), urlFor(row))}
												of={row.name}
												tapChips={false}
												ontap={(at, tile) => showLarge(row, at, tile)}
												onrest={() => tick(row)}
												ontake={(photo, tile) => takeNew(row, photo, tile)}
											/>
										{/if}
									{/snippet}
								</ShopRow>
							</li>
						{/each}
					</ShopBin>
				</div>
			{/each}
		</div>
	{:else}
		<CartView cart={inCart} {priceOf} onback={backFromCart}>
			{#snippet brands(row)}
				{@const all = brandsOf(row)}
				{@const chosen = cartBrandOf(row)}
				{@const only = chosen !== null && !opened.has(row.key)}
				{#if all.length}
					<BrandStrip
						brands={tilesOf(chosen !== null && only ? [all[chosen]] : all, urlFor(row))}
						of={row.name}
						tapChips={false}
						ontap={(at, tile) => (only ? opened.add(row.key) : showLarge(row, at, tile))}
					/>
				{/if}
			{/snippet}
		</CartView>
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

	{#if view === 'list' && last}
		<StageFoot>
			<UndoBar name={last.name} onundo={undo} />
		</StageFoot>
	{:else if view === 'cart' && (inCart.length || priced)}
		<StageFoot>
			{#if priced}
				<p class="wfd-shop__totals">
					About <strong class="wfd-number">{sumOf(inCart).toFixed(2)}</strong> in the cart ·
					<strong class="wfd-number">{sumOf(all).toFixed(2)}</strong> in all
				</p>
			{/if}
			{#if inCart.length}
				<Button kind="olive" arrow onclick={onputaway}>Put away {inCart.length}</Button>
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

	.wfd-shop__empty {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}

	.wfd-shop__none {
		display: grid;
		gap: var(--wfd-space-stack);
		justify-items: start;
	}

	/* The bins flow down in columns, as the bins of the Pantry, one column on a phone. */
	.wfd-shop__bins {
		columns: 20rem;
		column-gap: var(--wfd-space-section);
	}

	.wfd-shop__bin {
		break-inside: avoid;
		margin-block-end: var(--wfd-space-section);
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
