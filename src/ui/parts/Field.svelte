<script lang="ts">
	import type { Snippet } from 'svelte';

	// A field of a form: a text field, a date field, a text area, or a select, which the screen
	// puts in as its children, with its own value and events. The label is above the field. With
	// no label, the field has its name in its own aria-label, and the piece gives only the look.
	// plain: a value. new: a value that is not an option yet, such as a new place, with a dashed edge.
	// number: a number, such as a price, in the font of the numbers.
	type Props = { label?: string; kind?: 'plain' | 'new' | 'number'; children: Snippet };
	let { label, kind = 'plain', children }: Props = $props();
</script>

{#if label}
	<label class="wfd-field wfd-field--{kind}">
		<span class="wfd-field__label wfd-label">{label}</span>
		{@render children()}
	</label>
{:else}
	<div class="wfd-field wfd-field--{kind}">
		{@render children()}
	</div>
{/if}

<style>
	.wfd-field {
		display: grid;
		gap: var(--wfd-space-group);
		min-inline-size: 0;
	}

	.wfd-field__label {
		color: var(--wfd-color-text-muted);
	}

	/* The selectors name the elements, so that they are stronger than the field rules of Obsidian. */
	.wfd-field :global(:is(input[type='text'], input[type='date'], textarea, select)) {
		box-sizing: border-box;
		inline-size: 100%;
		min-block-size: var(--wfd-control);
		margin: 0;
		padding: 0 var(--wfd-space-inset);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		background-color: var(--wfd-color-control);
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		font-size: var(--wfd-font-size-text);
		font-weight: 600;
	}

	.wfd-field :global(textarea) {
		padding-block: var(--wfd-space-inset);
		line-height: var(--wfd-line-height-text);
		resize: vertical;
	}

	/* The arrow of a select: two small triangles of ink. */
	.wfd-field :global(select:not([multiple])) {
		padding-inline-end: calc(var(--wfd-space-inset) + var(--wfd-space-section));
		background-image:
			linear-gradient(45deg, transparent 50%, var(--wfd-color-text) 50%),
			linear-gradient(135deg, var(--wfd-color-text) 50%, transparent 50%);
		background-repeat: no-repeat;
		background-position:
			calc(100% - 16px) 50%,
			calc(100% - 11px) 50%;
		background-size: 5px 5px;
		appearance: none;
	}

	.wfd-field.wfd-field--new :global(input[type='text']) {
		border-style: dashed;
	}

	.wfd-field.wfd-field--number :global(input[type='text']) {
		font-family: var(--wfd-font-display);
		font-variant-numeric: tabular-nums;
		text-align: end;
	}

	.wfd-field :global(:is(input, textarea, select):focus-visible) {
		border-color: var(--wfd-color-focus);
		outline: var(--wfd-border) solid var(--wfd-color-focus);
		outline-offset: 2px;
		box-shadow: none;
	}

	.wfd-field :global([aria-invalid='true']) {
		border-color: var(--wfd-color-danger);
	}
</style>
