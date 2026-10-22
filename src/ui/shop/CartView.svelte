<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { ShoppingRow } from '../../shop/shopping-list';
	import { timeOf } from '../motion';

	type Props = {
		cart: ShoppingRow[];
		// The regular price of an item, or no text.
		priceOf: (key: string) => string;
		// Puts an item back on the list. The row has faded when this comes.
		onback: (row: ShoppingRow, from: HTMLElement) => void;
		// The brand that you took, below the name of an item.
		brands?: Snippet<[ShoppingRow]>;
	};
	let { cart, priceOf, onback, brands }: Props = $props();

	let box = $state<HTMLElement>();
	const headId = $props.id();
	const leaving = new SvelteSet<string>();

	// The row fades in its place first. Then it goes, and the rows below glide up.
	function back(row: ShoppingRow, event: MouseEvent) {
		if (leaving.has(row.key) || !(event.currentTarget instanceof HTMLElement)) return;
		const from = event.currentTarget;
		leaving.add(row.key);
		setTimeout(
			() => {
				leaving.delete(row.key);
				onback(row, from);
			},
			box ? timeOf(box, 'move') : 0
		);
	}
</script>

<!--
	The cart fills the stage as a dark view, as the frame of Cook Mode, so that you see at once that
	you are in the cart and not in the list. A row is the list row in reverse: a tap puts it back.
-->
<section class="wfd-cart-view" aria-labelledby={headId} bind:this={box}>
	<header class="wfd-cart-view__head">
		<h3 class="wfd-cart-view__title wfd-display" id={headId}>In the cart</h3>
		<span class="wfd-cart-view__title wfd-number">{cart.length}</span>
	</header>
	{#if cart.length}
		<ul class="wfd-cart-view__rows">
			{#each cart as row (row.key)}
				<li class="wfd-cart-view__item" class:wfd-cart-view__item--leaving={leaving.has(row.key)}>
					<button
						class="wfd-cart-view__row"
						type="button"
						aria-label="Put {row.name} back on the list"
						onclick={(event) => back(row, event)}
					>
						<span class="wfd-cart-view__check" aria-hidden="true">✓</span>
						<span class="wfd-cart-view__name">{row.name}</span>
						<span class="wfd-cart-view__amount">
							<span class="wfd-number">{row.amount}</span>
							{#if priceOf(row.key)}<span class="wfd-cart-view__price">{priceOf(row.key)}</span>{/if}
						</span>
					</button>
					{#if brands}
						<div class="wfd-cart-view__brands">{@render brands(row)}</div>
					{/if}
				</li>
			{/each}
		</ul>
	{:else}
		<p class="wfd-cart-view__empty">The cart is empty.</p>
	{/if}
</section>

<style>
	/* A dark view, with the roles of the frame. */
	.wfd-cart-view {
		--wfd-color-text: var(--wfd-color-on-frame);
		--wfd-color-text-muted: var(--wfd-color-on-frame);
		--wfd-color-border: var(--wfd-color-frame-muted);
		--wfd-color-focus: var(--wfd-color-on-frame);

		display: grid;
		align-content: start;
		gap: var(--wfd-space-stack);
		padding: var(--wfd-space-section) var(--wfd-space-inset);
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-color-frame);
		color: var(--wfd-color-text);
	}

	.wfd-cart-view__head {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: baseline;
		justify-content: space-between;
	}

	.wfd-cart-view__title {
		margin: 0;
		font-size: var(--wfd-font-size-title);
		font-weight: 800;
	}

	.wfd-cart-view__rows {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
		column-gap: var(--wfd-space-section);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-cart-view__item {
		border-block-start: var(--wfd-border-thin) solid var(--wfd-color-border);
		transition: opacity var(--wfd-row-motion);
	}

	.wfd-cart-view__item--leaving {
		opacity: 0;
	}

	button.wfd-cart-view__row {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		gap: var(--wfd-space-stack);
		align-items: center;
		inline-size: 100%;
		block-size: auto;
		min-block-size: var(--wfd-control);
		padding: var(--wfd-space-group) 0;
		border: 0;
		border-radius: 0;
		background: none;
		box-shadow: none;
		color: inherit;
		font-family: inherit;
		font-size: var(--wfd-font-size-name);
		font-weight: 600;
		text-align: start;
		white-space: normal;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: -3px;
		}
	}

	.wfd-cart-view__check {
		display: grid;
		place-items: center;
		inline-size: 28px;
		block-size: 28px;
		border-radius: var(--wfd-radius-pill);
		background: var(--wfd-color-primary);
		color: var(--wfd-color-on-primary);
		font-size: var(--wfd-font-size-text);
		font-weight: 800;
	}

	.wfd-cart-view__name {
		overflow-wrap: anywhere;
	}

	.wfd-cart-view__amount {
		display: grid;
		justify-items: end;
		font-size: var(--wfd-font-size-small);
	}

	.wfd-cart-view__price {
		color: var(--wfd-color-text-muted);
	}

	.wfd-cart-view__brands {
		padding: 0 0 var(--wfd-space-inset) calc(28px + var(--wfd-space-stack));
	}

	.wfd-cart-view__empty {
		margin: 0;
	}
</style>
