<script lang="ts">
	type Props = {
		label: string;
		on: boolean;
		// What a screen reader says when the label alone is not clear, such as "Sale: eggs".
		name?: string;
		onclick: () => void;
	};
	let { label, on, name, onclick }: Props = $props();
</script>

<!-- A filter. The face is 32 px high, and the button around it is 44 px, for the thumb. -->
<button class="wfd-chip" type="button" aria-pressed={on} aria-label={name} {onclick}>
	<span class="wfd-chip__face" class:wfd-chip__face--on={on}>
		{#if on}<span aria-hidden="true">✓</span>{/if}
		{label}
	</span>
</button>

<style>
	button.wfd-chip {
		flex: none;
		block-size: var(--wfd-control-min);
		padding: 0;
		border: 0;
		background: none;
		box-shadow: none;
		font-family: inherit;
		cursor: pointer;

		&:focus-visible .wfd-chip__face {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	.wfd-chip__face {
		display: flex;
		gap: var(--wfd-space-group);
		align-items: center;
		block-size: 32px;
		padding: 0 var(--wfd-space-inset);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-control);
		color: var(--wfd-color-text);
		font-size: var(--wfd-font-size-small);
		font-weight: 600;
		white-space: nowrap;
		transition:
			background-color var(--wfd-chip-motion),
			color var(--wfd-chip-motion);
	}

	.wfd-chip__face--on {
		border-color: var(--wfd-color-selected);
		background: var(--wfd-color-selected);
		color: var(--wfd-color-on-selected);
	}
</style>
