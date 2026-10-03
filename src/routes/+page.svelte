<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import MealHand from '$lib/components/menu/MealHand.svelte';
	import PantryIdeas from '$lib/components/menu/PantryIdeas.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { canMake } from '$lib/data/availability';
	import { cook } from '$lib/data/cooking';
	import { addToMenu, markPrepDone, menuEntries, recipesOnMenu } from '$lib/data/menu';
	import { db } from '$lib/db/db';
	import { useKitchen } from '$lib/kitchen.svelte';
	import { live } from '$lib/live.svelte';
	import { status } from '$lib/status.svelte';
	import { indexBy } from '$lib/util/collections';
	import { greeting, nowMs, todayInWords } from '$lib/util/format';

	/** @typedef {import('$lib/data/menu').MenuEntry} MenuEntry */

	const kitchen = useKitchen();
	const sessions = live(() => db.sessions.orderBy('cookedAt').toArray(), []);

	/** The last cook session of each recipe. The sessions are oldest first, so the last one stays. */
	const lastSessions = $derived(indexBy(sessions.current, 'recipeId'));

	let time = $state(nowMs());

	// A meal becomes ready when its lead time is over, so the clock must move.
	onMount(() => {
		const timer = setInterval(() => (time = nowMs()), 60_000);
		return () => clearInterval(timer);
	});

	const entries = $derived(menuEntries(kitchen.menu, kitchen.recipesById, time));

	/** The hand: the meals that you can cook now. */
	const ready = $derived(entries.filter((entry) => entry.state === 'ready'));

	/** The hand: the ready meals first, then the meals that wait, then the preparation to do. */
	const STATE_ORDER = { ready: 0, waiting: 1, todo: 2 };
	const hand = $derived(
		entries.toSorted(
			(a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state] || (a.readyAt ?? 0) - (b.readyAt ?? 0)
		)
	);

	const onMenu = $derived(recipesOnMenu(kitchen.menu));

	const ideas = $derived(
		ready.length > 0
			? []
			: kitchen.recipes.filter(
					(recipe) =>
						!onMenu.has(recipe.id) &&
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
		status.say(`Preparation is done for ${entry.recipe.name}.`);
	}

	/** @param {import('$lib/types').Recipe} recipe */
	async function add(recipe) {
		await addToMenu(recipe.id);
		status.say(`${recipe.name} is on the menu.`);
	}
</script>

<PageHeader title="Today" heading={greeting()} eyebrow={todayInWords()} />

{#if hand.length > 0}
	<MealHand entries={hand} {kitchen} {lastSessions} oncook={cooked} onprep={prepared} />
{/if}

{#if ready.length === 0}
	<div class="grid">
		<PantryIdeas recipes={ideas} onadd={add} />
	</div>
{/if}

<div>
	<a class="button" href={resolve('/menu')}>Change the menu</a>
</div>
