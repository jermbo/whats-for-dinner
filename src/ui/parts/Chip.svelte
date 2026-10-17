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
		block-size: 44px;
		padding: 0;
		border: 0;
		background: none;
		box-shadow: none;
		font-family: inherit;
		cursor: pointer;

		&:focus-visible .wfd-chip__face {
			outline: 2px solid var(--wfd-ink);
			outline-offset: 2px;
		}
	}

	.wfd-chip__face {
		display: flex;
		gap: 6px;
		align-items: center;
		block-size: 32px;
		padding: 0 12px;
		border: 2px solid var(--wfd-line);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-quiet);
		color: var(--wfd-ink);
		font-size: 14px;
		font-weight: 600;
		white-space: nowrap;
		transition:
			background-color 0.15s ease-out,
			color 0.15s ease-out;
	}

	.wfd-chip__face--on {
		border-color: var(--wfd-ink);
		background: var(--wfd-ink);
		color: var(--wfd-on-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-chip__face {
			transition: none;
		}
	}
</style>
