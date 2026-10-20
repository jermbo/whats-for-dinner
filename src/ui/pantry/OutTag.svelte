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
		min-block-size: 40px;
		padding: 6px 14px;
		border: 2px dashed var(--wfd-ink-3);
		border-radius: 999px;
		background: none;
		box-shadow: none;
		color: var(--wfd-ink-2);
		font-family: inherit;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		transition:
			border-color 0.15s ease-out,
			color 0.15s ease-out,
			scale 0.1s ease-out;

		&:focus-visible {
			outline: 2px solid var(--wfd-ink);
			outline-offset: 2px;
		}

		&:active {
			scale: 0.97;
		}
	}

	@media (hover: hover) {
		button.wfd-tag:hover {
			border-color: var(--wfd-ink);
			color: var(--wfd-ink);
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
