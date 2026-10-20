<script lang="ts">
	import type { Snippet } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { ShoppingRow } from '../../shop/shopping-list';
	import Button from '../parts/Button.svelte';
	import ListLine from '../parts/ListLine.svelte';

	type Props = {
		cart: ShoppingRow[];
		// The price that you usually pay for an item, or no text.
		priceOf: (key: string) => string;
		// Puts an item back on the list.
		onundo: (key: string) => void;
		// The brand that you took, below the name of an item.
		brands?: Snippet<[ShoppingRow]>;
	};
	let { cart, priceOf, onundo, brands }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	const uid = $props.id();

	// In the store, the list is what you look at. The cart opens only when you check it.
	let open = $state(false);
</script>

<div class="wfd-cart">
	<button
		class="wfd-cart__line"
		type="button"
		aria-expanded={open}
		aria-controls={uid}
		onclick={() => (open = !open)}
	>
		<span class="wfd-cart__title wfd-display">In the cart</span>
		{#key cart.length}
			<span class="wfd-cart__count wfd-number">{cart.length}</span>
		{/key}
		<svg class="wfd-cart__arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 8l5 5 5-5" /></svg>
	</button>

	{#if open}
		<ul class="wfd-cart__items" id={uid} transition:slide={{ duration }}>
			{#each cart as row (row.key)}
				<li class="wfd-cart__item" transition:slide={{ duration }}>
					<ListLine name={row.name} number={row.amount || undefined} numberSmall={priceOf(row.key) || undefined}>
						{#snippet mark()}
							<span class="wfd-cart__tick" aria-hidden="true">✓</span>
						{/snippet}
						{#snippet control()}
							<Button kind="link" aria-label="Undo {row.name}" onclick={() => onundo(row.key)}>
								Undo
							</Button>
						{/snippet}
					</ListLine>
					{#if brands}
						<div class="wfd-cart__brands">{@render brands(row)}</div>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.wfd-cart {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
	}

	button.wfd-cart__line {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto auto;
		gap: var(--wfd-space-stack);
		align-items: center;
		inline-size: 100%;
		block-size: auto;
		min-block-size: var(--wfd-control);
		padding: 0;
		border: 0;
		border-block-end: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		text-align: start;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: -3px;
		}
	}

	.wfd-cart__title {
		font-size: var(--wfd-font-size-title);
	}

	/* A count that changes makes a small jump, so that you see that the item arrived. */
	.wfd-cart__count {
		font-size: var(--wfd-font-size-title);
		animation: jump var(--wfd-motion-move) var(--wfd-ease-out);
	}

	.wfd-cart__arrow {
		inline-size: 20px;
		block-size: 20px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2.5;
		transition: rotate var(--wfd-motion-change) var(--wfd-ease-out);
	}

	[aria-expanded='true'] .wfd-cart__arrow {
		rotate: 180deg;
	}

	.wfd-cart__items {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
		gap: 0 var(--wfd-space-section);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-cart__item {
		--tick-size: 26px;

		display: grid;
		grid-template-columns: minmax(0, 1fr);
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-border);
	}

	/* The photos are below the text of the line, in line with the name. */
	.wfd-cart__brands {
		padding: 0 0 var(--wfd-space-inset) calc(var(--tick-size) + var(--wfd-space-stack));

		&:empty {
			display: none;
		}
	}

	.wfd-cart__tick {
		display: grid;
		place-items: center;
		inline-size: var(--tick-size);
		block-size: var(--tick-size);
		border-radius: var(--wfd-radius-sticker);
		background: var(--wfd-color-selected);
		color: var(--wfd-color-on-selected);
		font-size: var(--wfd-font-size-small);
		font-weight: 800;
	}

	@keyframes jump {
		40% {
			translate: 0 -5px;
		}
	}
</style>
