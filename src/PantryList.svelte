<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import FoodCard from './FoodCard.svelte';
	import FoodForm from './FoodForm.svelte';
	import type { Kitchen } from './kitchen-state.svelte';
	import { firstUseBy } from './pantry/total';

	let { kitchen }: { kitchen: Kitchen } = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	const count = $derived(
		`${kitchen.foods.length} ${kitchen.foods.length === 1 ? 'food item' : 'food items'}`
	);

	// The food that you must use first is at the top. Food with no date comes last, by name.
	const sorted = $derived(
		kitchen.foods
			.map((food) => ({ ...food, useBy: firstUseBy(food.item.stocks) }))
			.sort(
				(a, b) =>
					(a.useBy ?? '9999').localeCompare(b.useBy ?? '9999') ||
					a.item.name.localeCompare(b.item.name)
			)
	);
</script>

<section class="pantry" aria-label="Pantry">
	<p class="pantry__count" aria-live="polite">{count}</p>

	<FoodForm
		names={kitchen.foods.map(({ item }) => item.name).sort()}
		places={kitchen.places}
		onadd={(name, stock) => kitchen.addStock(name, stock)}
	/>

	<ul class="pantry__list">
		{#each sorted as { path, item } (path)}
			<li transition:slide={{ duration }}>
				<FoodCard
					{item}
					today={kitchen.today}
					places={kitchen.places}
					onsave={(stocks) => kitchen.setStocks(path, stocks)}
					onopen={() => kitchen.open(path)}
				/>
			</li>
		{/each}
	</ul>
</section>

<style>
	.pantry {
		display: grid;
		gap: var(--size-4-3);
	}

	.pantry__count {
		margin: 0;
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
