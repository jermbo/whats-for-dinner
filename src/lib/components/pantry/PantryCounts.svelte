<script>
	import { pop } from '$lib/motion/transitions';

	/**
	 * The answer of the pantry at the right of the title: some counts, each with its word. For
	 * example "2 low, 1 out", or "1 today". A count pops when it changes.
	 * @type {{ parts: { count: number, label: string }[] }}
	 */
	let { parts } = $props();
</script>

<p class="pantry-counts">
	{#each parts as part (part.label)}
		<span class={['pantry-counts__part', part.count === 0 && 'pantry-counts__part--none']} in:pop>
			{#key part.count}
				<span class="count pantry-counts__count" in:pop>{part.count}</span>
			{/key}
			<span class="label">{part.label}</span>
		</span>
	{/each}
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

	/* A transform needs a box. */
	.pantry-counts__count {
		display: inline-block;
		transform-origin: bottom center;
	}

	/* A zero is there, so that the title does not jump, but it does not ask for attention. */
	.pantry-counts__part--none {
		color: var(--ink-soft);
		opacity: 0.6;
	}
</style>
