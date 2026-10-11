<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import CookMode from './CookMode.svelte';
	import type { Kitchen } from './kitchen-state.svelte';
	import PantryList from './PantryList.svelte';
	import PlanList from './PlanList.svelte';
	import RecipeList from './RecipeList.svelte';
	import ShopList from './ShopList.svelte';
	import ViewSwitch from './ViewSwitch.svelte';

	let { kitchen }: { kitchen: Kitchen } = $props();

	const parts = [
		{ value: 'pantry', label: 'Pantry' },
		{ value: 'recipes', label: 'Recipes' },
		{ value: 'plan', label: 'Plan' },
		{ value: 'shop', label: 'Shop' }
	] as const;
	type Part = (typeof parts)[number]['value'];

	let part = $state<Part>('pantry');
	// The new part comes in from the side of its option in the switch.
	let from = $state(-16);
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	const positionOf = (value: Part) => parts.findIndex((option) => option.value === value);
	function show(next: Part) {
		from = positionOf(next) > positionOf(part) ? 16 : -16;
		part = next;
	}

	// The path of the recipe that is in Cook Mode.
	let cooking = $state<string | null>(null);
	const cooked = $derived(kitchen.recipes.find((entry) => entry.path === cooking));
	const cook = (path: string) => (cooking = path);
</script>

{#if cooked}
	<CookMode {kitchen} entry={cooked} onclose={() => (cooking = null)} />
{:else}
	<div class="kitchen">
		<ViewSwitch label="Part of the kitchen" options={parts} value={part} onchange={show} />

		{#key part}
			<div in:fly={{ x: from, duration }}>
				{#if part === 'pantry'}
					<PantryList {kitchen} />
				{:else if part === 'recipes'}
					<RecipeList {kitchen} oncook={cook} />
				{:else if part === 'plan'}
					<PlanList {kitchen} oncook={cook} />
				{:else}
					<ShopList {kitchen} />
				{/if}
			</div>
		{/key}
	</div>
{/if}

<style>
	.kitchen {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--size-4-4);
	}
</style>
