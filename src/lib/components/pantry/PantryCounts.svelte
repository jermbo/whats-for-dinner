<script>
	/**
	 * The answer to "what must I buy?" at the right of the title: the items that are low, and
	 * the items that are out.
	 * @type {{ low: number, out: number }}
	 */
	let { low, out } = $props();
</script>

<p class="pantry-counts">
	<span class={['pantry-counts__part', low === 0 && 'pantry-counts__part--none']}>
		<span class="count">{low}</span>
		<span class="label">low</span>
	</span>
	<span class={['pantry-counts__part', out === 0 && 'pantry-counts__part--none']}>
		<span class="count">{out}</span>
		<span class="label">out</span>
	</span>
</p>

<style>
	.pantry-counts {
		display: flex;
		align-items: baseline;
		gap: var(--space-4);
	}

	.pantry-counts__part {
		display: flex;
		align-items: baseline;
		gap: var(--space-1);
	}

	/* A zero is there, so that the title does not jump, but it does not ask for attention. */
	.pantry-counts__part--none {
		color: var(--ink-soft);
		opacity: 0.6;
	}
</style>
