import { readPlan } from '$lib/data/menu-plan';
import { coverage } from '$lib/domain/availability';
import { dealDeck } from '$lib/domain/deal';
import { menuEntries, recipesOnMenu, recipesToPropose } from '$lib/domain/menu';
import {
	defaultNights,
	openCount,
	openNights,
	planIsOver,
	planStep,
	weekNights,
	weekNotes,
	weekRows,
	withNights
} from '$lib/domain/menu-plan';
import { nightOf } from '$lib/domain/nights';
import { useUpIdeas } from '$lib/domain/use-up';
import { useClock } from './clock.svelte';
import { useCookHistory } from './cook-history.svelte';
import { useKitchen } from './kitchen.svelte';
import { live } from './live.svelte';
import { usePreferences } from './preferences.svelte';
import { useShopping } from './shopping.svelte';
import { useSoon } from './soon.svelte';

/**
 * The data of the Menu screen: the plan of the week, the meals with their nights, the deck of
 * the dealer, and what to buy. The rules are in domain/menu-plan.js and domain/deal.js.
 * Call it during component setup.
 * @param {object} view What the owner selects on the screen. The screen keeps it.
 * @param {() => string[]} view.nights The nights that are selected in the first step.
 * @param {() => Map<string, string | null> | null} view.moved
 *   The nights of a drag that the database does not have yet.
 * @param {import('$lib/domain/deal').DealFilters} view.filters The filters of the dealer.
 * @param {Set<string>} view.selected The food that is selected in "Use first".
 */
export function useMenuPlan(view) {
	const kitchen = useKitchen();
	const shopping = useShopping();
	const history = useCookHistory();
	const preferences = usePreferences();
	// A meal becomes ready when its lead time is over, so the clock must move.
	const clock = useClock(60_000);
	const food = useSoon(() => clock.now);
	/** Not defined until the database gives the plan. Null: there is no plan yet. */
	const stored = live(
		readPlan,
		/** @type {import('$lib/types').MenuPlan | null | undefined} */ (undefined)
	);

	const plan = $derived(
		stored.current && !planIsOver(stored.current, clock.now) ? stored.current : null
	);
	const planNights = $derived(plan?.nights ?? []);
	const firstStep = $derived(planStep(stored.current, clock.now));
	const usualNights = $derived(
		defaultNights(stored.current, preferences.values.mealsInWeek, clock.now)
	);

	const today = $derived(nightOf(clock.now));
	const week = $derived(weekNights(clock.now));

	const entries = $derived(
		withNights(menuEntries(kitchen.menu, kitchen.recipesById, clock.now), view.moved())
	);
	const meals = $derived(entries.filter((entry) => entry.item.kind === 'recipe'));
	const places = $derived(openNights(planNights, clock.now));
	const open = $derived(openCount(places, meals));
	const toDeal = $derived(Math.max(0, openNights(view.nights(), clock.now).length - meals.length));

	/** The recipes that can go on the menu. The best for the food to use first is at the top. */
	const ideas = $derived(
		useUpIdeas(
			recipesToPropose(kitchen.recipes, recipesOnMenu(kitchen.menu), preferences.values.mealTypes),
			food.items,
			kitchen.ingredientsById,
			kitchen.pantryByIngredient
		)
	);
	const deck = $derived(dealDeck(ideas, view.filters, history.lastByRecipe, view.selected));

	const sorted = $derived(weekRows(planNights, entries));
	const notes = $derived(weekNotes(entries, food.items, history.lastByRecipe));

	const pantryHas = $derived(
		coverage(
			meals.map((entry) => entry.recipe),
			kitchen.ingredientsById,
			kitchen.pantryByIngredient
		)
	);

	return {
		/** False until the database gives the plan. */
		get ready() {
			return stored.current !== undefined;
		},
		/** The plan of this week. Null: there is no plan, or the week of the plan is over. */
		get plan() {
			return plan;
		},
		/** The nights of the plan. */
		get nights() {
			return planNights;
		},
		/** The step that the screen opens with. */
		get firstStep() {
			return firstStep;
		},
		/** The nights that the first step proposes: those of the last plan. */
		get usualNights() {
			return usualNights;
		},
		/** The time of now, in milliseconds. */
		get now() {
			return clock.now;
		},
		/** The night of today. */
		get today() {
			return today;
		},
		/** The seven nights of this week. */
		get week() {
			return week;
		},
		/** The food to use first, the earliest date first. */
		get soon() {
			return food.items;
		},
		/** The menu: each item with its recipe, its state, and its night. */
		get entries() {
			return entries;
		},
		/** The entries that are a meal to cook. Leftovers do not count. */
		get meals() {
			return meals;
		},
		/** The nights from tonight: each one is a place for a meal. */
		get places() {
			return places;
		},
		/** The number of places that have no meal. */
		get open() {
			return open;
		},
		/** The meals that the dealer must give for the nights that the owner selects now. */
		get toDeal() {
			return toDeal;
		},
		/** The recipes that pass the filters of the dealer, the best first. */
		get deck() {
			return deck;
		},
		/** One row for each night of the plan, with the meal of that night. */
		get rows() {
			return sorted.rows;
		},
		/** The meals with no night of the plan: leftovers, and a meal more than the nights. */
		get loose() {
			return sorted.loose;
		},
		/** The note of each meal in the week, by menu item ID. */
		get notes() {
			return notes;
		},
		/** The rows of the shopping list that the owner must still buy. */
		get toBuy() {
			return shopping.needed;
		},
		/** How many ingredients of the meals the pantry has, of how many the meals need. */
		get pantryHas() {
			return pantryHas;
		},
		/** The last cook session of each recipe, by recipe ID. */
		get lastSessions() {
			return history.lastByRecipe;
		}
	};
}
