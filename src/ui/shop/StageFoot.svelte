<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<!--
	The main button of a stage keeps one size and one place: at the lower edge of the tab, also with
	a long list above it.
-->
<footer class="wfd-foot">
	{@render children()}
</footer>

<style>
	/*
	 * The foot fills the room of the bar of Obsidian with its background, so that no line shows
	 * below it. The kitchen has the same room at its end, so the foot gives it back there.
	 */
	.wfd-foot {
		position: sticky;
		inset-block-end: 0;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-group);
		margin-inline: calc(-1 * var(--wfd-space-page));
		margin-block-end: calc(-1 * var(--wfd-space-bar));
		padding: var(--wfd-space-inset) var(--wfd-space-page)
			calc(max(var(--safe-area-inset-bottom, 0px), var(--wfd-space-inset)) + var(--wfd-space-bar));
		border-block-start: var(--wfd-border) solid var(--wfd-color-border);
		background: var(--wfd-color-bg);
	}
</style>
