<script>
	/**
	 * The slots of the week: a square for each meal. A meal that is cooked is ink. A meal in the
	 * hand has a solid outline. A slot that is open has a dashed outline.
	 * @type {{ done: number, hand: number, open: number, total: number }}
	 */
	let { done, hand, open, total } = $props();

	const slots = $derived(
		Array.from({ length: total }, (_, index) =>
			index < done ? 'done' : index < done + hand ? 'hand' : 'open'
		)
	);
</script>

<section class="week" aria-labelledby="week-title">
	<div class="week__head">
		<h2 id="week-title">This week</h2>
		<p class="count" aria-hidden="true">{done}<span class="count__total">/{total}</span></p>
	</div>

	<ul class="week__slots" aria-hidden="true">
		{#each slots as slot, index (index)}
			<li class={['week__slot', `week__slot--${slot}`]}></li>
		{/each}
	</ul>

	<p class="week__text">
		{done} cooked · {hand} in hand · {open} slots open
	</p>
</section>

<style>
	.week {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.week__head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding-block-end: var(--space-1);
		border-block-end: var(--rule-4) solid var(--ink);
	}

	.week__slots {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
		gap: var(--space-1);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.week__slot {
		aspect-ratio: 1.15;
		border: 2px solid var(--ink);
		border-radius: var(--radius-sticker);

		&.week__slot--done {
			background: var(--ink);
		}

		&.week__slot--open {
			border-style: dashed;
		}
	}

	.week__text {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-muted);
	}
</style>
