<script lang="ts">
	type Props = { name: string; planned: boolean; onclick: () => void };
	let { name, planned, onclick }: Props = $props();
</script>

<!-- One tap puts a recipe in the week, and a second tap takes it out. -->
<button
	class="wfd-week"
	class:wfd-week--on={planned}
	type="button"
	aria-pressed={planned}
	aria-label="{name} in the week"
	title={planned ? 'In the week' : 'Add to the week'}
	{onclick}
>
	{#key planned}
		<span class="wfd-week__mark" aria-hidden="true">{planned ? '✓' : '+'}</span>
	{/key}
</button>

<style>
	button.wfd-week {
		flex: none;
		inline-size: 46px;
		block-size: var(--wfd-control-min);
		padding: 0;
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-control);
		box-shadow: none;
		color: var(--wfd-color-text-muted);
		font-family: inherit;
		font-size: var(--wfd-font-size-title);
		font-weight: 800;
		line-height: var(--wfd-line-height-single);
		cursor: pointer;
		transition:
			border-color var(--wfd-chip-motion),
			color var(--wfd-chip-motion);

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
			box-shadow: none;
		}
	}

	/* In the week: the edge and the check are ink. */
	button.wfd-week--on {
		border-color: var(--wfd-color-border);
		color: var(--wfd-color-text);
	}

	.wfd-week__mark {
		display: block;
		animation: land var(--wfd-motion-move) var(--wfd-ease-out);
	}

	@keyframes land {
		from {
			scale: 0.3;
			rotate: -90deg;
		}
	}
</style>
