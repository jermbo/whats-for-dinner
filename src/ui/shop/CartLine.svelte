<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { ShoppingRow } from '../../shop/shopping-list';
	import Button from '../parts/Button.svelte';

	type Props = {
		cart: ShoppingRow[];
		// Puts an item back on the list.
		onundo: (key: string) => void;
	};
	let { cart, onundo }: Props = $props();

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
					<span class="wfd-cart__tick" aria-hidden="true">✓</span>
					<span class="wfd-cart__name">{row.name}</span>
					{#if row.amount}<span class="wfd-cart__amount wfd-number">{row.amount}</span>{/if}
					<Button kind="link" aria-label="Undo {row.name}" onclick={() => onundo(row.key)}>
						Undo
					</Button>
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
		gap: 12px;
		align-items: center;
		inline-size: 100%;
		block-size: auto;
		min-block-size: 52px;
		padding: 0;
		border: 0;
		border-block-end: 2px solid var(--wfd-ink);
		border-radius: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-ink);
		font-family: inherit;
		text-align: start;
		cursor: pointer;

		&:focus-visible {
			outline: 2px solid var(--wfd-ink);
			outline-offset: -3px;
		}
	}

	.wfd-cart__title {
		font-size: 19px;
	}

	/* A count that changes makes a small jump, so that you see that the item arrived. */
	.wfd-cart__count {
		font-size: 19px;
		animation: jump 0.3s ease-out;
	}

	.wfd-cart__arrow {
		inline-size: 20px;
		block-size: 20px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2.5;
		transition: rotate 0.2s ease-out;
	}

	[aria-expanded='true'] .wfd-cart__arrow {
		rotate: 180deg;
	}

	.wfd-cart__items {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
		gap: 0 32px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-cart__item {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto auto;
		gap: 12px;
		align-items: center;
		border-block-end: 1px solid var(--wfd-line);
	}

	.wfd-cart__tick {
		display: grid;
		place-items: center;
		inline-size: 26px;
		block-size: 26px;
		border-radius: var(--wfd-radius-sticker);
		background: var(--wfd-ink);
		color: var(--wfd-on-ink);
		font-size: 15px;
		font-weight: 800;
	}

	.wfd-cart__name {
		font-size: 17px;
		font-weight: 600;
	}

	.wfd-cart__name::first-letter {
		text-transform: uppercase;
	}

	.wfd-cart__amount {
		font-size: 17px;
	}

	@keyframes jump {
		40% {
			translate: 0 -5px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-cart__count {
			animation: none;
		}

		.wfd-cart__arrow {
			transition: none;
		}
	}
</style>
