<script lang="ts">
	import type { Snippet } from 'svelte';

	// A strip at the top of "Cook day" that needs you: a dish that must start, or a question.
	// danger: the colour of a thing that is late.
	type Props = { danger?: boolean; children: Snippet; actions?: Snippet };
	let { danger = false, children, actions }: Props = $props();
</script>

<div class="wfd-notice" class:wfd-notice--danger={danger} role={danger ? 'alert' : undefined}>
	<span class="wfd-notice__text">{@render children()}</span>
	{#if actions}<span class="wfd-notice__actions">{@render actions()}</span>{/if}
</div>

<style>
	.wfd-notice {
		display: flex;
		flex: none;
		flex-wrap: wrap;
		gap: var(--wfd-space-group) var(--wfd-space-stack);
		align-items: center;
		justify-content: space-between;
		padding: var(--wfd-space-group) var(--wfd-space-inset);
		border: var(--wfd-border) solid var(--wfd-color-on-frame);
		border-radius: var(--wfd-radius-button);
		color: var(--wfd-color-on-frame);
		font-weight: 700;
	}

	.wfd-notice--danger {
		border-color: var(--wfd-color-danger);
		background: var(--wfd-color-danger);
		color: var(--wfd-color-on-danger);
	}

	.wfd-notice__text {
		flex: 1;
		min-inline-size: 0;
		overflow-wrap: anywhere;
		text-align: start;
	}

	.wfd-notice__actions {
		display: flex;
		gap: var(--wfd-space-group);
	}

	/* A button on the notice reads on the notice, not on paper. */
	.wfd-notice :global(button.wfd-button) {
		border-color: currentcolor;
		background: none;
		color: inherit;
	}
</style>
