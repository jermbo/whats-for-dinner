<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<!--
	The head of a part and its bar. They stay under the nav while the list scrolls, so that you can
	find, filter, or go to a different part from any point of a long list.
-->
<div class="wfd-top">{@render children()}</div>

<style>
	/*
	 * The paper hides the lines that go under the top. The top starts in the gap under the nav, so
	 * that no line shows between the two.
	 */
	.wfd-top {
		container-type: scroll-state;
		position: sticky;
		inset-block-start: var(--wfd-nav-size);
		z-index: 3;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-stack);
		margin-block-start: calc(-1 * var(--wfd-space-section));
		padding-block: var(--wfd-space-section) var(--wfd-space-inset);
		background: var(--wfd-color-bg);
	}

	.wfd-top :global(.wfd-head__title) {
		transition: font-size var(--wfd-motion-change) var(--wfd-ease-out);
	}

	/* A stuck top gets small, so that more lines show, and a thin rule tells where the list goes under. */
	@container scroll-state(stuck: top) {
		.wfd-top :global(.wfd-head__title) {
			font-size: var(--wfd-font-size-title);
		}

		.wfd-top > :global(:last-child) {
			padding-block-end: var(--wfd-space-inset);
			border-block-end: var(--wfd-border-thin) solid var(--wfd-color-text-faint);
		}
	}
</style>
