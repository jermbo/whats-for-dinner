<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import Chip from './Chip.svelte';
	import type { Kitchen } from './kitchen-state.svelte';
	import type { ShoppingRow } from './shop/shopping-list';

	let { kitchen }: { kitchen: Kitchen } = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	const needed = $derived(kitchen.shopping.filter((row) => !kitchen.cart.includes(row.key)));
	const inCart = $derived(kitchen.shopping.filter((row) => kitchen.cart.includes(row.key)));
	const count = $derived(`${needed.length} ${needed.length === 1 ? 'item' : 'items'} to buy`);
</script>

<!-- One tap on a row moves it between the list and the cart. -->
{#snippet line(row: ShoppingRow, checked: boolean)}
	<li transition:slide={{ duration }}>
		<label class="shop__row" class:shop__row--cart={checked}>
			<input
				class="shop__check"
				type="checkbox"
				{checked}
				onchange={() => kitchen.toggleCart(row.key)}
			/>
			<span class="shop__text">
				<span class="shop__name">{row.name}</span>
				<span class="shop__meta">for {row.recipes.join(', ')}</span>
				{#if row.food?.item.brands.length}
					<span class="shop__brands">
						<span class="shop__meta">Any brand:</span>
						{#each row.food.item.brands as brand}
							<Chip label={brand} />
						{/each}
					</span>
				{/if}
			</span>
			<span class="shop__amount">{row.amount}</span>
		</label>
	</li>
{/snippet}

<section class="shop" aria-label="Shopping list">
	<p class="shop__count" aria-live="polite">{count}</p>

	{#if !kitchen.shopping.length}
		<p class="shop__count">The pantry has all that the meals of the week need.</p>
	{/if}

	<ul class="shop__list">
		{#each needed as row (row.key)}
			{@render line(row, false)}
		{/each}
	</ul>

	{#if inCart.length}
		<h3 class="shop__heading">In the cart</h3>
		<ul class="shop__list">
			{#each inCart as row (row.key)}
				{@render line(row, true)}
			{/each}
		</ul>
		<button class="shop__button mod-cta" type="button" onclick={() => kitchen.putAway()}>
			Put {inCart.length}
			{inCart.length === 1 ? 'item' : 'items'} into the pantry
		</button>
	{/if}
</section>

<style>
	.shop {
		display: grid;
		gap: var(--size-4-3);
	}

	.shop__count {
		margin: 0;
		color: var(--text-muted);
	}

	.shop__list {
		display: grid;
		gap: var(--size-4-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.shop__row {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: var(--size-4-3);
		align-items: center;
		min-block-size: 56px;
		padding: var(--size-4-2) var(--size-4-4);
		border: var(--border-width) solid var(--background-modifier-border);
		border-radius: var(--radius-m);
		background: var(--background-secondary);
		cursor: pointer;
		transition: opacity 0.2s ease-out;

		&:has(:focus-visible) {
			outline: 2px solid var(--interactive-accent);
			outline-offset: 2px;
		}
	}

	.shop__row--cart {
		opacity: 0.6;

		& .shop__name {
			text-decoration: line-through;
		}
	}

	.shop__check {
		margin: 0;
	}

	.shop__text {
		display: grid;
		gap: var(--size-2-2);
	}

	.shop__name {
		font-size: var(--font-ui-medium);
		font-weight: var(--font-semibold);
	}

	.shop__meta {
		color: var(--text-muted);
		font-size: var(--font-ui-smaller);
	}

	.shop__brands {
		display: flex;
		flex-wrap: wrap;
		gap: var(--size-2-2);
		align-items: center;
	}

	.shop__amount {
		font-variant-numeric: tabular-nums;
	}

	.shop__heading {
		margin-block: var(--size-4-3) 0;
		color: var(--text-muted);
		font-size: var(--font-ui-small);
		font-weight: var(--font-semibold);
	}

	.shop__button {
		min-block-size: 44px;
	}

	@media (prefers-reduced-motion: reduce) {
		.shop__row {
			transition: none;
		}
	}
</style>
