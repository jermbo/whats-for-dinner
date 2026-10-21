<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	// The surface of a card: its background, its edge, its corner, and its padding. The screen puts
	// its own layout inside. surface: a white card. form: a white card with an edge, which holds a
	// form. ink: the open card of a food item. empty: a dashed edge with no card, such as the place
	// of the food that is out. A flush panel has no padding, so that a photo reaches its edge.
	type Props = HTMLAttributes<HTMLElement> & {
		kind?: 'surface' | 'form' | 'ink' | 'empty';
		as?: 'div' | 'section' | 'article' | 'form';
		flush?: boolean;
		children: Snippet;
	};
	let { kind = 'surface', as = 'div', flush = false, children, ...rest }: Props = $props();
</script>

<svelte:element
	this={as}
	class="wfd-panel wfd-panel--{kind}"
	class:wfd-panel--flush={flush}
	class:wfd-scheme={kind !== 'ink'}
	{...rest}
>
	{@render children()}
</svelte:element>

<style>
	.wfd-panel {
		box-sizing: border-box;
		min-inline-size: 0;
		padding: var(--wfd-space-inset);
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-color-surface);
		color: var(--wfd-color-text);
	}

	.wfd-panel--flush {
		padding: 0;
	}

	.wfd-panel--form {
		border: var(--wfd-border) solid var(--wfd-color-border);
	}

	.wfd-panel--empty {
		border: var(--wfd-border) dashed var(--wfd-color-text-faint);
		background: none;
	}

	/*
	 * On ink, the text, the edges, and the controls take the colour on the ink. Each piece inside, such
	 * as a quiet button or a link, follows. A surface panel inside the ink card gives the roles of the
	 * scheme back.
	 */
	.wfd-panel--ink {
		--wfd-color-text: var(--wfd-color-on-selected);
		--wfd-color-text-muted: var(--wfd-color-on-selected);
		--wfd-color-border: var(--wfd-color-on-selected);
		--wfd-color-control: transparent;
		--wfd-color-focus: var(--wfd-color-on-selected);

		background: var(--wfd-color-selected);
	}
</style>
