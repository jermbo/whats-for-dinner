<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import Button from '../parts/Button.svelte';
	import PickOne from '../parts/PickOne.svelte';

	type Props = {
		// The store of the trip, or no text.
		store: string;
		// The stores of the receipts.
		stores: string[];
		onchange: (store: string) => void;
	};
	let { store, stores, onchange }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	// You select the store one time, at the start of the trip. After that, it is one short line, so
	// that the list stays at the top. The choice stays open while you type a new store, until "Done".
	let changing = $state(false);

	function change(next: string) {
		changing = true;
		onchange(next);
	}
</script>

{#if store && !changing}
	<div class="wfd-trip-store">
		<span class="wfd-trip-store__name"><span class="wfd-label">Store</span> {store}</span>
		<Button kind="link" onclick={() => (changing = true)}>Change</Button>
	</div>
{:else}
	<div class="wfd-trip-store__pick" transition:slide={{ duration }}>
		<PickOne
			legend="Store"
			options={stores}
			value={store}
			other="A new store"
			canBeOff
			onchange={change}
		/>
		{#if changing}
			<Button kind="link" onclick={() => (changing = false)}>Done</Button>
		{/if}
	</div>
{/if}

<style>
	.wfd-trip-store {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: center;
		justify-content: space-between;
	}

	.wfd-trip-store__name {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: baseline;
		font-weight: 700;
	}

	.wfd-trip-store__pick {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		justify-items: start;
	}
</style>
