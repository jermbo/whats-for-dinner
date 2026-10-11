<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	// main: the one action of a card. quiet: a second action. olive: an action that completes a
	// task. link: an action that is not important.
	type Props = HTMLButtonAttributes & {
		kind?: 'main' | 'quiet' | 'olive' | 'link';
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
		gap: 8px;
		align-items: center;
		justify-content: center;
		block-size: auto;
		min-block-size: 50px;
		padding: 0 20px;
		border: 2px solid var(--wfd-ink);
		border-radius: var(--wfd-radius-button);
		box-shadow: none;
		font-family: inherit;
		font-size: 16px;
		font-weight: 700;
		line-height: 1.2;
		text-align: center;
		white-space: normal;
		cursor: pointer;
		transition: translate 0.1s ease-out;

		&:active {
			translate: 0 2px;
		}

		&:focus-visible {
			outline: 3px solid var(--wfd-olive);
			outline-offset: 2px;
			box-shadow: none;
		}

		&:disabled {
			opacity: 0.5;
			cursor: default;
		}
	}

	button.wfd-button--main {
		background: var(--wfd-ink);
		color: var(--wfd-on-ink);
	}

	button.wfd-button--quiet {
		background: var(--wfd-card);
		color: var(--wfd-ink);
	}

	button.wfd-button--olive {
		background: var(--wfd-olive);
		color: var(--wfd-on-olive);
	}

	button.wfd-button--link {
		min-block-size: 44px;
		padding: 0;
		border: 0;
		background: none;
		color: var(--wfd-ink);
		font-weight: 600;
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
	}

	@media (prefers-reduced-motion: reduce) {
		button.wfd-button {
			transition: none;
		}
	}
</style>
