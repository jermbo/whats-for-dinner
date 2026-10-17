<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { SvelteSet } from 'svelte/reactivity';
	import { slide } from 'svelte/transition';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import { byMeal, byStore, isForMeal, isFound, type Only, type Sort } from '../../shop/browse';
	import { readPrice, showPrice } from '../../shop/price';
	import { proposalsFor } from '../../shop/proposals';
	import type { ShoppingRow } from '../../shop/shopping-list';
	import type { BarState } from '../bar-state.svelte';
	import Bar from '../parts/Bar.svelte';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
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
	const mixed = $derived(needed.some(isForMeal) && needed.some((row) => row.extra));
	const only = (kind: Only) => mixed && bar.only.has(kind);
	const count = $derived(mixed ? bar.only.size : 0);

	const shown = $derived(
		needed.filter(
			(row) =>
				isFound(row, bar.find) &&
				(!only('meal') || isForMeal(row)) &&
				(!only('extra') || row.extra)
		)
	);
	// The sequence by meal has one group for each meal. The sequences by name and by store are one
	// list. With no order of a store, "Store order" is A to Z.
	const groups = $derived.by(() => {
		if (bar.sort === 'meal') return byMeal(shown);
		const rows = bar.sort === 'store' && hasOrder ? byStore(shown, kitchen.storeOrder) : shown;
		return [{ title: '', rows }];
	});

	// When you select a store with an order, the list follows it at once.
	function pickStore(store: string) {
		kitchen.setTripStore(store);
		if (kitchen.storeOrder.size) bar.sort = 'store';
		else if (bar.sort === 'store') bar.sort = 'name';
	}

	// The rows that you ticked, and that are not in the cart yet. You see the tick before the row
	// goes, so that you know that your tap counted.
	const ticked = new SvelteSet<string>();
	const TICK_SHOWS = 180;

	function tick(key: string) {
		if (ticked.has(key)) return;
		ticked.add(key);
		setTimeout(() => kitchen.putInCart(key), prefersReducedMotion.current ? 0 : TICK_SHOWS);
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

	function take(add: () => Promise<void>) {
		bar.find = '';
		void add();
	}

	// What an item usually costs. The total is "about", because the price is for the amount of the
	// receipt.
	const priceOf = (row: ShoppingRow) => readPrice(kitchen.regularOf(row.key));
	const sumOf = (rows: ShoppingRow[]) => rows.reduce((sum, row) => sum + (priceOf(row) ?? 0), 0);
	const priced = $derived(all.some((row) => priceOf(row) !== null));

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
</script>

<section class="wfd-shop" aria-label="Shop">
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
			onadd={(path) => take(() => kitchen.addToCart(path))}
			onaddnew={(name) => take(() => kitchen.addNewToCart(name))}
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
									<span
										class="wfd-shop__box"
										class:wfd-shop__box--ticked={ticked.has(row.key)}
										aria-hidden="true">✓</span
									>
									<span class="wfd-shop__text">
										<span class="wfd-shop__top">
											<span class="wfd-shop__name">{row.name}</span>
											{#if row.extra}<Sticker label="Extra" />{/if}
										</span>
										{#if row.recipes.length}
											<span class="wfd-shop__note">{row.recipes.join(', ')}</span>
										{/if}
										{#if row.food?.item.brands.length}
											<span class="wfd-shop__note">
												Any brand: {row.food.item.brands.join(', ')}
											</span>
										{/if}
									</span>
									<span class="wfd-shop__cost">
										<span class="wfd-shop__amount wfd-number">{row.amount}</span>
										{#if priceOf(row) !== null}
											<span class="wfd-shop__price">{showPrice(kitchen.regularOf(row.key))}</span>
										{/if}
									</span>
								</button>
								{#if row.extra}
									<Button
										kind="link"
										aria-label="Remove {row.name}"
										onclick={() => kitchen.removeExtra(row.key)}
									>
										Remove
									</Button>
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
				onundo={(key) => kitchen.takeOutOfCart(key)}
			/>
		</div>
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
		gap: 12px;
	}

	.wfd-shop__pieces {
		display: flex;
		gap: 4px;
	}

	.wfd-shop__piece {
		flex: 1;
		block-size: 8px;
		background: var(--wfd-track);
		transition: background-color 0.2s ease-out;
	}

	.wfd-shop__piece--done {
		background: var(--wfd-ink);
	}

	.wfd-shop__empty {
		margin: 0;
		color: var(--wfd-ink-2);
	}

	.wfd-shop__list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
		gap: 0 32px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* The row is the button. "Remove" is next to it, because a button cannot be in a button. */
	.wfd-shop__item {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 14px;
		align-items: center;
		border-block-end: 1px solid var(--wfd-line);
	}

	button.wfd-shop__row {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 12px;
		align-items: center;
		inline-size: 100%;
		block-size: auto;
		min-block-size: 64px;
		padding: 10px 0;
		border: 0;
		border-radius: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-ink);
		font-family: inherit;
		text-align: start;
		white-space: normal;
		cursor: pointer;

		&:focus-visible {
			outline: 2px solid var(--wfd-ink);
			outline-offset: -3px;
		}
	}

	/* The box to tick. The tick is there from the start, with no colour, so that it can fade in. */
	.wfd-shop__box {
		display: grid;
		place-items: center;
		inline-size: 26px;
		block-size: 26px;
		border: 2px solid var(--wfd-ink);
		border-radius: var(--wfd-radius-sticker);
		color: transparent;
		font-size: 15px;
		font-weight: 800;
		transition:
			background-color 0.15s ease-out,
			color 0.15s ease-out,
			scale 0.15s ease-out;
	}

	.wfd-shop__box--ticked {
		background: var(--wfd-ink);
		color: var(--wfd-on-ink);
		scale: 1.1;
	}

	.wfd-shop__none {
		display: grid;
		gap: 10px;
		justify-items: start;
	}

	.wfd-shop__groups,
	.wfd-shop__group {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
	}

	.wfd-shop__text {
		display: grid;
		gap: 3px;
	}

	.wfd-shop__top {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 10px;
		align-items: center;
	}

	.wfd-shop__name {
		font-size: 18px;
		font-weight: 600;
	}

	.wfd-shop__name::first-letter {
		text-transform: uppercase;
	}

	.wfd-shop__note {
		color: var(--wfd-ink-2);
		font-size: 14px;
	}

	.wfd-shop__cost {
		display: grid;
		justify-items: end;
		gap: 2px;
	}

	.wfd-shop__amount {
		font-size: 18px;
	}

	.wfd-shop__price {
		color: var(--wfd-ink-2);
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}

	.wfd-shop__totals {
		margin: 0;
		color: var(--wfd-ink-2);
		font-size: 14px;
		font-weight: 600;
		text-align: end;

		& strong {
			color: var(--wfd-ink);
			font-size: 16px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-shop__piece,
		.wfd-shop__box {
			transition: none;
		}
	}
</style>
