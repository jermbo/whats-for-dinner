<script lang="ts">
	type Props = { label: string; on: boolean; onclick: () => void };
	let { label, on, onclick }: Props = $props();
</script>

<!-- A filter. The face is 32 px high, and the button around it is 44 px, for the thumb. -->
<button class="wfd-chip" type="button" aria-pressed={on} {onclick}>
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
			outline: 3px solid var(--wfd-olive);
			outline-offset: 2px;
		}
	}

	.wfd-chip__face {
		display: flex;
		gap: 6px;
		align-items: center;
		block-size: 32px;
		padding: 0 12px;
		border: 2px solid var(--wfd-ink);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-card);
		color: var(--wfd-ink);
		font-size: 14px;
		font-weight: 700;
		white-space: nowrap;
		transition:
			background-color 0.15s ease-out,
			color 0.15s ease-out;
	}

	.wfd-chip__face--on {
		background: var(--wfd-ink);
		color: var(--wfd-on-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-chip__face {
			transition: none;
		}
	}
</style>
