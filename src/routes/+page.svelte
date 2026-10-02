<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import MealFilter from '$lib/components/menu/MealFilter.svelte';
	import MenuCard from '$lib/components/menu/MenuCard.svelte';
	import PantryIdeas from '$lib/components/menu/PantryIdeas.svelte';
	import { useKitchen } from '$lib/kitchen.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { canMake } from '$lib/data/availability';
	import { cook } from '$lib/data/cooking';
	import { addToMenu, markPrepDone, menuEntries } from '$lib/data/menu';
	import { status } from '$lib/status.svelte';
	import { greeting, nowMs, todayInWords } from '$lib/util/format';

	/** @typedef {import('$lib/data/menu').MenuEntry} MenuEntry */

	const kitchen = useKitchen();

	let filter = $state('all');
	let time = $state(nowMs());

	// A meal becomes ready when its lead time is over, so the clock must move.
	onMount(() => {
		const timer = setInterval(() => (time = nowMs()), 60_000);
		return () => clearInterval(timer);
	});

	/** @param {import('$lib/types').Recipe} recipe */
	const matches = (recipe) => filter === 'all' || recipe.mealType === filter;

	const entries = $derived(
		menuEntries(kitchen.menu, kitchen.recipesById, time).filter((entry) => matches(entry.recipe))
	);
	const ready = $derived(entries.filter((entry) => entry.state === 'ready'));
	const preparing = $derived(entries.filter((entry) => entry.state !== 'ready'));

	const ideas = $derived(
		ready.length > 0
			? []
			: kitchen.recipes.filter(
					(recipe) =>
						matches(recipe) &&
						recipe.prepSteps.length === 0 &&
						canMake(recipe, kitchen.ingredientsById, kitchen.pantryByIngredient)
				)
	);

	/** @param {MenuEntry} entry */
	async function cooked(entry) {
		const id = await cook(entry.item);
		goto(resolve('/sessions/[id]', { id }));
	}

	/** @param {MenuEntry} entry */
	async function prepared(entry) {
		await markPrepDone(entry.item.id);
		status.say('Preparation is recorded.');
	}

	/** @param {import('$lib/types').Recipe} recipe */
	async function add(recipe) {
		await addToMenu(recipe.id);
		status.say(`${recipe.name} is on the menu.`);
	}
</script>

<PageHeader title="Today" heading={greeting()} eyebrow={todayInWords()} />

<MealFilter bind:value={filter} />

<section class="stack wide" aria-labelledby="today-ready">
	<h2 id="today-ready">Ready to cook now</h2>

	<div class="grid">
		{#each ready as entry, index (entry.item.id)}
			<MenuCard {entry} {index} oncook={cooked} onprep={prepared} />
		{:else}
			<PantryIdeas recipes={ideas} onadd={add} />
		{/each}
	</div>
</section>

{#if preparing.length > 0}
	<section class="stack wide" aria-labelledby="today-prep">
		<h2 id="today-prep">Needs preparation</h2>

		<div class="grid">
			{#each preparing as entry, index (entry.item.id)}
				<MenuCard {entry} {index} oncook={cooked} onprep={prepared} />
			{/each}
		</div>
	</section>
{/if}

<div>
	<a class="button" href={resolve('/menu')}>Change the menu</a>
</div>
