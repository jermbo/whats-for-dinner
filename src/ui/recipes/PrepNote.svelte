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
		gap: var(--wfd-space-tight);
		padding: var(--wfd-space-inset) var(--wfd-space-inset);
		border: var(--wfd-border) dashed var(--wfd-color-text-faint);
		border-radius: var(--wfd-radius-button);
		transition:
			border-color var(--wfd-motion-change) var(--wfd-ease-out),
			background-color var(--wfd-motion-change) var(--wfd-ease-out);
	}

	.wfd-prep--done {
		border-style: solid;
		border-color: var(--wfd-color-primary);
		background: color-mix(in oklch, var(--wfd-color-primary) 18%, transparent);
	}

	.wfd-prep__label {
		color: var(--wfd-color-text-muted);
	}

	.wfd-prep__text {
		margin: 0;
		font-size: var(--wfd-font-size-text);
		line-height: var(--wfd-line-height-text);
		white-space: pre-line;
	}

	.wfd-prep__confirm {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: center;
		min-block-size: var(--wfd-control-min);
		font-weight: 700;
		cursor: pointer;
	}
</style>
