<script>
	/**
	 * One segment for each card of Cook mode, on the dark surround. The segments of the cards
	 * before this one are white. This one is olive.
	 * @type {{ keys: string[], index: number }}
	 *   keys: the key of each card. index: the place of the card on the screen.
	 */
	let { keys, index } = $props();
</script>

<div class="cook-progress" aria-hidden="true">
	{#each keys as key, at (key)}
		<span
			class={[
				'cook-progress__mark',
				at < index && 'cook-progress__mark--done',
				at === index && 'cook-progress__mark--current'
			]}
		></span>
	{/each}
</div>

<style>
	.cook-progress {
		display: flex;
		flex: 1;
		gap: var(--space-1);
	}

	.cook-progress__mark {
		flex: 1;
		block-size: 0.375rem;
		background: var(--ink-soft);
		transition:
			background-color 0.3s,
			scale 0.35s var(--ease-spring);
	}

	.cook-progress__mark--done {
		background: var(--card);
	}

	/* The card on the screen: olive, and a little higher. */
	.cook-progress__mark--current {
		background: var(--olive);
		scale: 1 1.5;
	}
</style>
