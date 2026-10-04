<script>
	import '$lib/styles';
	import { onMount } from 'svelte';
	import AppNav from '$lib/components/ui/AppNav.svelte';
	import StatusMessage from '$lib/components/ui/StatusMessage.svelte';
	import { requestPersistence } from '$lib/db/persistence';
	import { usePageTransitions } from '$lib/motion/page-transition';

	let { children } = $props();

	usePageTransitions();

	onMount(() => {
		requestPersistence();
	});
</script>

<div class="app">
	<a class="app__skip" href="#main">Skip to content</a>

	<main class="app__main stack stack--loose" id="main" tabindex="-1">
		{@render children()}
	</main>

	<StatusMessage />
	<AppNav />
</div>

<style>
	.app__skip {
		position: absolute;
		z-index: 1;
		inset-block-start: var(--space-2);
		inset-inline-start: var(--space-2);
		padding: var(--space-2) var(--space-4);
		font-weight: 700;
		background: var(--card);
		border: 2px solid var(--ink);
		border-radius: var(--radius-control);
		transform: translateY(-200%);

		&:focus {
			transform: none;
		}
	}

	/*
	 * The main area is a query container: the blocks of a page ask how wide it is, and not how
	 * wide the screen is. See styles/layout.css.
	 */
	.app__main {
		container: main / inline-size;
		max-inline-size: var(--measure);
		margin-inline: auto;
		padding: var(--space-6) var(--gutter);
		/* Room for the navigation that is fixed to the bottom. */
		padding-block-end: calc(var(--nav-space) + var(--space-8));

		&:focus {
			outline: none;
		}

		/* Text, lists, and forms stay at a reading width. A grid and a split use the full width. */
		& > :global(:not(.grid, .split, .wide)) {
			max-inline-size: var(--measure);
		}
	}

	/*
	 * The only place that asks how wide the screen is, together with the navigation.
	 * Desktop: the navigation is a column on the left, and the main area is wide.
	 */
	@media (min-width: 60rem) {
		.app {
			--gutter: var(--space-8);
			--nav-space: 0rem;

			display: grid;
			grid-template-columns: auto minmax(0, 1fr);
			align-items: start;
		}

		.app__main {
			grid-column: 2;
			grid-row: 1;
			inline-size: 100%;
			max-inline-size: none;
			margin-inline: 0;
			padding: var(--space-8) var(--gutter);
		}
	}
</style>
