<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { ShoppingRow } from '../../shop/shopping-list';
	import Button from '../parts/Button.svelte';
	import ListLine from '../parts/ListLine.svelte';
	import Sticker from '../parts/Sticker.svelte';

	type Props = {
		row: ShoppingRow;
		// The regular price, or no text.
		price: string;
		// Ticked: the check is full, and the row fades in its place.
		ticked: boolean;
		// The row came back from the cart: it shows its tick for one moment.
		back: boolean;
		ontick: () => void;
		onback: () => void;
		onremove?: () => void;
		brands?: Snippet;
	};
	let { row, price, ticked, back, ontick, onback, onremove, brands }: Props = $props();

	// A row that comes back starts ticked for one frame, so that the tick can go back.
	let settled = $state(false);
	onMount(() => {
		const frame = requestAnimationFrame(() => (settled = true));
		const timer = back ? setTimeout(onback, 400) : undefined;
		return () => (cancelAnimationFrame(frame), clearTimeout(timer));
	});
	const shown = $derived(ticked || (back && !settled));
</script>

<!--
	One tap ticks the row. The row has its own answer to the finger, the check, so the press of the
	kitchen stays off it: a circle across a long row looked forced.
-->
<div class="wfd-shop-row" class:wfd-shop-row--ticked={shown} class:wfd-shop-row--leaving={ticked}>
	<button
		class="wfd-shop-row__tick"
		type="button"
		aria-pressed={ticked}
		onpointerdown={(event) => event.stopPropagation()}
		onclick={ontick}
	>
		<ListLine
			name={row.name}
			small={row.recipes.join(', ') || undefined}
			number={row.amount || undefined}
			numberSmall={price || undefined}
		>
			{#snippet mark()}
				<span class="wfd-shop-row__check" data-check aria-hidden="true">
					<span class="wfd-shop-row__fill"></span>
					<svg class="wfd-shop-row__mark" viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9" /></svg>
				</span>
			{/snippet}
			{#snippet tag()}
				{#if row.extra}<Sticker label="Extra" />{/if}
			{/snippet}
		</ListLine>
	</button>
	{#if onremove}
		<Button kind="plain" mark="✕" aria-label="Remove {row.name}" onclick={onremove}>Remove</Button>
	{/if}
	{#if brands}
		<div class="wfd-shop-row__brands">{@render brands()}</div>
	{/if}
</div>

<style>
	/* The row is the button. "Remove" is next to it, because a button cannot be in a button. */
	.wfd-shop-row {
		--box-size: 28px;

		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: var(--wfd-space-group);
		align-items: center;
		transition: opacity var(--wfd-row-motion);
	}

	/* A ticked row fades in its place. It leaves after the fade, so the rows below glide up. */
	.wfd-shop-row--leaving {
		opacity: 0;
		transition-delay: var(--wfd-motion-press);
	}

	button.wfd-shop-row__tick {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
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
		-webkit-tap-highlight-color: transparent;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: -3px;
		}
	}

	/* The check answers the finger at once: it gets a bit smaller under it. */
	.wfd-shop-row__check {
		position: relative;
		display: grid;
		place-items: center;
		inline-size: var(--box-size);
		block-size: var(--box-size);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-pill);
		transition:
			scale var(--wfd-button-motion),
			border-color var(--wfd-chip-motion);
	}

	button.wfd-shop-row__tick:active .wfd-shop-row__check {
		scale: 0.88;
	}

	.wfd-shop-row__fill {
		position: absolute;
		inset: calc(-1 * var(--wfd-border));
		border-radius: inherit;
		background: var(--wfd-color-primary);
		scale: 0;
		transition: scale var(--wfd-chip-motion);
	}

	/* The mark draws itself, after the fill has started. */
	.wfd-shop-row__mark {
		position: relative;
		inline-size: 18px;
		block-size: 18px;
		fill: none;
		stroke: var(--wfd-color-on-primary);
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 20;
		stroke-dashoffset: 20;
		transition: stroke-dashoffset var(--wfd-chip-motion);
	}

	.wfd-shop-row--ticked .wfd-shop-row__check {
		border-color: var(--wfd-color-primary);
	}

	.wfd-shop-row--ticked .wfd-shop-row__fill {
		scale: 1;
	}

	.wfd-shop-row--ticked .wfd-shop-row__mark {
		stroke-dashoffset: 0;
		transition-delay: calc(var(--wfd-motion-change) / 2);
	}

	/* A line strikes the name from the left, and the name gets quiet. */
	.wfd-shop-row :global(.wfd-list-line__name) {
		position: relative;
		transition: color var(--wfd-chip-motion);
	}

	.wfd-shop-row :global(.wfd-list-line__name)::after {
		content: '';
		position: absolute;
		inset-inline: 0;
		inset-block-start: 55%;
		block-size: var(--wfd-border);
		background: currentcolor;
		scale: 0 1;
		transform-origin: left;
		transition: scale var(--wfd-chip-motion);
	}

	.wfd-shop-row--ticked :global(.wfd-list-line__name) {
		color: var(--wfd-color-text-muted);
	}

	.wfd-shop-row--ticked :global(.wfd-list-line__name)::after {
		scale: 1 1;
	}

	/* The photos are below the text of the row, in line with the name. */
	.wfd-shop-row__brands {
		grid-column: 1 / -1;
		padding: 0 0 var(--wfd-space-inset) calc(var(--box-size) + var(--wfd-space-stack));
	}
</style>
