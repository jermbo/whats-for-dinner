<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { ShoppingRow } from '../../shop/shopping-list';
	import ListLine from '../parts/ListLine.svelte';
	import Sticker from '../parts/Sticker.svelte';

	type Props = {
		row: ShoppingRow;
		// The regular price, or no text.
		price: string;
		// The package that you look for on the shelf: the photo of a brand, its name, or nothing.
		pack: { url: string } | { name: string } | null;
		// The list has rows for a meal and extras, so the sticker "Extra" tells something.
		mixed: boolean;
		// Ticked: the check is full, and the row fades in its place.
		ticked: boolean;
		// The row came back from the cart: it shows its tick for one moment.
		back: boolean;
		// The brands show below the row.
		open: boolean;
		ontick: () => void;
		onback: () => void;
		onpack: () => void;
		onremove?: () => void;
		brands?: Snippet;
	};
	let { row, price, pack, mixed, ticked, back, open, ontick, onback, onpack, onremove, brands }: Props =
		$props();

	// A row that comes back starts ticked for one frame, so that the tick can go back.
	let settled = $state(false);
	onMount(() => {
		const frame = requestAnimationFrame(() => (settled = true));
		const timer = back ? setTimeout(onback, 400) : undefined;
		return () => (cancelAnimationFrame(frame), clearTimeout(timer));
	});
	const shown = $derived(ticked || (back && !settled));
	const small = $derived(row.recipes.join(', ') || (mixed ? undefined : 'Extra'));
</script>

<!--
	A row is a label: the check, the package that you look for, the name, and the amount at the
	right edge. The row has its own answer to the finger, the check, so the press of the kitchen
	stays off it.
-->
<div class="wfd-shop-row" class:wfd-shop-row--ticked={shown} class:wfd-shop-row--leaving={ticked}>
	<button
		class="wfd-shop-row__tick"
		type="button"
		aria-pressed={ticked}
		onpointerdown={(event) => event.stopPropagation()}
		onclick={ontick}
	>
		<ListLine name={row.name} {small} number={row.amount || undefined} numberSmall={price || undefined}>
			{#snippet mark()}
				<span class="wfd-shop-row__check" data-check aria-hidden="true">
					<span class="wfd-shop-row__fill"></span>
					<svg class="wfd-shop-row__mark" viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9" /></svg>
				</span>
				<span class="wfd-shop-row__room"></span>
			{/snippet}
			{#snippet tag()}
				{#if row.extra && mixed}<Sticker label="Extra" />{/if}
			{/snippet}
		</ListLine>
	</button>
	<!-- The package is its own button, at the left of the name, because a button cannot be in a button. -->
	<button
		class="wfd-shop-row__pack"
		class:wfd-shop-row__pack--none={!pack}
		type="button"
		aria-expanded={open}
		aria-label={pack ? `The brands of ${row.name}` : `A photo of ${row.name}`}
		onclick={onpack}
	>
		{#if pack && 'url' in pack}
			<img src={pack.url} alt="" />
		{:else if pack}
			<span class="wfd-shop-row__pack-name">{pack.name}</span>
		{:else}
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M4 8h3l2-2.5h6L17 8h3v11H4z" />
				<circle cx="12" cy="13.5" r="3.2" />
			</svg>
		{/if}
	</button>
	{#if onremove}
		<button class="wfd-shop-row__remove" type="button" aria-label="Remove {row.name}" onclick={onremove}>
			✕
		</button>
	{/if}
	{#if open && brands}
		<div class="wfd-shop-row__brands">{@render brands()}</div>
	{/if}
</div>

<style>
	/*
	 * The tick button covers the full row. The package sits over its left part, after the check,
	 * so the text of the row keeps its place in the line, and the remove mark sits at the end.
	 */
	.wfd-shop-row {
		--box-size: 28px;
		--pack-size: var(--wfd-control-min);

		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
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
		padding: var(--wfd-space-group) 0;
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

	/* The mark of the list line holds the check and the room for the package. */
	.wfd-shop-row__room {
		inline-size: var(--pack-size);
	}

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

	/* The package: the photo that you look for on the shelf, after the check. */
	button.wfd-shop-row__pack {
		position: absolute;
		inset-block-start: 50%;
		inset-inline-start: calc(var(--box-size) + var(--wfd-space-group));
		display: grid;
		place-items: center;
		inline-size: var(--pack-size);
		block-size: var(--pack-size);
		margin-block-start: calc(var(--pack-size) / -2);
		padding: 0;
		overflow: hidden;
		border: 0;
		border-radius: var(--wfd-radius-sticker);
		background: var(--wfd-color-control);
		box-shadow: none;
		color: var(--wfd-color-text-faint);
		cursor: pointer;

		& img {
			inline-size: 100%;
			block-size: 100%;
			object-fit: cover;
		}

		& svg {
			inline-size: 18px;
			block-size: 18px;
			fill: none;
			stroke: currentColor;
			stroke-width: 2;
			stroke-linejoin: round;
		}

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	/* No photo: a hatched tile, the mark of an empty place in the Larder look. */
	button.wfd-shop-row__pack--none {
		border: var(--wfd-border-thin) solid var(--wfd-color-track);
		background: repeating-linear-gradient(
			135deg,
			var(--wfd-color-track) 0 var(--wfd-border),
			transparent var(--wfd-border) var(--wfd-space-group)
		);
	}

	.wfd-shop-row__pack-name {
		padding: var(--wfd-space-tight);
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-label);
		font-weight: 800;
		line-height: var(--wfd-line-height-single);
		text-align: center;
	}

	/* Remove is a quiet mark at the end: the row is about the food, not about the action. */
	button.wfd-shop-row__remove {
		display: grid;
		place-items: center;
		inline-size: var(--wfd-control-min);
		block-size: var(--wfd-control-min);
		padding: 0;
		border: 0;
		border-radius: var(--wfd-radius-pill);
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text-faint);
		font-size: var(--wfd-font-size-text);
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
		}
	}

	.wfd-shop-row__brands {
		grid-column: 1 / -1;
		padding: 0 0 var(--wfd-space-inset)
			calc(var(--box-size) + var(--pack-size) + var(--wfd-space-group) + var(--wfd-space-stack));
	}
</style>
