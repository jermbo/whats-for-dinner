<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import Button from '../parts/Button.svelte';

	type Props = {
		// The food item is a row of the list, or an item of the cart.
		onList: boolean;
		onadd: () => void;
	};
	let { onList, onadd }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
</script>

<!-- You see that the milk is low while you look at the fridge, so the list is one tap away. -->
<div class="wfd-on-list" aria-live="polite">
	{#if onList}
		<span class="wfd-on-list__fact wfd-label" in:fade={{ duration }}>
			<span aria-hidden="true">✓</span> On the list
		</span>
	{:else}
		<Button onclick={onadd}>Add to the list</Button>
	{/if}
</div>

<style>
	.wfd-on-list {
		display: flex;
		justify-content: end;
		min-block-size: var(--wfd-control);
		align-items: center;
		padding-block-start: var(--wfd-space-group);
	}

	.wfd-on-list__fact {
		color: var(--wfd-color-text-muted);
	}
</style>
