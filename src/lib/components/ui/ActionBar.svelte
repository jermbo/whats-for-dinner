<script>
	/**
	 * The place of the main action of a screen. On a phone, the action stays above the
	 * navigation while the screen scrolls, in reach of the thumb. On a desktop, it stays in the
	 * text where it is written.
	 * @type {{ children: import('svelte').Snippet }}
	 */
	let { children } = $props();
</script>

<div class="action-bar">{@render children()}</div>

<style>
	.action-bar {
		position: fixed;
		z-index: 1;
		inset-inline: var(--space-5);
		inset-block-end: calc(var(--nav-height) + env(safe-area-inset-bottom) + 2.75rem);
		display: grid;
		max-inline-size: 41.5rem;
		margin-inline: auto;

		/* The action lies on the content of the screen, so it has a shadow. */
		& :global(.button) {
			box-shadow: 0 0.5rem 1.5rem rgb(20 70 75 / 0.25);
		}
	}

	/* The message of the last action goes above the bar. */
	:global(.app:has(.action-bar) .status-message) {
		inset-block-end: calc(var(--nav-height) + env(safe-area-inset-bottom) + 7rem);
	}

	@media (min-width: 60rem) {
		.action-bar {
			position: static;
			justify-content: start;

			& :global(.button) {
				box-shadow: none;
			}
		}

		:global(.app:has(.action-bar) .status-message) {
			inset-block-end: var(--space-6);
		}
	}
</style>
