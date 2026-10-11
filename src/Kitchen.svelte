<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import type { FoodNote, Note } from './note';
	import PantryList from './PantryList.svelte';
	import RecipeList from './RecipeList.svelte';
	import ViewSwitch from './ViewSwitch.svelte';

	let { notes, foods }: { notes: Note[]; foods: FoodNote[] } = $props();

	const parts = [
		{ value: 'pantry', label: 'Pantry' },
		{ value: 'recipes', label: 'Recipes' }
	] as const;
	let part = $state<(typeof parts)[number]['value']>('pantry');

	// The new part comes in from the side of its option in the switch.
	const from = $derived(part === 'pantry' ? -16 : 16);
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
</script>

<div class="kitchen">
	<ViewSwitch label="Part of the kitchen" options={parts} bind:value={part} />

	{#key part}
		<div in:fly={{ x: from, duration }}>
			{#if part === 'pantry'}
				<PantryList {foods} />
			{:else}
				<RecipeList {notes} />
			{/if}
		</div>
	{/key}
</div>

<style>
	.kitchen {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--size-4-4);
	}
</style>
