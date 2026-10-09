<script>
	import Icon from './Icon.svelte';

	/**
	 * A check box that looks like a chip, for one filter that is on or off.
	 * The chip that is on has an ink fill, bold text, and a check: color is not the only sign.
	 * "disabled": the chip keeps its state, such as the last chip of a group that must stay on.
	 * @type {{ label: string, checked?: boolean, disabled?: boolean }}
	 */
	let { label, checked = $bindable(false), disabled = false } = $props();
</script>

<label class="toggle-chip">
	<input class="visually-hidden" type="checkbox" bind:checked {disabled} />
	<span class="toggle-chip__mark"><Icon name="check" /></span>
	{label}
</label>

<style>
	/* The chip is 32 high. The hit area is 44 high: the label is taller than the fill. */
	.toggle-chip {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		min-block-size: var(--chip-hit);
		padding: 0 var(--space-3);
		font-size: 0.8125rem;
		font-weight: 700;
		background: var(--card);
		border: var(--rule-1) solid var(--ink);
		border-radius: var(--radius-sticker);
		cursor: pointer;
		transition:
			background-color 0.2s,
			color 0.2s,
			scale 0.2s var(--ease-out);

		&:active {
			scale: 0.96;
		}

		&:has(:checked) {
			font-weight: 800;
			color: var(--paper);
			background: var(--ink);
		}

		&:has(:focus-visible) {
			outline: var(--focus-ring);
			outline-offset: 2px;
		}

		&:has(:disabled) {
			cursor: not-allowed;

			&:active {
				scale: none;
			}
		}
	}

	/* An empty square. The check comes into it when the filter is on. */
	.toggle-chip__mark {
		display: grid;
		place-items: center;
		inline-size: 1.125rem;
		block-size: 1.125rem;
		border: 1.5px solid currentColor;
		border-radius: 2px;

		& :global(.icon) {
			inline-size: 0.875rem;
			block-size: 0.875rem;
			opacity: 0;
			scale: 0.4;
			transition:
				opacity 0.15s,
				scale 0.25s var(--ease-out);
		}
	}

	.toggle-chip:has(:checked) .toggle-chip__mark :global(.icon) {
		opacity: 1;
		scale: 1;
	}
</style>
