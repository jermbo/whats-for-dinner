<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import { byMeal, isForMeal, isFound, type Only, type Sort } from '../../shop/browse';
	import type { BarState } from '../bar-state.svelte';
	import Bar from '../parts/Bar.svelte';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import Count from '../parts/Count.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import PartHead from '../parts/PartHead.svelte';
	import Sticker from '../parts/Sticker.svelte';

	let { kitchen, bar }: { kitchen: Kitchen; bar: BarState<Sort, Only> } = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	const needed = $derived(kitchen.shopping.filter((row) => !kitchen.cart.includes(row.key)));
	const inCart = $derived(kitchen.shopping.filter((row) => kitchen.cart.includes(row.key)));

	const sorts: { value: Sort; label: string }[] = [
		{ value: 'name', label: 'A to Z' },
		{ value: 'meal', label: 'By meal' }
	];

	// The text that finds a row.
	const text = $derived(bar.find.trim());
	// With rows of one kind only, a filter hides nothing. So the filters are there only when the
	// list has rows for a meal and rows of low food.
	const mixed = $derived(
		kitchen.shopping.some(isForMeal) && kitchen.shopping.some((row) => row.low)
	);
	const only = (kind: Only) => mixed && bar.only.has(kind);
	const count = $derived(mixed ? bar.only.size : 0);

	// The bar acts on the rows that you did not put in the cart.
	const shown = $derived(
		needed.filter(
			(row) =>
				isFound(row, bar.find) && (!only('meal') || isForMeal(row)) && (!only('low') || row.low)
		)
	);
	// The sequence by meal has one group for each meal. The sequence by name is one list.
	const groups = $derived(bar.sort === 'meal' ? byMeal(shown) : [{ title: '', rows: shown }]);

	// A piece of the bar gets its width when its row comes on the list, and gives it back after.
	const grow = (_: Element, { duration }: { duration: number }) => ({
		duration,
		css: (t: number) => `flex-grow: ${t}`
	});
</script>

<section class="wfd-shop" aria-label="Shopping list">
	<PartHead title="Shop">
		{#snippet side()}
			{#if kitchen.shopping.length}
				<Count have={inCart.length} of={kitchen.shopping.length} label="in the cart" />
			{/if}
		{/snippet}
	</PartHead>

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
				<Chip label="Low food" on={bar.only.has('low')} onclick={() => bar.flip('low')} />
			{/if}
		{/snippet}
	</Bar>

	{#if kitchen.shopping.length}
		<!-- One piece for each item. A piece is ink when its item is in the cart. -->
		<div class="wfd-shop__pieces" aria-hidden="true">
			{#each kitchen.shopping as row, at (row.key)}
				<span
					class="wfd-shop__piece"
					class:wfd-shop__piece--done={at < inCart.length}
					transition:grow={{ duration }}
				></span>
			{/each}
		</div>
	{:else}
		<p class="wfd-shop__empty">
			{kitchen.meals.length
				? 'The pantry has all that the meals of the week need.'
				: 'The list comes from the plan. Add a meal to the week first.'}
		</p>
	{/if}

	{#if kitchen.low.length || kitchen.shopLow}
		<!--
			Low food is your choice. The check box puts all of it on the list, or takes it off. It is
			not a chip, because a chip only hides rows.
		-->
		<label class="wfd-shop__low">
			<input
				type="checkbox"
				checked={kitchen.shopLow}
				onchange={() => kitchen.toggleShopLow()}
			/>
			Low food on the list{kitchen.low.length ? ` · ${kitchen.low.length}` : ''}
		</label>
	{/if}

	{#if needed.length && !shown.length}
		<div class="wfd-shop__none" aria-live="polite">
			<p class="wfd-shop__empty">
				{#if text && !count}
					No item of the list has "{text}" in its name or in its meals.
				{:else}
					No item {text ? `with "${text}" ` : ''}passes
					{count === 1 ? 'this filter' : 'these filters'}.
				{/if}
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
							<li transition:slide={{ duration }}>
								<!-- One tap on the row puts the item in the cart. -->
								<button
									class="wfd-shop__row"
									type="button"
									onclick={() => kitchen.toggleCart(row.key)}
								>
									<span class="wfd-shop__text">
										<span class="wfd-shop__top">
											<span class="wfd-shop__name">{row.name}</span>
											{#if row.low && row.food?.item.stocks.length}
												<Sticker label="Low" kind="amber" />
											{:else if row.low}
												<Sticker label="Out" kind="dashed" />
											{/if}
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
									<span class="wfd-shop__amount wfd-number">{row.amount}</span>
								</button>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>
	{/key}

	{#if inCart.length}
		<GroupHead title="In the cart" note={String(inCart.length)} />
		<ul class="wfd-shop__list">
			{#each inCart as row (row.key)}
				<li class="wfd-shop__got" transition:slide={{ duration }}>
					<span class="wfd-shop__got-name">{[row.name, row.amount].filter(Boolean).join(' ')}</span>
					<Button kind="link" onclick={() => kitchen.toggleCart(row.key)}>Undo</Button>
				</li>
			{/each}
		</ul>

		<Button kind="olive" onclick={() => kitchen.putAway()}>
			Put {inCart.length} into the pantry <span aria-hidden="true">→</span>
		</Button>
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

	button.wfd-shop__row {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 12px;
		align-items: center;
		inline-size: 100%;
		block-size: auto;
		min-block-size: 64px;
		padding: 10px 0;
		border: 0;
		border-block-end: 1px solid var(--wfd-line);
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

	/* The row of the check box is 44 px high, for the thumb. */
	.wfd-shop__low {
		display: flex;
		gap: 10px;
		align-items: center;
		justify-self: start;
		min-block-size: 44px;
		font-weight: 600;
		cursor: pointer;
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

	.wfd-shop__amount {
		font-size: 18px;
	}

	.wfd-shop__got {
		display: flex;
		gap: 12px;
		align-items: center;
		justify-content: space-between;
		border-block-end: 1px solid var(--wfd-line);
	}

	.wfd-shop__got-name {
		color: var(--wfd-ink-3);
		font-size: 17px;
		font-weight: 600;
		text-decoration: line-through;
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-shop__piece {
			transition: none;
		}
	}
</style>
