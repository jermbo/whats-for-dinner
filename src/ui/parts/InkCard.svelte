<script lang="ts">
	import type { Snippet } from 'svelte';
	import { inkLength, spread } from '../ink';

	// The open card of each part. Ink spreads from the point of the tap until it covers the card,
	// and goes back to the point of the tap that closes it, in half the time. Paper spreads over the
	// ink for a form. A card that opens as it comes, such as the card of a food item, spreads its
	// ink at once. A card that goes away goes at once: the screen closes it first, with `open`.
	type Props = {
		open: boolean;
		// Paper over the ink: the card holds a form.
		paper?: boolean;
		// No padding, so that a photo reaches the edge.
		flush?: boolean;
		children: Snippet;
	};
	let { open, paper = false, flush = false, children }: Props = $props();

	let card = $state<HTMLElement>();
	let ink = $state<HTMLElement>();
	let sheet = $state<HTMLElement>();

	// The time of a circle, from the motion tokens. With less motion, it is 0.
	let length = $state(600);
	$effect(() => {
		if (card) length = inkLength(card);
	});

	// The circles follow the props one frame later, so that the card has its new size first.
	$effect(() => {
		const inkTo = open;
		const paperTo = open && paper;
		const time = inkTo ? length : length / 2;
		if (!card || !ink || !sheet) return;
		const [node, inkLayer, paperLayer] = [card, ink, sheet];
		const frame = requestAnimationFrame(() => {
			spread(node, inkLayer, inkTo, time);
			spread(node, paperLayer, paperTo, time);
		});
		return () => cancelAnimationFrame(frame);
	});

	// The text changes its colours when the circle covers about half the card, so that it stays
	// readable while the circle grows. With the soft end of the easing, that is at a quarter of
	// its time.
	let inked = $state(false);
	$effect(() => {
		const to = open && !paper;
		const timer = setTimeout(() => (inked = to), (to ? length : length / 2) / 4);
		return () => clearTimeout(timer);
	});
</script>

<article
	class="wfd-ink wfd-scheme"
	class:wfd-ink--inked={inked}
	class:wfd-ink--flush={flush}
	bind:this={card}
	data-glide-bg
>
	<span class="wfd-ink__layer wfd-ink__ink" aria-hidden="true" bind:this={ink}></span>
	<span class="wfd-ink__layer wfd-ink__paper" aria-hidden="true" bind:this={sheet}></span>
	{@render children()}
</article>

<style>
	.wfd-ink {
		position: relative;
		isolation: isolate;
		box-sizing: border-box;
		min-inline-size: 0;
		overflow: hidden;
		padding: var(--wfd-space-inset);
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-color-surface);
		color: var(--wfd-color-text);
	}

	.wfd-ink--flush {
		padding: 0;
	}

	/* A layer shows only as a circle that moves, or as a plain layer that fills the card. */
	.wfd-ink__layer {
		position: absolute;
		display: none;
		pointer-events: none;
	}

	.wfd-ink__layer:global(.wfd-ink--circle) {
		display: block;
		border-radius: 50%;
		will-change: transform;
	}

	.wfd-ink__layer:global(.wfd-ink--full) {
		display: block;
		inset: 0;
	}

	.wfd-ink__ink {
		z-index: -2;
		background: var(--wfd-color-selected);
	}

	.wfd-ink__paper {
		z-index: -1;
		background: var(--wfd-color-surface);
	}

	/* The same roles as an ink panel: each piece inside reads on the ink. */
	.wfd-ink--inked {
		--wfd-color-text: var(--wfd-color-on-selected);
		--wfd-color-text-muted: var(--wfd-color-on-selected);
		--wfd-color-border: var(--wfd-color-on-selected);
		--wfd-color-control: transparent;
		--wfd-color-focus: var(--wfd-color-on-selected);
	}
</style>
