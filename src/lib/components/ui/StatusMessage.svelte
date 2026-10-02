<script>
	import { status } from '$lib/status.svelte';
</script>

<!-- The element is always in the page, so that screen readers read each new message. -->
<p class="status-message" role="status">{status.message}</p>

<style>
	.status-message {
		position: fixed;
		inset-inline: var(--space-4);
		inset-block-end: calc(var(--nav-height) + env(safe-area-inset-bottom) + var(--space-3));
		max-inline-size: 38rem;
		margin-inline: auto;
		padding: var(--space-3) var(--space-4);
		font-weight: 600;
		color: var(--color-bg);
		background: var(--color-text);
		border-radius: var(--radius);
		pointer-events: none;

		&:empty {
			opacity: 0;
		}
	}
</style>
