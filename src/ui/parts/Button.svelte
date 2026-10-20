<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	// main: the one action of a card. quiet: a second action. olive: an action that completes a
	// task. danger: an action that removes a thing. link: an action that is not important, in the
	// colour of the text around it, so that it also reads on ink and on the dark frame.
	type Props = HTMLButtonAttributes & {
		kind?: 'main' | 'quiet' | 'olive' | 'danger' | 'link';
		children: Snippet;
	};
	let { kind = 'quiet', type = 'button', children, ...rest }: Props = $props();
</script>

<button class="wfd-button wfd-button--{kind}" {type} {...rest}>
	{@render children()}
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
		transition: translate var(--wfd-button-motion);

		&:active {
			translate: 0 2px;
		}

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

	button.wfd-button--olive {
		border-color: var(--wfd-color-on-primary);
		background: var(--wfd-color-primary);
		color: var(--wfd-color-on-primary);
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
