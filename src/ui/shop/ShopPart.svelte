<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import Button from '../parts/Button.svelte';
	import Count from '../parts/Count.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import PartHead from '../parts/PartHead.svelte';

	let { kitchen }: { kitchen: Kitchen } = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	const needed = $derived(kitchen.shopping.filter((row) => !kitchen.cart.includes(row.key)));
	const inCart = $derived(kitchen.shopping.filter((row) => kitchen.cart.includes(row.key)));
</script>

<section class="wfd-shop" aria-label="Shopping list">
	<PartHead title="Shop">
		{#snippet side()}
			{#if kitchen.shopping.length}
				<Count have={inCart.length} of={kitchen.shopping.length} label="in the cart" />
			{/if}
		{/snippet}
	</PartHead>

	{#if kitchen.shopping.length}
		<!-- One piece for each item. A piece is ink when its item is in the cart. -->
		<div class="wfd-shop__pieces" aria-hidden="true">
			{#each kitchen.shopping as row, at (row.key)}
				<span class="wfd-shop__piece" class:wfd-shop__piece--done={at < inCart.length}></span>
			{/each}
		</div>
	{:else}
		<p class="wfd-shop__empty">
			{kitchen.meals.length
				? 'The pantry has all that the meals of the week need.'
				: 'The list comes from the plan. Add a meal to the week first.'}
		</p>
	{/if}

	<ul class="wfd-shop__list">
		{#each needed as row (row.key)}
			<li transition:slide={{ duration }}>
				<!-- One tap on the row puts the item in the cart. -->
				<button class="wfd-shop__row" type="button" onclick={() => kitchen.toggleCart(row.key)}>
					<span class="wfd-shop__text">
						<span class="wfd-shop__name">{row.name}</span>
						<span class="wfd-shop__note">{row.recipes.join(', ')}</span>
						{#if row.food?.item.brands.length}
							<span class="wfd-shop__brands wfd-label">
								Any brand · {row.food.item.brands.join(' / ')}
							</span>
						{/if}
					</span>
					<span class="wfd-shop__amount wfd-display">{row.amount}</span>
				</button>
			</li>
		{/each}
	</ul>

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
		border-block-end: 1px solid var(--wfd-ink);
		border-radius: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-ink);
		font-family: inherit;
		text-align: start;
		white-space: normal;
		cursor: pointer;

		&:focus-visible {
			outline: 3px solid var(--wfd-olive);
			outline-offset: -3px;
		}
	}

	.wfd-shop__text {
		display: grid;
		gap: 3px;
	}

	.wfd-shop__name {
		font-size: 18px;
		font-weight: 700;
	}

	.wfd-shop__name::first-letter {
		text-transform: uppercase;
	}

	.wfd-shop__note,
	.wfd-shop__brands {
		color: var(--wfd-ink-2);
		font-size: 13px;
	}

	.wfd-shop__brands {
		font-size: 11px;
	}

	.wfd-shop__amount {
		font-size: 26px;
	}

	.wfd-shop__got {
		display: flex;
		gap: 12px;
		align-items: center;
		justify-content: space-between;
		border-block-end: 1px solid var(--wfd-ink-3);
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
