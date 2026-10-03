<script>
	import { SvelteSet } from 'svelte/reactivity';
	import { resolve } from '$app/paths';
	import MealFilter from '$lib/components/menu/MealFilter.svelte';
	import MenuStrip from '$lib/components/menu/MenuStrip.svelte';
	import SoonShelf from '$lib/components/menu/SoonShelf.svelte';
	import UseUpList from '$lib/components/menu/UseUpList.svelte';
	import ChoiceChips from '$lib/components/ui/ChoiceChips.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { addToMenu, entryName, menuEntries, recipesOnMenu, removeFromMenu } from '$lib/data/menu';
	import { recipeGroups } from '$lib/data/recipes';
	import { menuTotals, shoppingNeeds } from '$lib/data/shopping';
	import { useSoon, useUpIdeas } from '$lib/data/use-up';
	import { db } from '$lib/db/db';
	import { useKitchen } from '$lib/kitchen.svelte';
	import { live } from '$lib/live.svelte';
	import { status } from '$lib/status.svelte';
	import { groupBy } from '$lib/util/collections';
	import { nowMs } from '$lib/util/format';

	/** The number of ideas when no food is selected. */
	const IDEAS = 6;

	const kitchen = useKitchen();
	const cookedIds = live(() => db.sessions.orderBy('recipeId').uniqueKeys(), []);
	const log = live(() => db.pantryLog.orderBy('at').toArray(), []);

	let filter = $state('all');
	/** The recipes that the list shows: 'use-up', 'cook-now', or 'all'. */
	let source = $state('use-up');
	/** The food that is selected on the shelf. */
	const selected = new SvelteSet();
	const time = nowMs();

	const entries = $derived(menuEntries(kitchen.menu, kitchen.recipesById, time));
	const onMenu = $derived(recipesOnMenu(kitchen.menu));

	/** The number of items on the shopping list. */
	const toBuy = $derived(
		shoppingNeeds(
			kitchen.menu,
			kitchen.recipesById,
			kitchen.ingredientsById,
			kitchen.pantryByIngredient
		).length
	);

	const soon = $derived(
		useSoon(
			kitchen.pantry,
			kitchen.ingredientsById,
			new Map(groupBy(log.current, (change) => change.ingredientId)),
			menuTotals(kitchen.menu, kitchen.recipesById),
			time
		)
	);

	/** All recipes that can go on the menu. The best for the food to use first is at the top. */
	const ideas = $derived(
		useUpIdeas(
			kitchen.recipes.filter(
				(recipe) => (filter === 'all' || recipe.mealType === filter) && !onMenu.has(recipe.id)
			),
			soon,
			kitchen.ingredientsById,
			kitchen.pantryByIngredient
		)
	);

	/** A reference recipe has no ingredients, so the tool cannot tell what the pantry has for it. */
	const counted = $derived(ideas.filter((idea) => idea.count.need > 0));

	/** "Use it up". With food selected: the recipes that use it. With none: the best ideas. */
	const useUp = $derived(
		selected.size === 0
			? counted.slice(0, IDEAS)
			: counted.filter((idea) => idea.uses.some((item) => selected.has(item.ingredient.id)))
	);

	/** "Cook now": the recipes that the pantry can make in full. */
	const able = $derived(counted.filter((idea) => idea.missing === 0));

	/** "All": each recipe, in groups. */
	const groups = $derived(recipeGroups(ideas, new Set(cookedIds.current.map(String))));

	const sources = $derived([
		{ value: 'use-up', label: 'Use it up' },
		{ value: 'cook-now', label: `Cook now (${able.length})` },
		{ value: 'all', label: 'All' }
	]);

	const selectedNames = $derived(
		soon
			.filter((item) => selected.has(item.ingredient.id))
			.map((item) => item.ingredient.name)
			.join(' and ')
	);

	// Food that the menu uses up completely can no longer be selected.
	$effect(() => {
		for (const item of soon) {
			if (item.free === 0) selected.delete(item.ingredient.id);
		}
	});

	/** @param {string} ingredientId */
	function toggle(ingredientId) {
		if (selected.has(ingredientId)) selected.delete(ingredientId);
		else selected.add(ingredientId);
	}

	/** @param {import('$lib/types').Recipe} recipe */
	async function add(recipe) {
		await addToMenu(recipe.id);
		status.say(`${recipe.name} is on the menu.`);
	}

	/** @param {import('$lib/data/menu').MenuEntry} entry */
	async function remove(entry) {
		await removeFromMenu(entry.item.id);
		status.say(`${entryName(entry)} is removed from the menu.`);
	}
</script>

<PageHeader title="Menu">
	<a class="button" href={resolve('/pantry/check')}>Pantry check</a>
</PageHeader>

<MenuStrip {entries} {toBuy} onremove={remove} />

<section class="stack" aria-labelledby="menu-add">
	<div class="stack stack--tight">
		<div class="cluster cluster--between">
			<h2 id="menu-add">Add a meal</h2>
			<MealFilter bind:value={filter} />
		</div>
		<ChoiceChips legend="Recipes to show" options={sources} bind:value={source} />
	</div>

	{#if source === 'use-up'}
		{#if soon.length > 0}
			<SoonShelf items={soon} {selected} ontoggle={toggle} />
		{:else}
			<p class="muted">No fresh food waits. These meals use the most of your pantry.</p>
		{/if}

		<div class="stack stack--tight">
			<h3>{selected.size === 0 ? 'Cook these first' : `Recipes with ${selectedNames}`}</h3>
			{#if useUp.length > 0}
				<UseUpList ideas={useUp} {selected} onadd={add} />
			{:else}
				<p class="muted">
					{selected.size === 0
						? 'There are no more recipes for this meal type.'
						: `No other recipe uses ${selectedNames}.`}
				</p>
			{/if}
		</div>
	{:else if source === 'cook-now'}
		{#if able.length > 0}
			<UseUpList ideas={able} {selected} onadd={add} />
		{:else}
			<p class="muted">The pantry does not have all ingredients for another recipe.</p>
		{/if}
	{:else}
		{#each groups as group (group.title)}
			<div class="stack stack--tight">
				<h3>{group.title}</h3>
				<UseUpList ideas={group.items} {selected} onadd={add} />
			</div>
		{:else}
			<p class="muted">
				There are no more recipes for this meal type.
				<a href={resolve('/recipes/new')}>Add a recipe.</a>
			</p>
		{/each}
	{/if}
</section>
