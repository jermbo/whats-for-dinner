<script>
	import Icon from '$lib/components/ui/Icon.svelte';

	/**
	 * The hint at the lower edge of a card of Cook mode: it shows where a tap goes. A tap on the
	 * left half of the card goes back, and a tap on the right half goes to the next card. The two
	 * hints are also buttons, for the keyboard and for screen readers.
	 * @type {{ back: boolean, next: string, onback: () => void, onnext: () => void }}
	 *   back: the card has a card before it. next: the name of the next card, such as "Step 1".
	 *   Empty: this is the last card.
	 */
	let { back, next, onback, onnext } = $props();
</script>

<footer class="cook-hint">
	{#if back}
		<button class="cook-hint__way" type="button" onclick={onback}>
			<Icon name="back" />
			Back
		</button>
	{/if}
	{#if next}
		<button class="cook-hint__way cook-hint__way--next" type="button" onclick={onnext}>
			{next}
			<Icon name="next" />
		</button>
	{/if}
</footer>

<style>
	.cook-hint {
		display: flex;
		flex: none;
		justify-content: space-between;
		padding: 0 var(--space-3) max(var(--space-1), env(safe-area-inset-bottom));
	}

	.cook-hint__way {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		min-block-size: var(--tap);
		padding: 0 var(--space-2);
		font-weight: 800;
		color: var(--ink-soft);
		background: none;
		border: 0;
		border-radius: var(--radius-control);
		cursor: pointer;

		& :global(.icon) {
			inline-size: 1.25rem;
			block-size: 1.25rem;
			transition: translate 0.25s var(--ease-out);
		}

		&:active :global(.icon) {
			translate: -0.25rem 0;
		}
	}

	/* The next card is the usual way: its hint is ink, at the right edge. */
	.cook-hint__way--next {
		margin-inline-start: auto;
		color: var(--ink);

		&:active :global(.icon) {
			translate: 0.25rem 0;
		}
	}
</style>
