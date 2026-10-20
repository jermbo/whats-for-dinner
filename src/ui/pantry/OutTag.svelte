<script lang="ts">
	let { name, onclick }: { name: string; onclick: () => void } = $props();
</script>

<!-- Food that is out: only its name, dashed as an empty place. A tap opens its card. -->
<button class="wfd-tag" type="button" {onclick}>
	{name}<span class="wfd-tag__hidden">, out</span>
</button>

<style>
	button.wfd-tag {
		block-size: auto;
		min-block-size: var(--wfd-control-min);
		padding: var(--wfd-space-tight) var(--wfd-space-inset);
		border: var(--wfd-border) dashed var(--wfd-color-text-faint);
		border-radius: var(--wfd-radius-sticker);
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text-muted);
		font-family: inherit;
		font-size: var(--wfd-font-size-text);
		font-weight: 500;
		cursor: pointer;
		transition:
			border-color var(--wfd-motion-change) var(--wfd-ease-out),
			color var(--wfd-motion-change) var(--wfd-ease-out),
			scale var(--wfd-button-motion);

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}

		&:active {
			scale: 0.97;
		}
	}

	@media (hover: hover) {
		button.wfd-tag:hover {
			border-color: var(--wfd-color-border);
			color: var(--wfd-color-text);
		}
	}

	.wfd-tag__hidden {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
