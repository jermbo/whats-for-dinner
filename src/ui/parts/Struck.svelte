<script lang="ts">
	import type { Snippet } from 'svelte';

	// A text that is done: a line strikes it from the left, and it gets quiet, as a tick in the Shop.
	let { on, children }: { on: boolean; children: Snippet } = $props();
</script>

<span class="wfd-struck" class:wfd-struck--on={on}>{@render children()}</span>

<style>
	.wfd-struck {
		position: relative;
		min-inline-size: 0;
		transition: color var(--wfd-chip-motion);
	}

	.wfd-struck::after {
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

	.wfd-struck--on {
		color: var(--wfd-color-text-muted);
	}

	.wfd-struck--on::after {
		scale: 1 1;
	}
</style>
