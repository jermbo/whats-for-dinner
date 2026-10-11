<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import FoodCard from './FoodCard.svelte';
	import type { FoodNote } from './note';

	let { foods }: { foods: FoodNote[] } = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	const sorted = $derived([...foods].sort((a, b) => a.item.name.localeCompare(b.item.name)));
	const count = $derived(`${foods.length} ${foods.length === 1 ? 'food item' : 'food items'}`);
</script>

<section class="pantry" aria-label="Pantry">
	<p class="pantry__count" aria-live="polite">{count}</p>

	<ul class="pantry__list">
		{#each sorted as { path, item } (path)}
			<li transition:slide={{ duration }}>
				<FoodCard {item} />
			</li>
		{/each}
	</ul>
</section>

<style>
	.pantry__count {
		margin-block: 0 var(--size-4-3);
		color: var(--text-muted);
	}

	.pantry__list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
		gap: var(--size-4-3);
		align-items: start;
		margin: 0;
		padding: 0;
		list-style: none;
	}
</style>
