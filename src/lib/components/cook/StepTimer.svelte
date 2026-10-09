<script>
	import { formatClock } from '$lib/domain/step-text';
	import { secondsLeft } from '$lib/domain/timers';

	/**
	 * One time of a step, as a large clock that the owner reads from the other side of the
	 * kitchen. "Start" starts the timer. While the timer runs, the clock shows the time that is
	 * left, and "Stop" stops it. When the timer is done, "Done" removes it.
	 * @type {{
	 *   label: string,
	 *   seconds: number,
	 *   timer: import('$lib/types').CookTimer | undefined,
	 *   now: number,
	 *   onstart: () => void,
	 *   onstop: (timer: import('$lib/types').CookTimer) => void
	 * }}
	 *   label: the words of the time in the text of the step, such as "25 min".
	 */
	let { label, seconds, timer, now, onstart, onstop } = $props();

	const left = $derived(timer ? secondsLeft(timer, now) : seconds);
	const done = $derived(Boolean(timer) && left === 0);
	const running = $derived(Boolean(timer) && !done);
</script>

<div class={['step-timer', running && 'step-timer--running', done && 'step-timer--done']}>
	<p class="step-timer__clock" role="timer" aria-label="Timer of {label}">{formatClock(left)}</p>
	<button
		class={['button', !running && 'button--strong', 'step-timer__button']}
		type="button"
		onclick={() => (timer ? onstop(timer) : onstart())}
	>
		{#if done}Done{:else if running}Stop{:else}Start{/if}
		<span class="visually-hidden">: the timer of {label}</span>
	</button>
</div>

<style>
	@keyframes timer-done {
		50% {
			background: var(--card);
		}
	}

	/* A band between two rules: the clock at the left, and its one button at the right. */
	.step-timer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		padding: var(--space-2) 0;
		border-block: var(--rule-4) solid var(--ink);
		transition:
			background-color 0.3s,
			padding 0.3s var(--ease-out);
	}

	/* The digits have one width, so the clock does not move each second. */
	.step-timer__clock {
		font-family: var(--font-display);
		font-size: clamp(3.5rem, 22cqi, 7rem);
		font-variant-numeric: tabular-nums;
		line-height: 0.95;
	}

	.step-timer__button {
		flex: none;
		min-inline-size: 5.5rem;
		min-block-size: 3.5rem;
		font-size: 1.1rem;
	}

	/* A timer that runs: olive, the colour of the current step. */
	.step-timer--running {
		padding-inline: var(--space-3);
		background: var(--olive);
	}

	/* A timer that is done: amber, and it breathes until the owner taps it. */
	.step-timer--done {
		padding-inline: var(--space-3);
		background: var(--amber);
		animation: timer-done 1.2s ease-in-out infinite;
	}
</style>
