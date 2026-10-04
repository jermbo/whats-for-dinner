<script>
	/**
	 * The count of the hand and the action "Next", in the top row of the "Today" screen:
	 * "1/3 Next →".
	 * @type {{ number: number, total: number, onnext: () => void }}
	 */
	let { number, total, onnext } = $props();
</script>

<div class="hand-next">
	<p class="count hand-next__count">
		{number}<span class="count__total">/{total}</span>
		<span class="visually-hidden">Meal {number} of {total}</span>
	</p>
	<button class="hand-next__button" type="button" onclick={onnext} disabled={total < 2}>
		Next <span aria-hidden="true">→</span>
		<span class="visually-hidden">meal</span>
	</button>
</div>

<style>
	.hand-next {
		display: flex;
		align-items: baseline;
		gap: var(--space-3);
	}

	.hand-next__count {
		font-size: 1.5rem;
	}

	/* A text action. The area that a finger hits is 44 high. */
	.hand-next__button {
		min-block-size: var(--chip-hit);
		padding: 0;
		font-size: 1.0625rem;
		font-weight: 800;
		background: none;
		border: 0;
		cursor: pointer;

		&:disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}
	}

	/* A wide area has the actions "Back" and "Next" under the pile. */
	@container hand (min-width: 36rem) {
		.hand-next {
			display: none;
		}
	}
</style>
