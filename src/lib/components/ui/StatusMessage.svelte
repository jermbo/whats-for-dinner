<script>
	import { status } from '$lib/status.svelte';
</script>

<!-- The element is always in the page, so that screen readers read each new message. -->
<p class="status-message" role="status">{status.message}</p>

<style>
	.status-message {
		position: fixed;
		inset-inline: var(--space-4);
		/* Above the navigation, when the navigation is at the bottom of the screen. */
		inset-block-end: calc(var(--nav-space) + var(--space-6));
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
		transition:
			opacity 0.2s,
			translate 0.45s var(--ease-spring);

		&:empty {
			opacity: 0;
			translate: 0 1.5rem;
		}
	}
</style>
