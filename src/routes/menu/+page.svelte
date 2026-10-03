<script>
	import { SvelteSet } from 'svelte/reactivity';
	import { resolve } from '$app/paths';
	import FoodPlan from '$lib/components/menu/FoodPlan.svelte';
	import MealDealer from '$lib/components/menu/MealDealer.svelte';
	import MenuHand from '$lib/components/menu/MenuHand.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import ToggleChip from '$lib/components/ui/ToggleChip.svelte';
	import {
		addToMenu,
		entryName,
		markPrepDone,
		menuEntries,
		recipesOnMenu,
		removeFromMenu
	} from '$lib/data/menu';
	import { menuTotals, shoppingNeeds } from '$lib/data/shopping';
	import { useSoon, useUpIdeas } from '$lib/data/use-up';
	import { db } from '$lib/db/db';
	import { useKitchen } from '$lib/kitchen.svelte';
	import { live } from '$lib/live.svelte';
	import { status } from '$lib/status.svelte';
	import { groupBy, indexBy } from '$lib/util/collections';
	import { nowMs } from '$lib/util/format';

	/** @typedef {import('$lib/data/menu').MenuEntry} MenuEntry */

	const kitchen = useKitchen();
	const sessions = live(() => db.sessions.orderBy('cookedAt').toArray(), []);
	const log = live(() => db.pantryLog.orderBy('at').toArray(), []);

	/** The last cook session of each recipe. The sessions are oldest first, so the last one stays. */
	const lastSessions = $derived(indexBy(sessions.current, 'recipeId'));

	/** "Cook now": only the recipes that the pantry can make in full. */
	let cookNow = $state(false);
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

	/** The recipes that can go on the menu. The best for the food to use first is at the top. */
	const ideas = $derived(
		useUpIdeas(
			kitchen.recipes.filter((recipe) => !onMenu.has(recipe.id)),
			soon,
			kitchen.ingredientsById,
			kitchen.pantryByIngredient
		)
	);

	const able = $derived(ideas.filter((idea) => idea.missing === 0));

	/** The cards of the dealer. With food selected: only the recipes that use it. */
	const deck = $derived(
		(cookNow ? able : ideas).filter(
			(idea) => selected.size === 0 || idea.uses.some((item) => selected.has(item.ingredient.id))
		)
	);

	const selectedNames = $derived(
		soon
			.filter((item) => selected.has(item.ingredient.id))
			.map((item) => item.ingredient.name)
			.join(' and ')
	);

	const empty = $derived.by(() => {
		if (selected.size > 0) return `No other recipe uses ${selectedNames}.`;
		return cookNow
			? 'The pantry does not have all ingredients for another recipe.'
			: 'There are no more recipes.';
	});

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

	/**
	 * The dealer shows the result: the card goes up to the menu. A message would cover its buttons.
	 * @param {import('$lib/types').Recipe} recipe
	 */
	function add(recipe) {
		return addToMenu(recipe.id);
	}

	/** @param {MenuEntry} entry */
	async function remove(entry) {
		await removeFromMenu(entry.item.id);
		status.say(`${entryName(entry)} is removed from the menu.`);
	}

	/** @param {MenuEntry} entry */
	async function prepared(entry) {
		await markPrepDone(entry.item.id);
		status.say(`Preparation is done for ${entry.recipe.name}.`);
	}
</script>

<!--
	One block, so that the parts are closer than the parts of other screens.
	The menu and the food to use are the main column. The dealer is the side column.
-->
<div class="split">
	<div class="stack stack--tight">
		<PageHeader title="Menu">
			{#if entries.length > 0}
				<a class="button button--primary" href={resolve('/shop')}>
					Shopping list
					{#if toBuy > 0}
						<span aria-hidden="true">&nbsp;· {toBuy}</span>
						<span class="visually-hidden">: {toBuy} items to buy</span>
					{/if}
				</a>
			{/if}
		</PageHeader>

		<MenuHand {entries} {kitchen} {lastSessions} onremove={remove} onprep={prepared} />
	</div>

	<div class="split__side">
		<MealDealer
			title={selected.size === 0 ? 'Next best meal' : `With ${selectedNames}`}
			{deck}
			{selected}
			{empty}
			onadd={add}
		>
			<div class="cluster cluster--between">
				<ToggleChip label="Cook now ({able.length})" bind:checked={cookNow} />
				<a class="button" href={resolve('/recipes')}>All recipes</a>
			</div>
		</MealDealer>
	</div>

	<FoodPlan items={soon} {selected} ontoggle={toggle} />
</div>
