<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import Button from '../parts/Button.svelte';
	import PickOne from '../parts/PickOne.svelte';

	type Props = {
		// The store of the trip, or no text.
		store: string;
		// The stores of the receipts.
		stores: string[];
		onchange: (store: string) => void;
		ondone: () => void;
	};
	let { store, stores, onchange, ondone }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
</script>

<!--
	You select the store one time, at the start of the trip, so its choice opens only from the
	small store button of the bar. It stays open while you type a new store, until "Done".
-->
<div class="wfd-trip-store" in:fade={{ duration }}>
	<PickOne
		legend="Store"
		options={stores}
		value={store}
		other="A new store"
		canBeOff
		{onchange}
	/>
	<Button kind="plain" mark="✓" onclick={ondone}>Done</Button>
</div>

<style>
	.wfd-trip-store {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-group);
		justify-items: start;
	}
</style>
