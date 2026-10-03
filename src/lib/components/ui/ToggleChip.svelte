<script>
	import Icon from './Icon.svelte';

	/**
	 * A check box that looks like a pill, for one filter that is on or off.
	 * The pill that is on has a dark fill, bold text, and a check: color is not the only sign.
	 * @type {{ label: string, checked?: boolean }}
	 */
	let { label, checked = $bindable(false) } = $props();
</script>

<label class="toggle-chip">
	<input class="visually-hidden" type="checkbox" bind:checked />
	<span class="toggle-chip__mark"><Icon name="check" /></span>
	{label}
</label>

<style>
	.toggle-chip {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		min-block-size: var(--tap);
		padding: var(--space-2) var(--space-5) var(--space-2) var(--space-3);
		font-weight: 500;
		color: var(--color-muted);
		background: var(--color-surface);
		border-radius: var(--radius-pill);
		box-shadow: var(--shadow);
		cursor: pointer;
		transition:
			background-color 0.25s,
			color 0.25s,
			scale 0.25s var(--ease-spring);

		&:active {
			scale: 0.95;
		}

		&:has(:checked) {
			font-weight: 600;
			color: var(--color-on-accent);
			background: var(--color-accent-strong);
		}

		&:has(:focus-visible) {
			outline: 3px solid var(--color-accent-strong);
			outline-offset: 2px;
		}
	}

	/* An empty ring. The check comes into it when the filter is on. */
	.toggle-chip__mark {
		display: grid;
		place-items: center;
		inline-size: 1.5rem;
		block-size: 1.5rem;
		border: 1.5px solid currentColor;
		border-radius: 50%;

		& :global(.icon) {
			inline-size: 1rem;
			block-size: 1rem;
			opacity: 0;
			scale: 0.4;
			transition:
				opacity 0.15s,
				scale 0.3s var(--ease-spring);
		}
	}

	.toggle-chip:has(:checked) .toggle-chip__mark :global(.icon) {
		opacity: 1;
		scale: 1;
	}
</style>
