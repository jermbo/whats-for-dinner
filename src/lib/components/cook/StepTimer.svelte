<script>
	import Icon from '$lib/components/ui/Icon.svelte';
	import { formatClock } from '$lib/data/step-text';
	import { secondsLeft } from '$lib/data/timers';

	/**
	 * One time in the text of a step, as a button in the sentence. A tap starts the timer.
	 * While the timer runs, the button shows the time that is left, and a tap stops it.
	 * When the timer is done, a tap removes it.
	 * @type {{
	 *   label: string,
	 *   seconds: number,
	 *   timer: import('$lib/types').CookTimer | undefined,
	 *   now: number,
	 *   onstart: () => void,
	 *   onstop: (timer: import('$lib/types').CookTimer) => void
	 * }}
	 */
	let { label, seconds, timer, now, onstart, onstop } = $props();

	const left = $derived(timer ? secondsLeft(timer, now) : seconds);
	const done = $derived(Boolean(timer) && left === 0);
</script>

<button
	class={['step-timer', timer && !done && 'step-timer--running', done && 'step-timer--done']}
	type="button"
	onclick={() => (timer ? onstop(timer) : onstart())}
>
	<Icon name={done ? 'check' : 'clock'} />
	{#if !timer}
		{label}
		<span class="visually-hidden">: start a timer of {formatClock(seconds)}</span>
	{:else if done}
		Done
		<span class="visually-hidden">: the timer of {label}. Remove it.</span>
	{:else}
		<span class="step-timer__clock">{formatClock(left)}</span>
		<span class="visually-hidden">left of {label}. Stop the timer.</span>
	{/if}
</button>

<style>
	/* The button is a part of the sentence, so it has the size of the text around it. */
	.step-timer {
		display: inline-flex;
		align-items: center;
		gap: 0.3em;
		padding: 0.1em 0.55em 0.1em 0.4em;
		font: inherit;
		font-weight: 600;
		line-height: 1.25;
		color: var(--color-accent-strong);
		white-space: nowrap;
		vertical-align: baseline;
		background: var(--color-accent-soft);
		border: 1.5px solid currentColor;
		border-radius: var(--radius-pill);
		cursor: pointer;
		transition:
			background-color 0.2s,
			color 0.2s,
			scale 0.25s var(--ease-spring);

		&:active {
			scale: 0.95;
		}

		& :global(.icon) {
			inline-size: 0.9em;
			block-size: 0.9em;
		}
	}

	.step-timer--running {
		color: var(--color-on-accent);
		background: var(--color-accent-strong);
		border-color: var(--color-accent-strong);
	}

	.step-timer--done {
		color: #3d2600;
		background: var(--color-low);
		border-color: var(--color-low-strong);
	}

	/* The digits have one width, so the button does not change its size each second. */
	.step-timer__clock {
		font-variant-numeric: tabular-nums;
	}
</style>
