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
		gap: 12px;
		margin-block-start: calc(-1 * var(--wfd-kitchen-gap));
		padding-block: var(--wfd-kitchen-gap) 10px;
		background: var(--wfd-paper);
	}

	.wfd-top :global(.wfd-head__title) {
		transition: font-size 0.2s ease-out;
	}

	/* A stuck top gets small, so that more lines show, and a thin rule tells where the list goes under. */
	@container scroll-state(stuck: top) {
		.wfd-top :global(.wfd-head__title) {
			font-size: 24px;
		}

		.wfd-top > :global(:last-child) {
			padding-block-end: 10px;
			border-block-end: 1px solid var(--wfd-ink-3);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-top :global(.wfd-head__title) {
			transition: none;
		}
	}
</style>
