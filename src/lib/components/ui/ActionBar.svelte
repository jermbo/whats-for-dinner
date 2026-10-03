<script>
	/**
	 * The place of the main action of a screen. The action stays in view while the screen
	 * scrolls: on a phone, it is above the navigation, in reach of the thumb.
	 * The bar is the last block of its column, and it stays at the lower edge of the screen
	 * until the column ends. Put it in a column that is as tall as the content of the screen.
	 * @type {{ children: import('svelte').Snippet }}
	 */
	let { children } = $props();
</script>

<div class="action-bar">{@render children()}</div>

<style>
	/*
	 * "sticky", and not "fixed": the main area is a query container, and in some browsers a
	 * query container keeps a fixed element in its own box.
	 */
	.action-bar {
		position: sticky;
		z-index: 1;
		inset-block-end: calc(var(--nav-space) + var(--space-3));
		order: 1;
		display: grid;
		inline-size: min(100%, var(--measure));

		/* The action lies on the content of the screen, so it has a shadow. */
		& :global(.button) {
			box-shadow: 0 0.5rem 1.5rem rgb(20 70 75 / 0.25);
		}
	}

	/* The message of the last action goes above the bar. */
	:global(.app:has(.action-bar) .status-message) {
		inset-block-end: calc(var(--nav-space) + 5rem);
	}
</style>
