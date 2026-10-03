<script>
	import { splitByTimes } from '$lib/data/step-text';
	import StepTimer from './StepTimer.svelte';

	/** @typedef {import('$lib/types').CookTimer} CookTimer */

	/**
	 * The text of a step in Cook mode. Each time in the text is a timer button. The app reads
	 * the times from the text, so the recipe has no timer fields.
	 * @type {{
	 *   step: import('$lib/types').RecipeStep,
	 *   timers: CookTimer[],
	 *   now: number,
	 *   onstart: (time: { stepId: string, index: number, seconds: number }) => void,
	 *   onstop: (timer: CookTimer) => void
	 * }}
	 */
	let { step, timers, now, onstart, onstop } = $props();

	/** Each part of the text. A part that is a time has "time", with its place and its length. */
	const parts = $derived(
		splitByTimes(step.text).map(({ text, seconds, index }) => ({
			text,
			time:
				seconds === undefined || index === undefined ? null : { stepId: step.id, index, seconds }
		}))
	);

	/** @param {number} index The place of the time in the step. */
	const timerAt = (index) =>
		timers.find((timer) => timer.stepId === step.id && timer.index === index);
</script>

{#each parts as part, at (at)}
	{#if part.time}
		{@const time = part.time}
		<StepTimer
			label={part.text}
			seconds={time.seconds}
			timer={timerAt(time.index)}
			{now}
			onstart={() => onstart(time)}
			{onstop}
		/>
	{:else}
		{part.text}
	{/if}
{/each}
