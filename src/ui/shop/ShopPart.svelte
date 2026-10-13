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
	import AddItem from './AddItem.svelte';
	import SuggestionList from './SuggestionList.svelte';

	type Props = {
		kitchen: Kitchen;
		bar: BarState<Sort, Only>;
		// Opens the screen of put away.
		onputaway: () => void;
	};
	let { kitchen, bar, onputaway }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	const needed = $derived(kitchen.list);
	const inCart = $derived(kitchen.cart);
	// Each item of the trip: to buy, or in the cart.
	const all = $derived([...needed, ...inCart]);

	const sorts: { value: Sort; label: string }[] = [
		{ value: 'name', label: 'A to Z' },
		{ value: 'meal', label: 'By meal' }
	];

	// The text that finds a row.
	const text = $derived(bar.find.trim());
	// With rows of one kind only, a filter hides nothing. So the filters are there only when the
	// list has rows for a meal and rows of a choice.
	const mixed = $derived(needed.some(isForMeal) && needed.some((row) => row.choice));
	const only = (kind: Only) => mixed && bar.only.has(kind);
	const count = $derived(mixed ? bar.only.size : 0);

	// The bar acts on the rows that you did not put in the cart.
	const shown = $derived(
		needed.filter(
			(row) =>
				isFound(row, bar.find) &&
				(!only('meal') || isForMeal(row)) &&
				(!only('choice') || row.choice)
		)
	);
	// The sequence by meal has one group for each meal. The sequence by name is one list.
	const groups = $derived(bar.sort === 'meal' ? byMeal(shown) : [{ title: '', rows: shown }]);

	// The field "Add an item" is open.
	let adding = $state(false);

	// A piece of the bar gets its width when its row comes on the list, and gives it back after.
	const grow = (_: Element, { duration }: { duration: number }) => ({
		duration,
		css: (t: number) => `flex-grow: ${t}`
	});
</script>

<section class="wfd-shop" aria-label="Shopping list">
	<PartHead title="Shop">
		{#snippet side()}
			{#if all.length}
				<Count have={inCart.length} of={all.length} label="in the cart" />
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
				<Chip
					label="Your choices"
					on={bar.only.has('choice')}
					onclick={() => bar.flip('choice')}
				/>
			{/if}
		{/snippet}
		{#snippet end()}
			<Button
				kind="main"
				aria-label="Add an item"
				aria-expanded={adding}
				onclick={() => (adding = !adding)}
			>
				<span class="wfd-shop__plus" aria-hidden="true">+</span>
			</Button>
		{/snippet}
	</Bar>

	{#if adding}
		<div transition:slide={{ duration }}>
			<AddItem
				foods={kitchen.foods}
				itemNotes={kitchen.itemNotes}
				onadd={(path) => kitchen.addChoice(path)}
				onaddnew={(name) => kitchen.addNewItem(name)}
			/>
		</div>
	{/if}

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
	{:else}
		<p class="wfd-shop__empty">
			{kitchen.meals.length
				? 'The pantry has all that the meals of the week need.'
				: 'The list comes from the plan. Add a meal to the week first.'}
		</p>
	{/if}

	{#if kitchen.suggestions.length}
		<div transition:slide={{ duration }}>
			<SuggestionList
				suggestions={kitchen.suggestions}
				onadd={(path) => kitchen.addChoice(path)}
				onskip={(path) => kitchen.skip(path)}
			/>
		</div>
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
							<li class="wfd-shop__item" transition:slide={{ duration }}>
								<!-- One tap on the row puts the item in the cart. -->
								<button
									class="wfd-shop__row"
									type="button"
									onclick={() => kitchen.putInCart(row.key)}
								>
									<span class="wfd-shop__text">
										<span class="wfd-shop__top">
											<span class="wfd-shop__name">{row.name}</span>
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
								{#if row.choice}
									<Button
										kind="link"
										aria-label="Remove {row.name}"
										onclick={() => kitchen.removeChoice(row.key)}
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
		<GroupHead title="In the cart" note={String(inCart.length)} />
		<ul class="wfd-shop__list">
			{#each inCart as row (row.key)}
				<li class="wfd-shop__got" transition:slide={{ duration }}>
					<span class="wfd-shop__got-name">{[row.name, row.amount].filter(Boolean).join(' ')}</span>
					<Button kind="link" onclick={() => kitchen.takeOutOfCart(row.key)}>Undo</Button>
				</li>
			{/each}
		</ul>

		<Button kind="main" onclick={onputaway}>
			Put away <span aria-hidden="true">→</span>
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

	.wfd-shop__plus {
		font-size: 26px;
		line-height: 1;
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
		grid-template-columns: 1fr auto;
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
