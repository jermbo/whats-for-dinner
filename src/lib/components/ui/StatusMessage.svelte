<script>
	import { status } from '$lib/status.svelte';
</script>

<!-- The element is always in the page, so that screen readers read each new message. -->
<p class="status-message" role="status">{status.message}</p>

<style>
	.status-message {
		position: fixed;
		inset-inline: var(--space-4);
		inset-block-end: calc(var(--nav-height) + env(safe-area-inset-bottom) + 3.5rem);
		max-inline-size: 38rem;
		margin-inline: auto;
		padding: var(--space-3) var(--space-5);
		font-weight: 600;
		color: var(--color-on-strong);
		background: var(--color-strong);
		border-radius: var(--radius-pill);
		box-shadow: var(--shadow);
		text-align: center;
		pointer-events: none;

		&:empty {
			opacity: 0;
		}
	}

	@media (min-width: 60rem) {
		.status-message {
			inset-block-end: var(--space-6);
		}
	}
</style>
