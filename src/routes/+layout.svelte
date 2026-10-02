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
		background: var(--color-surface);
		border-radius: var(--radius-pill);
		transform: translateY(-200%);

		&:focus {
			transform: none;
		}
	}

	.app__main {
		max-inline-size: 44rem;
		margin-inline: auto;
		padding: var(--space-6) var(--space-5);
		/* Room for the navigation that is fixed to the bottom. */
		padding-block-end: calc(var(--nav-height) + env(safe-area-inset-bottom) + 7rem);

		&:focus {
			outline: none;
		}
	}

	/* Desktop: the navigation is a column on the left, and the main area is wide. */
	@media (min-width: 60rem) {
		.app {
			display: grid;
			grid-template-columns: auto minmax(0, 1fr);
			align-items: start;
			max-inline-size: 90rem;
			margin-inline: auto;
		}

		.app__main {
			grid-column: 2;
			grid-row: 1;
			inline-size: 100%;
			max-inline-size: none;
			margin-inline: 0;
			padding: var(--space-8);

			/* Text and forms stay at a reading width. A grid uses the full width. */
			& > :global(:not(.grid, .wide)) {
				max-inline-size: 44rem;
			}
		}
	}
</style>
