import { openSessions } from '$lib/data/cooking';
import { menuEntries, recipesOnMenu } from '$lib/domain/menu';
import { cookingNow, handOrder, pantryOffers, todayHeading, todaySubline } from '$lib/domain/today';
import { weekPlan } from '$lib/domain/week';
import { useClock } from './clock.svelte';
import { useCookHistory } from './cook-history.svelte';
import { useKitchen } from './kitchen.svelte';
import { live } from './live.svelte';
import { useSoon } from './soon.svelte';

/**
 * The data of the Today screen: the hand of meals, the offers of the pantry, the week, and
 * the words of the title. The rules are in domain/today.js.
 * Call it during component setup.
 */
export function useToday() {
	const kitchen = useKitchen();
	const history = useCookHistory();
	const open = live(openSessions, []);
	// A meal becomes ready when its lead time is over, so the clock must move.
	const clock = useClock(60_000);
	const food = useSoon(() => clock.now);

	const entries = $derived(menuEntries(kitchen.menu, kitchen.recipesById, clock.now));
	const cooking = $derived(cookingNow(open.current, clock.now));
	const hand = $derived(handOrder(entries, cooking, food.items));

	/** The pantry offers a meal only when no meal on the menu is ready. */
	const ideas = $derived(
		cooking.size > 0 || entries.some((entry) => entry.state === 'ready')
			? []
			: pantryOffers(
					kitchen.recipes,
					recipesOnMenu(kitchen.menu),
					food.items,
					kitchen.ingredientsById,
					kitchen.pantryByIngredient
				)
	);

	const week = $derived(weekPlan(history.sessions, kitchen.menu, clock.now));
	const facts = $derived({ hand, cooking, ideas, soon: food.items, time: clock.now });
	const heading = $derived(todayHeading(facts));
	const subline = $derived(todaySubline(facts));

	return {
		/** The meals of the menu, in the order of the hand. */
		get hand() {
			return hand;
		},
		/** The open cook sessions of the meals that the owner is cooking, by menu item ID. */
		get cooking() {
			return cooking;
		},
		/** The meals that the pantry can make, when no meal on the menu is ready. */
		get ideas() {
			return ideas;
		},
		/** The food to use first, the oldest stock first. */
		get soon() {
			return food.items;
		},
		get week() {
			return week;
		},
		/** The last cook session of each recipe, by recipe ID. */
		get lastSessions() {
			return history.lastByRecipe;
		},
		get heading() {
			return heading;
		},
		get subline() {
			return subline;
		}
	};
}
