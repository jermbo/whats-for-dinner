<script>
	import { useClock } from '$lib/clock.svelte';
	import { formatClock } from '$lib/data/step-text';
	import { secondsLeft } from '$lib/data/timers';

	/**
	 * The timer that ends first, on the photo of a card. It runs while the owner is on another
	 * screen: the session stores the end time. With no timer that runs, it shows nothing.
	 * @type {{ session: import('$lib/types').CookSession }}
	 */
	let { session } = $props();

	const clock = useClock();

	const left = $derived.by(() => {
		const running = session.timers
			.map((timer) => secondsLeft(timer, clock.now))
			.filter((seconds) => seconds > 0);
		return running.length > 0 ? Math.min(...running) : 0;
	});
</script>

{#if left > 0}
	<span class="card-timer">
		<span class="visually-hidden">Timer:</span>
		{formatClock(left)}
	</span>
{/if}

<style>
	/* The timer sits on the photo, at the right edge, on the line of the olive band. */
	.card-timer {
		position: absolute;
		inset-block-end: var(--space-3);
		inset-inline-end: var(--space-3);
		padding: var(--space-1) var(--space-2);
		font-family: var(--font-display);
		font-size: 1.5rem;
		line-height: 1;
		font-variant-numeric: tabular-nums;
		color: var(--card);
		background: var(--ink);
		border-radius: var(--radius-sticker);
	}
</style>
