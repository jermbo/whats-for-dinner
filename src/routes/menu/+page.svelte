<script>
	import { SvelteSet } from 'svelte/reactivity';
	import { resolve } from '$app/paths';
	import MealFilter from '$lib/components/menu/MealFilter.svelte';
	import MenuList from '$lib/components/menu/MenuList.svelte';
	import RecipePicker from '$lib/components/menu/RecipePicker.svelte';
	import SoonShelf from '$lib/components/menu/SoonShelf.svelte';
	import UseUpList from '$lib/components/menu/UseUpList.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { addToMenu, entryName, menuEntries, recipesOnMenu, removeFromMenu } from '$lib/data/menu';
	import { recipeGroups } from '$lib/data/recipes';
	import { menuTotals } from '$lib/data/shopping';
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
	/** The food that is selected on the shelf. */
	const selected = new SvelteSet();
	const time = nowMs();

	/** @param {import('$lib/types').Recipe} recipe */
	const matches = (recipe) => filter === 'all' || recipe.mealType === filter;

	const entries = $derived(menuEntries(kitchen.menu, kitchen.recipesById, time));
	const onMenu = $derived(recipesOnMenu(kitchen.menu));

	const soon = $derived(
		useSoon(
			kitchen.pantry,
			kitchen.ingredientsById,
			new Map(groupBy(log.current, (change) => change.ingredientId)),
			menuTotals(kitchen.menu, kitchen.recipesById),
			time
		)
	);

	const ideas = $derived(
		useUpIdeas(
			kitchen.recipes.filter((recipe) => matches(recipe) && !onMenu.has(recipe.id)),
			soon,
			kitchen.ingredientsById,
			kitchen.pantryByIngredient
		)
	);

	/** With food selected: the recipes that use it. With none: the best ideas. */
	const shown = $derived(
		selected.size === 0
			? ideas.slice(0, IDEAS)
			: ideas.filter((idea) => idea.uses.some((item) => selected.has(item.ingredient.id)))
	);

	const selectedNames = $derived(
		soon
			.filter((item) => selected.has(item.ingredient.id))
			.map((item) => item.ingredient.name)
			.join(' and ')
	);

	const groups = $derived(
		recipeGroups(kitchen.recipes.filter(matches), new Set(cookedIds.current.map(String)))
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

<MealFilter bind:value={filter} />

<section class="stack" aria-labelledby="menu-use-up">
	<div class="stack stack--tight">
		<h2 id="menu-use-up">Use it up</h2>
		{#if soon.length > 0}
			<p class="muted">
				The fresh food in your kitchen, the oldest first. Tap food to see its recipes.
			</p>
		{/if}
	</div>

	{#if soon.length > 0}
		<SoonShelf items={soon} {selected} ontoggle={toggle} />
	{:else}
		<p class="muted">No fresh food waits. These are the meals that use the most of your pantry.</p>
	{/if}

	<div class="stack stack--tight">
		<h3>{selected.size === 0 ? 'Cook these first' : `Recipes with ${selectedNames}`}</h3>
		{#if shown.length > 0}
			<UseUpList ideas={shown} {selected} onadd={add} />
		{:else}
			<p class="muted">
				{selected.size === 0
					? 'There are no more recipes for this meal type.'
					: `No other recipe uses ${selectedNames}.`}
			</p>
		{/if}
	</div>
</section>

<section class="stack stack--tight" aria-labelledby="menu-current">
	<h2 id="menu-current">Your menu ({entries.length})</h2>
	<MenuList {entries} onremove={remove} />
	{#if entries.length > 0}
		<div>
			<a class="button button--primary" href={resolve('/shop')}>Open the shopping list</a>
		</div>
	{/if}
</section>

<details class="menu-all">
	<summary class="button">All recipes</summary>
	<div class="grid menu-all__groups">
		{#each groups as group (group.title)}
			<RecipePicker
				title={group.title}
				recipes={group.recipes}
				ingredientsById={kitchen.ingredientsById}
				pantryByIngredient={kitchen.pantryByIngredient}
				{onMenu}
				onadd={add}
			/>
		{:else}
			<p class="muted">
				There are no recipes for this meal type.
				<a href={resolve('/recipes/new')}>Add a recipe.</a>
			</p>
		{/each}
	</div>
</details>

<style>
	.menu-all__groups {
		padding-block-start: var(--space-5);
	}
</style>
