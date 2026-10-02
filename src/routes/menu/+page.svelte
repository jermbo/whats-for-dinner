<script>
	import { resolve } from '$app/paths';
	import MealFilter from '$lib/components/menu/MealFilter.svelte';
	import MenuList from '$lib/components/menu/MenuList.svelte';
	import RecipePicker from '$lib/components/menu/RecipePicker.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { addToMenu, entryName, menuEntries, removeFromMenu } from '$lib/data/menu';
	import { recipeGroups } from '$lib/data/recipes';
	import { db } from '$lib/db/db';
	import { useKitchen } from '$lib/kitchen.svelte';
	import { live } from '$lib/live.svelte';
	import { status } from '$lib/status.svelte';
	import { nowMs } from '$lib/util/format';

	const kitchen = useKitchen();
	const cookedIds = live(() => db.sessions.orderBy('recipeId').uniqueKeys(), []);

	let filter = $state('all');

	const entries = $derived(menuEntries(kitchen.menu, kitchen.recipesById, nowMs()));
	const groups = $derived(
		recipeGroups(
			kitchen.recipes.filter((recipe) => filter === 'all' || recipe.mealType === filter),
			new Set(cookedIds.current.map(String))
		)
	);

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

<section class="stack stack--tight" aria-labelledby="menu-current">
	<h2 id="menu-current">On the menu ({entries.length})</h2>
	<MenuList {entries} onremove={remove} />
</section>

{#if entries.length > 0}
	<div>
		<a class="button button--primary" href={resolve('/shop')}>Open the shopping list</a>
	</div>
{/if}

<section class="stack" aria-labelledby="menu-add">
	<h2 id="menu-add">Add meals</h2>
	<MealFilter bind:value={filter} />
</section>

<div class="grid">
	{#each groups as group (group.title)}
		<RecipePicker
			title={group.title}
			recipes={group.recipes}
			ingredientsById={kitchen.ingredientsById}
			pantryByIngredient={kitchen.pantryByIngredient}
			onadd={add}
		/>
	{:else}
		<p class="muted">
			There are no recipes for this meal type.
			<a href={resolve('/recipes/new')}>Add a recipe.</a>
		</p>
	{/each}
</div>
