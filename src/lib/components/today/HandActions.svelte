<script>
	import Icon from '$lib/components/ui/Icon.svelte';

	/**
	 * The buttons of the hand, for a keyboard and a mouse: "Back", "Next", and "Shuffle", with
	 * the place of the top card between them.
	 * On a phone, the count and "Next" are in the title of the screen, so only "Shuffle" is here.
	 * @type {{
	 *   number: number,
	 *   total: number,
	 *   onback: () => void,
	 *   onnext: () => void,
	 *   onshuffle: () => void
	 * }}
	 *   number: the place of the top card, from 1. total: the number of meals.
	 */
	let { number, total, onback, onnext, onshuffle } = $props();
</script>

<div class="hand-actions">
	<button
		class="button hand-actions__action hand-actions__wide"
		type="button"
		onclick={onback}
		disabled={total < 2}
	>
		<Icon name="back" />
		Back
	</button>
	<p class="count hand-actions__wide">
		{number}<span class="count__total">/{total}</span>
	</p>
	<button
		class="button hand-actions__action hand-actions__wide"
		type="button"
		onclick={onnext}
		disabled={total < 2}
	>
		Next
		<Icon name="next" />
	</button>
	<button
		class="button button--link hand-actions__action"
		type="button"
		onclick={onshuffle}
		disabled={total < 2}
	>
		Shuffle
	</button>
</div>

<style>
	.hand-actions {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-4);
	}

	.hand-actions__action {
		gap: var(--space-2);
	}

	/* The parts that only a wide hand shows. */
	.hand-actions__wide {
		display: none;
	}

	@container hand (min-width: 36rem) {
		.hand-actions {
			justify-content: flex-start;
		}

		.hand-actions__wide {
			display: inline-flex;
		}
	}
</style>
