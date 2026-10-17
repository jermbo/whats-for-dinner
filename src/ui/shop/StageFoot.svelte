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
		gap: 8px;
		margin-inline: -14px;
		padding: 10px 14px max(var(--safe-area-inset-bottom, 0px), 12px);
		border-block-start: 2px solid var(--wfd-ink);
		background: var(--wfd-paper);
	}
</style>
