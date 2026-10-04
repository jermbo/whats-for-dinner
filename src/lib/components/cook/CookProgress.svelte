<script>
	/**
	 * One mark for each card of Cook mode. The marks of the cards before this one are ink.
	 * This one is olive.
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
		gap: var(--space-1);
		padding-inline: var(--space-5);
	}

	.cook-progress__mark {
		flex: 1;
		block-size: 0.5rem;
		background: var(--paper-deep);
		transition: background-color 0.3s;
	}

	.cook-progress__mark--done {
		background: var(--ink);
	}

	.cook-progress__mark--current {
		background: var(--olive);
		box-shadow: inset 0 0 0 2px var(--ink);
	}
</style>
