<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	// main: the main action of a form. quiet: a second action. olive: the pill, an action that
	// completes a task or goes forward, in the accent colour. plain: a second action on an open
	// card, with no edge. danger: an action that removes a thing. link: an action that is not
	// important, in the colour of the text around it, so that it also reads on ink and on the
	// dark frame. `arrow` is for an action that opens a different screen, and `mark` is a small
	// sign before the label.
	type Props = HTMLButtonAttributes & {
		kind?: 'main' | 'quiet' | 'olive' | 'plain' | 'danger' | 'link';
		arrow?: boolean;
		mark?: string;
		children: Snippet;
	};
	let { kind = 'quiet', arrow = false, mark, type = 'button', children, ...rest }: Props = $props();
</script>

<button class="wfd-button wfd-button--{kind}" class:wfd-button--arrow={arrow} {type} {...rest}>
	{#if mark}<span class="wfd-button__mark" aria-hidden="true">{mark}</span>{/if}
	<span class="wfd-button__label">{@render children()}</span>
	{#if arrow}<span class="wfd-button__arrow" aria-hidden="true">→</span>{/if}
</button>

<style>
	/* The selectors name the element, so that they are stronger than the button rules of Obsidian. */
	button.wfd-button {
		display: inline-flex;
		gap: var(--wfd-space-group);
		align-items: center;
		justify-content: center;
		block-size: auto;
		min-block-size: var(--wfd-control);
		padding: 0 var(--wfd-space-inset);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		box-shadow: none;
		font-family: inherit;
		font-size: var(--wfd-font-size-text);
		font-weight: 700;
		line-height: var(--wfd-line-height-display);
		text-align: center;
		white-space: normal;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
			box-shadow: none;
		}

		&:disabled {
			opacity: 0.5;
			cursor: default;
		}
	}

	button.wfd-button--main {
		border-color: var(--wfd-color-selected);
		background: var(--wfd-color-selected);
		color: var(--wfd-color-on-selected);
	}

	button.wfd-button--quiet {
		border-color: var(--wfd-color-border);
		background: var(--wfd-color-control);
		color: var(--wfd-color-text);
	}

	/* The pill: the one look of "forward" in each part. */
	button.wfd-button--olive {
		min-block-size: var(--wfd-control-pill);
		padding-inline: var(--wfd-space-section);
		border-color: var(--wfd-color-primary);
		border-radius: var(--wfd-radius-pill);
		background: var(--wfd-color-primary);
		color: var(--wfd-color-on-primary);
		font-family: var(--wfd-font-display);
		font-size: var(--wfd-font-size-name);
	}

	/* The arrow sits in a circle at the end. "Cook" grows this circle into Cook Mode. */
	button.wfd-button--arrow {
		justify-content: space-between;
		padding-inline-end: var(--wfd-space-group);
	}

	.wfd-button__arrow {
		display: grid;
		flex: none;
		place-items: center;
		inline-size: var(--wfd-control-min);
		block-size: var(--wfd-control-min);
		border-radius: var(--wfd-radius-pill);
		background: var(--wfd-color-on-primary);
		color: var(--wfd-color-primary);
		transition: translate var(--wfd-chip-motion);
	}

	@media (hover: hover) {
		button.wfd-button--arrow:hover .wfd-button__arrow {
			translate: 4px 0;
		}
	}

	/* A second action on an open card: no edge, so the pill is the one thing that stands out. */
	button.wfd-button--plain {
		border-color: transparent;
		background: none;
		color: var(--wfd-color-text);
		transition: background-color var(--wfd-chip-motion);
	}

	@media (hover: hover) {
		button.wfd-button--plain:hover {
			background: color-mix(in oklch, currentcolor 12%, transparent);
		}
	}

	.wfd-button__mark {
		font-size: var(--wfd-font-size-name);
		line-height: var(--wfd-line-height-single);
	}

	button.wfd-button--danger {
		border-color: var(--wfd-color-danger);
		background: var(--wfd-color-control);
		color: var(--wfd-color-danger);
	}

	button.wfd-button--link {
		min-block-size: var(--wfd-control-min);
		padding: 0;
		border: 0;
		background: none;
		color: inherit;

		&:focus-visible {
			outline-color: currentcolor;
		}
		font-weight: 600;
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
	}
</style>
