<script lang="ts">
	import type { Snippet } from 'svelte';

	// One item of a list: its name, a small line below it, and one number. The parts are spans, so
	// that a line can be the content of a button. A text can also be a snippet, for a part with a
	// state of its own, such as a price that fades in.
	type Text = string | Snippet;
	type Props = {
		name: string;
		// The small line below the name, such as the recipes that need the item.
		small?: Text;
		// The one number, such as the amount, and a small line below it, such as the price.
		number?: Text;
		numberSmall?: Text;
		// Text for a screen reader after the number, for a fact that only a colour shows.
		hint?: string;
		// A mark before the name, such as the box of the Shop.
		mark?: Snippet;
		// A tag after the name, such as a sticker.
		tag?: Snippet;
		// A control after the number, such as "Add".
		control?: Snippet;
	};
	let { name, small, number, numberSmall, hint, mark, tag, control }: Props = $props();
</script>

{#snippet text(value: Text)}
	{#if typeof value === 'string'}{value}{:else}{@render value()}{/if}
{/snippet}

<span class="wfd-list-line">
	{#if mark}<span class="wfd-list-line__mark">{@render mark()}</span>{/if}
	<span class="wfd-list-line__text">
		<span class="wfd-list-line__top">
			<span class="wfd-list-line__name">{name}</span>
			{#if tag}{@render tag()}{/if}
		</span>
		{#if small}<span class="wfd-list-line__small">{@render text(small)}</span>{/if}
	</span>
	{#if number || numberSmall || hint}
		<span class="wfd-list-line__end">
			{#if number}<span class="wfd-list-line__number wfd-number">{@render text(number)}</span>{/if}
			{#if numberSmall}<span class="wfd-list-line__small">{@render text(numberSmall)}</span>{/if}
			{#if hint}<span class="wfd-list-line__hidden">{hint}</span>{/if}
		</span>
	{/if}
	{#if control}{@render control()}{/if}
</span>

<style>
	/* The name takes the room that is left, so a long name wraps and the number keeps its place. */
	.wfd-list-line {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: center;
		min-inline-size: 0;
		text-align: start;
	}

	.wfd-list-line__mark {
		display: flex;
		flex: none;
		gap: var(--wfd-space-group);
		align-items: center;
	}

	.wfd-list-line__text {
		display: grid;
		flex: 1;
		gap: var(--wfd-space-tight);
		min-inline-size: 0;
	}

	.wfd-list-line__top {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-tight) var(--wfd-space-group);
		align-items: center;
	}

	.wfd-list-line__name {
		min-inline-size: 0;
		font-size: var(--wfd-font-size-name);
		font-weight: 600;
		line-height: var(--wfd-line-height-display);
		overflow-wrap: anywhere;
	}

	/* An item that a recipe names can start with a small letter: "onions". The list shows "Onions". */
	.wfd-list-line__name::first-letter {
		text-transform: uppercase;
	}

	.wfd-list-line__small {
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
		font-weight: 500;
		line-height: var(--wfd-line-height-text);
	}

	.wfd-list-line__end {
		display: grid;
		flex: none;
		gap: var(--wfd-space-tight);
		justify-items: end;
		text-align: end;
	}

	.wfd-list-line__number {
		font-size: var(--wfd-font-size-title);
		white-space: nowrap;
	}

	.wfd-list-line__hidden {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
