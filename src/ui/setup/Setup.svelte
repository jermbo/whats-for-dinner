<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import type { SetupStep } from '../../setup/screen';
	import FoodStep from './FoodStep.svelte';
	import HomeStep from './HomeStep.svelte';
	import PlacesStep from './PlacesStep.svelte';
	import RecipesStep from './RecipesStep.svelte';

	let { kitchen, step }: { kitchen: Kitchen; step: SetupStep } = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
</script>

<!-- Setup has no control to skip it: each step goes on only to the next. -->
<div class="wfd-setup">
	{#key step}
		<div in:fly={{ x: 16, duration }}>
			{#if step === 'recipes'}
				<RecipesStep {kitchen} />
			{:else if step === 'home'}
				<HomeStep {kitchen} />
			{:else if step === 'places'}
				<PlacesStep {kitchen} />
			{:else}
				<FoodStep {kitchen} />
			{/if}
		</div>
	{/key}
</div>

<style>
	.wfd-setup {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		max-inline-size: 40rem;
		padding: var(--wfd-space-page) var(--wfd-space-page)
			max(var(--safe-area-inset-bottom, 0px), var(--wfd-space-section));
	}
</style>
