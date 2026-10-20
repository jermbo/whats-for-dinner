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
	.wfd-foot {
		position: sticky;
		inset-block-end: 0;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-group);
		margin-inline: calc(-1 * var(--wfd-space-page));
		padding: var(--wfd-space-inset) var(--wfd-space-page)
			max(var(--safe-area-inset-bottom, 0px), var(--wfd-space-inset));
		border-block-start: var(--wfd-border) solid var(--wfd-color-border);
		background: var(--wfd-color-bg);
	}
</style>
