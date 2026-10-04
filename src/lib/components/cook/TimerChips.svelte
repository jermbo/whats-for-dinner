<script>
	import Icon from '$lib/components/ui/Icon.svelte';
	import { formatClock } from '$lib/domain/step-text';
	import { secondsLeft } from '$lib/domain/timers';
	import { pop } from '$lib/motion/transitions';

	/** @typedef {import('$lib/types').CookTimer} CookTimer */

	/**
	 * The timers that run, as one row of chips at the top of each card. The owner can start
	 * the rice on step 2 and read step 3 while it cooks.
	 * A tap on a chip opens its step. A chip of a timer that is done shows "Done" until the
	 * owner taps it.
	 * @type {{
	 *   timers: CookTimer[],
	 *   numbers: Map<string, number>,
	 *   now: number,
	 *   onopen: (stepId: string) => void,
	 *   ondone: (timer: CookTimer) => void
	 * }}
	 *   numbers: the number of each step, by its ID.
	 */
	let { timers, numbers, now, onopen, ondone } = $props();

	/** The timer that ends first is first. */
	const sorted = $derived(timers.toSorted((a, b) => a.endsAt.localeCompare(b.endsAt)));

	/** @param {CookTimer} timer */
	function tap(timer) {
		if (secondsLeft(timer, now) === 0) ondone(timer);
		onopen(timer.stepId);
	}
</script>

{#if sorted.length > 0}
	<ul class="timer-chips" aria-label="Timers">
		{#each sorted as timer (timer.id)}
			{@const left = secondsLeft(timer, now)}
			<li transition:pop>
				<button
					class={['timer-chip', left === 0 && 'timer-chip--done']}
					type="button"
					onclick={() => tap(timer)}
				>
					<Icon name={left === 0 ? 'check' : 'clock'} />
					<span>Step {numbers.get(timer.stepId) ?? '?'}</span>
					<span class="timer-chip__clock">{left === 0 ? 'Done' : formatClock(left)}</span>
				</button>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.timer-chips {
		display: flex;
		gap: var(--space-2);
		margin: 0;
		padding: var(--space-2) var(--space-5);
		overflow-x: auto;
		list-style: none;
		scrollbar-width: none;
	}

	.timer-chip {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		min-block-size: 2.5rem;
		padding: var(--space-1) var(--space-4) var(--space-1) var(--space-3);
		font-weight: 800;
		white-space: nowrap;
		color: var(--paper);
		background: var(--ink);
		border: 0;
		border-radius: var(--radius-sticker);
		cursor: pointer;

		& :global(.icon) {
			inline-size: 1.15rem;
			block-size: 1.15rem;
		}
	}

	@keyframes ring {
		50% {
			box-shadow: 0 0 0 0.4rem color-mix(in oklch, var(--amber) 50%, transparent);
		}
	}

	/* A timer that is done: amber, with a ring that breathes until the owner taps it. */
	.timer-chip--done {
		color: var(--ink);
		background: var(--amber);
		animation: ring 1.2s ease-in-out infinite;
	}

	.timer-chip__clock {
		font-variant-numeric: tabular-nums;
	}
</style>
