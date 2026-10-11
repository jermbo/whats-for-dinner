<script lang="ts">
	type Props = {
		// The preparation of the recipe, with one line for each line of the callout in its note.
		text: string;
		// With `onchange`, the box asks you to confirm the preparation.
		done?: boolean;
		onchange?: (done: boolean) => void;
	};
	let { text, done = false, onchange }: Props = $props();
</script>

<!-- A dashed edge is work that waits. When you confirm the preparation, the edge is olive. -->
<div class="wfd-prep" class:wfd-prep--done={done}>
	<span class="wfd-prep__label wfd-label">Prep</span>
	<p class="wfd-prep__text">{text}</p>
	{#if onchange}
		<label class="wfd-prep__confirm">
			<input
				type="checkbox"
				checked={done}
				onchange={(event) => onchange(event.currentTarget.checked)}
			/>
			Prep is done
		</label>
	{/if}
</div>

<style>
	.wfd-prep {
		display: grid;
		gap: 4px;
		padding: 10px 12px;
		border: 2px dashed var(--wfd-ink-3);
		border-radius: var(--wfd-radius-button);
		transition:
			border-color 0.2s ease-out,
			background-color 0.2s ease-out;
	}

	.wfd-prep--done {
		border-style: solid;
		border-color: var(--wfd-olive);
		background: color-mix(in oklch, var(--wfd-olive) 18%, transparent);
	}

	.wfd-prep__label {
		color: var(--wfd-ink-2);
	}

	.wfd-prep__text {
		margin: 0;
		font-size: 16px;
		line-height: 1.4;
		white-space: pre-line;
	}

	.wfd-prep__confirm {
		display: flex;
		gap: 12px;
		align-items: center;
		min-block-size: 44px;
		font-weight: 700;
		cursor: pointer;
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-prep {
			transition: none;
		}
	}
</style>
