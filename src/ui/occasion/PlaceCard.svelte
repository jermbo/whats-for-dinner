<script lang="ts">
	import type { Snippet } from 'svelte';

	// A place card, as on a table for a dinner: the title above a fold line, and below it the jobs.
	// An empty card is dashed, as an empty place of the pantry is: a slot that waits for a dish.
	type Props = { title: string; empty?: boolean; children: Snippet; foot?: Snippet };
	let { title, empty = false, children, foot }: Props = $props();
</script>

<article class="wfd-place" class:wfd-place--empty={empty}>
	<h3 class="wfd-place__title wfd-display">{title}</h3>
	<div class="wfd-place__body">{@render children()}</div>
	{#if foot}{@render foot()}{/if}
</article>

<style>
	.wfd-place {
		display: grid;
		gap: var(--wfd-space-group);
		align-content: start;
		min-inline-size: 0;
		padding: var(--wfd-space-inset);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-color-surface);
	}

	.wfd-place--empty {
		border-style: dashed;
		border-color: var(--wfd-color-text-faint);
		background: none;
	}

	/* The fold of a place card: the name sits on it, in the middle. */
	.wfd-place__title {
		margin: 0;
		padding-block: var(--wfd-space-group) var(--wfd-space-stack);
		border-block-end: var(--wfd-border-thin) dashed var(--wfd-color-text-faint);
		font-size: var(--wfd-font-size-title);
		text-align: center;
		overflow-wrap: anywhere;
	}

	.wfd-place__body {
		display: grid;
		min-inline-size: 0;
	}
</style>
