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
		block-size: 46px;
		padding: 0;
		border: 2px solid var(--wfd-line);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-quiet);
		box-shadow: none;
		color: var(--wfd-ink-2);
		font-family: inherit;
		font-size: 24px;
		font-weight: 800;
		line-height: 1;
		cursor: pointer;
		transition:
			border-color 0.2s ease-out,
			color 0.2s ease-out;

		&:focus-visible {
			outline: 2px solid var(--wfd-ink);
			outline-offset: 2px;
			box-shadow: none;
		}
	}

	/* In the week: the edge and the check are ink. */
	button.wfd-week--on {
		border-color: var(--wfd-ink);
		color: var(--wfd-ink);
	}

	.wfd-week__mark {
		display: block;
		animation: land 0.25s ease-out;
	}

	@keyframes land {
		from {
			scale: 0.3;
			rotate: -90deg;
		}
		70% {
			scale: 1.25;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		button.wfd-week {
			transition: none;
		}

		.wfd-week__mark {
			animation: none;
		}
	}
</style>
