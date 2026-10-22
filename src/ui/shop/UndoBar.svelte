<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';

	type Props = { name: string; onundo: () => void };
	let { name, onundo }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
</script>

<!-- The full bar is one button, so that the thumb finds it with no aim. -->
<button class="wfd-undo-bar" type="button" transition:fly={{ y: 12, duration }} onclick={onundo}>
	<span class="wfd-undo-bar__name">✓ {name}</span>
	<span class="wfd-undo-bar__undo">↶ Undo</span>
</button>

<style>
	/* On a wide tab, the bar keeps the width of a phone, in the middle. */
	button.wfd-undo-bar {
		justify-self: center;
		inline-size: min(100%, 28rem);
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: center;
		justify-content: space-between;
		block-size: auto;
		min-block-size: var(--wfd-control);
		padding: 0 var(--wfd-space-section);
		border: 0;
		border-radius: var(--wfd-radius-pill);
		background: var(--wfd-color-selected);
		box-shadow: none;
		color: var(--wfd-color-on-selected);
		font-family: inherit;
		font-weight: 600;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	.wfd-undo-bar__name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.wfd-undo-bar__undo {
		flex: none;
		font-weight: 800;
	}
</style>
