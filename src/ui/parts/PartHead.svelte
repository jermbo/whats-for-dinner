<script lang="ts">
	import type { Snippet } from 'svelte';

	// The side is the answer of the part, such as "2 use soon" or "3/9 in the cart". The id names
	// the section of the part: Obsidian shows each aria-label as a tooltip, so the name comes from
	// the title on screen.
	let { title, id, side }: { title: string; id?: string; side?: Snippet } = $props();
</script>

<header class="wfd-head">
	<h2 class="wfd-head__title wfd-display" {id}>{title}</h2>
	{#if side}
		<div class="wfd-head__side">{@render side()}</div>
	{/if}
</header>

<style>
	.wfd-head {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-tight) var(--wfd-space-section);
		align-items: end;
		justify-content: space-between;
		padding-block-end: var(--wfd-space-group);
		border-block-end: var(--wfd-border-rule) solid var(--wfd-color-border);
	}

	.wfd-head__title {
		margin: 0;
		color: var(--wfd-color-text);
		font-size: var(--wfd-font-size-head);
		font-weight: 800;
		line-height: var(--wfd-line-height-display);
	}

	.wfd-head__side {
		display: flex;
		gap: var(--wfd-space-section);
		align-items: baseline;
	}
</style>
