<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import type { CookedDish } from '../../kitchen/cook-actions';
	import OccasionList from './OccasionList.svelte';
	import OccasionScreen from './OccasionScreen.svelte';

	// The fifth part: the list of the occasions, or the screen of one of them. The screen comes in
	// from the right, as a step deeper, and the list from the left.
	type Props = {
		kitchen: Kitchen;
		oncook: (path: string, scale: number, dish: CookedDish) => void;
	};
	let { kitchen, oncook }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	const open = $derived(kitchen.openOccasion);
</script>

{#key open?.path ?? ''}
	<div in:fly={{ x: open ? 16 : -16, duration }}>
		{#if open}
			<OccasionScreen {kitchen} occasion={open} {oncook} />
		{:else}
			<OccasionList {kitchen} />
		{/if}
	</div>
{/key}
