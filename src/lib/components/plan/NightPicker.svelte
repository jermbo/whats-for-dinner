<script>
	import { nightShort, nightStart } from '$lib/domain/nights';

	/**
	 * The nights of the week as a row of squares. A tap on a square switches the night: an ink
	 * square is a night with a meal, and a white square is a night off.
	 * @type {{ week: string[], value: string[] }}
	 *   week: the nights that the plan can have. value: the nights of the plan.
	 */
	let { week, value = $bindable() } = $props();

	/** @param {string} night */
	function toggle(night) {
		value = value.includes(night) ? value.filter((entry) => entry !== night) : [...value, night];
	}
</script>

<fieldset class="nights">
	<legend class="visually-hidden">The nights with a meal</legend>
	{#each week as night (night)}
		<label class="nights__day">
			<input
				class="visually-hidden"
				type="checkbox"
				checked={value.includes(night)}
				onchange={() => toggle(night)}
			/>
			<span class="label">{nightShort(night)}</span>
			<span class="nights__date">{new Date(nightStart(night)).getDate()}</span>
		</label>
	{/each}
</fieldset>

<style>
	.nights {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		gap: var(--space-1);
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	/* A night off: a white square with an ink rule. */
	.nights__day {
		display: grid;
		justify-items: center;
		gap: var(--space-1);
		padding: var(--space-3) 0 var(--space-2);
		background: var(--card);
		border: 2px solid var(--ink);
		border-radius: var(--radius-control);
		cursor: pointer;
		transition:
			background-color 0.2s,
			color 0.2s,
			scale 0.3s var(--ease-spring);

		/* A night with a meal: ink. */
		&:has(:checked) {
			color: var(--paper);
			background: var(--ink);
		}

		&:has(:focus-visible) {
			outline: 3px solid var(--ink);
			outline-offset: 2px;
		}

		&:active {
			scale: 0.92;
		}
	}

	.nights__date {
		font-family: var(--font-display);
		font-size: 1.75rem;
		line-height: 0.9;
	}
</style>
