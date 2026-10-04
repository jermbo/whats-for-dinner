<script>
	import { SvelteSet } from 'svelte/reactivity';
	import { resolve } from '$app/paths';
	import FoodPlan from '$lib/components/menu/FoodPlan.svelte';
	import MealDealer from '$lib/components/menu/MealDealer.svelte';
	import MenuHand from '$lib/components/menu/MenuHand.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import ToggleChip from '$lib/components/ui/ToggleChip.svelte';
	import { addToMenu, markPrepDone, removeFromMenu } from '$lib/data/menu';
	import { entryName, menuEntries, recipesOnMenu, recipesToPropose } from '$lib/domain/menu';
	import { useUpIdeas } from '$lib/domain/use-up';
	import { useClock } from '$lib/state/clock.svelte';
	import { useCookHistory } from '$lib/state/cook-history.svelte';
	import { useKitchen } from '$lib/state/kitchen.svelte';
	import { usePreferences } from '$lib/state/preferences.svelte';
	import { useShopping } from '$lib/state/shopping.svelte';
	import { useSoon } from '$lib/state/soon.svelte';
	import { status } from '$lib/state/status.svelte';

	/** @typedef {import('$lib/domain/menu').MenuEntry} MenuEntry */

	const kitchen = useKitchen();
	const shopping = useShopping();
	const history = useCookHistory();
	const preferences = usePreferences();
	// A meal becomes ready when its lead time is over, so the clock must move.
	const clock = useClock(60_000);
	const food = useSoon(() => clock.now);

	/** "Cook now": only the recipes that the pantry can make in full. */
	let cookNow = $state(false);
	/** The food that is selected on the shelf. */
	const selected = new SvelteSet();

	const entries = $derived(menuEntries(kitchen.menu, kitchen.recipesById, clock.now));
	const onMenu = $derived(recipesOnMenu(kitchen.menu));

	/** The number of items on the shopping list. */
	const toBuy = $derived(shopping.needs.length);

	const soon = $derived(food.items);

	/** The recipes that can go on the menu. The best for the food to use first is at the top. */
	const ideas = $derived(
		useUpIdeas(
			recipesToPropose(kitchen.recipes, onMenu, preferences.values.mealTypes),
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

		<MenuHand {entries} lastSessions={history.lastByRecipe} onremove={remove} onprep={prepared} />
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
