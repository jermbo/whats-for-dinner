<script>
	import '$lib/styles';
	import { onMount } from 'svelte';
	import AppNav from '$lib/components/ui/AppNav.svelte';
	import StatusMessage from '$lib/components/ui/StatusMessage.svelte';
	import { requestPersistence } from '$lib/db/persistence';

	let { children } = $props();

	onMount(() => {
		requestPersistence();
	});
</script>

<div class="app">
	<a class="app__skip" href="#main">Skip to content</a>

	<main class="app__main stack" id="main" tabindex="-1">
		{@render children()}
	</main>

	<StatusMessage />
	<AppNav />
</div>

<style>
	.app__skip {
		position: absolute;
		inset-block-start: var(--space-2);
		inset-inline-start: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--color-bg);
		transform: translateY(-200%);

		&:focus {
			transform: none;
		}
	}

	.app__main {
		max-inline-size: 40rem;
		margin-inline: auto;
		padding: var(--space-4);
		/* Room for the navigation that is fixed to the bottom. */
		padding-block-end: calc(var(--nav-height) + env(safe-area-inset-bottom) + 5rem);

		&:focus {
			outline: none;
		}
	}
</style>
