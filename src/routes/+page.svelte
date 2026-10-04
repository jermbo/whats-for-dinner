<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import CartReminder from '$lib/components/shop/CartReminder.svelte';
	import EmptyHand from '$lib/components/today/EmptyHand.svelte';
	import HandNext from '$lib/components/today/HandNext.svelte';
	import MealHand from '$lib/components/today/MealHand.svelte';
	import PantryIdeas from '$lib/components/today/PantryIdeas.svelte';
	import ShopGlance from '$lib/components/today/ShopGlance.svelte';
	import UseSoonList from '$lib/components/today/UseSoonList.svelte';
	import WeekBoard from '$lib/components/today/WeekBoard.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { cook, cookedSessions, openSessions, startCook } from '$lib/data/cooking';
	import { addToMenu, markPrepDone } from '$lib/data/menu';
	import { db } from '$lib/db/db';
	import { canMake } from '$lib/domain/availability';
	import { isCooking } from '$lib/domain/cook-session';
	import { menuEntries, recipesOnMenu } from '$lib/domain/menu';
	import { menuTotals } from '$lib/domain/shopping';
	import { oldestUse, useSoon, useUpIdeas } from '$lib/domain/use-up';
	import { weekPlan } from '$lib/domain/week';
	import { useKitchen } from '$lib/state/kitchen.svelte';
	import { live } from '$lib/state/live.svelte';
	import { useShopCount } from '$lib/state/shop-count.svelte';
	import { status } from '$lib/state/status.svelte';
	import { groupBy, indexBy } from '$lib/util/collections';
	import { greeting, nowMs, plural, todayInWords } from '$lib/util/format';

	/** @typedef {import('$lib/domain/menu').MenuEntry} MenuEntry */

	const kitchen = useKitchen();
	const shop = useShopCount();
	const sessions = live(cookedSessions, []);
	const open = live(openSessions, []);
	const log = live(() => db.pantryLog.orderBy('at').toArray(), []);

	/** The last cook session of each recipe. The sessions are oldest first, so the last one stays. */
	const lastSessions = $derived(indexBy(sessions.current, 'recipeId'));

	let time = $state(nowMs());

	// A meal becomes ready when its lead time is over, so the clock must move.
	onMount(() => {
		const timer = setInterval(() => (time = nowMs()), 60_000);
		return () => clearInterval(timer);
	});

	const entries = $derived(menuEntries(kitchen.menu, kitchen.recipesById, time));

	/** The meals that you can cook now. */
	const ready = $derived(entries.filter((entry) => entry.state === 'ready'));
	const todo = $derived(entries.filter((entry) => entry.state === 'todo'));

	/**
	 * The food to use first, the oldest stock first.
	 * Assumption: the age of the stock tells what spoils first. The ingredients have no shelf life.
	 */
	const soon = $derived(
		useSoon(
			kitchen.pantry,
			kitchen.ingredientsById,
			new Map(groupBy(log.current, (change) => change.ingredientId)),
			menuTotals(kitchen.menu, kitchen.recipesById),
			time
		)
	);

	/** The meals that the owner is in the middle of, by menu item ID. Their cards show the steps. */
	const cooking = $derived(
		new Map(
			open.current
				.filter((session) => isCooking(session, time))
				.map((session) => [session.menuItem.id, session])
		)
	);

	/**
	 * The hand: the meals that the owner cooks now, then the ready meals, then the meals that
	 * wait, then the preparation to do. In one group, the meal with the oldest food is first.
	 */
	const STATE_ORDER = { ready: 0, waiting: 1, todo: 2 };
	const hand = $derived(
		entries.toSorted(
			(a, b) =>
				Number(cooking.has(b.item.id)) - Number(cooking.has(a.item.id)) ||
				STATE_ORDER[a.state] - STATE_ORDER[b.state] ||
				(oldestUse(b.recipe, soon)?.days ?? -1) - (oldestUse(a.recipe, soon)?.days ?? -1) ||
				(a.readyAt ?? 0) - (b.readyAt ?? 0)
		)
	);

	const onMenu = $derived(recipesOnMenu(kitchen.menu));

	/** The meals that the pantry can make, when no meal on the menu is ready. */
	const ideas = $derived(
		ready.length > 0 || cooking.size > 0
			? []
			: useUpIdeas(
					kitchen.recipes.filter(
						(recipe) =>
							!onMenu.has(recipe.id) &&
							recipe.prepSteps.length === 0 &&
							canMake(recipe, kitchen.ingredientsById, kitchen.pantryByIngredient)
					),
					soon,
					kitchen.ingredientsById,
					kitchen.pantryByIngredient
				)
	);

	const week = $derived(weekPlan(sessions.current, kitchen.menu, time));

	/** @param {Date} date */
	const clockTime = (date) =>
		date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });

	/** The title of the screen: one word, or a short phrase, that tells the state of the day. */
	const heading = $derived.by(() => {
		if (cooking.size > 0) return 'On the stove';
		if (entries.length === 0) return ideas.length > 0 ? 'Nothing is ready' : greeting();
		return ready.length === 0 && todo.length === 0 ? 'Nothing is ready' : greeting();
	});

	/** One sentence under the title. It names the reason for the order of the hand. */
	const subline = $derived.by(() => {
		if (cooking.size > 0) {
			const ends = [...cooking.values()]
				.flatMap((session) => session.timers.map((timer) => Date.parse(timer.endsAt)))
				.filter((end) => end > time);
			if (ends.length > 0) return `The timer ends at ${clockTime(new Date(Math.min(...ends)))}.`;
			const name = hand[0]?.recipe.name ?? 'The meal';
			return `${name} is in progress.`;
		}
		if (entries.length === 0) {
			return ideas.length > 0
				? `The pantry can still make ${plural(ideas.length, 'meal')}.`
				: 'Your hand is empty.';
		}
		if (ready.length > 0) {
			const first = oldestUse(hand[0].recipe, soon);
			const count = `${plural(ready.length, 'meal')} ${ready.length === 1 ? 'is' : 'are'} ready.`;
			return first ? `${count} The ${first.ingredient.name.toLowerCase()} goes first.` : count;
		}
		if (todo.length > 0) {
			return todo.length === 1
				? 'One thing to start first.'
				: `${plural(todo.length, 'thing')} to start first.`;
		}
		return 'Wait for the next meal.';
	});

	/** The food names for the line of the empty hand. */
	const soonNames = $derived(
		soon
			.filter((item) => item.free > 0)
			.slice(0, 2)
			.map((item) => item.ingredient.name)
	);

	/** The title block of the screen. */
	const header = $derived({ title: 'Today', heading, eyebrow: todayInWords(), subline });

	/** @param {MenuEntry} entry */
	async function start(entry) {
		const id = await startCook(entry.item);
		goto(resolve('/cook/[id]', { id }));
	}

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

	/** @param {import('$lib/types').Recipe} recipe */
	async function cookNow(recipe) {
		const itemId = await addToMenu(recipe.id);
		const item = await db.menu.get(itemId);
		if (!item) return;
		const id = await startCook(item);
		goto(resolve('/cook/[id]', { id }));
	}
</script>

<!-- The hand is the main column. The plan of the week and of the food is the side column. -->
<div class="split split--loose today">
	<div class="today__main">
		{#if hand.length > 0}
			<MealHand
				entries={hand}
				{kitchen}
				{lastSessions}
				{soon}
				{cooking}
				onstart={start}
				oncook={cooked}
				onprep={prepared}
			>
				{#snippet head({ number, total, onnext })}
					{#snippet count()}
						<HandNext {number} {total} {onnext} />
					{/snippet}
					<PageHeader {...header} aside={count}>
						<CartReminder />
					</PageHeader>
				{/snippet}
			</MealHand>
		{:else}
			<PageHeader {...header}>
				<CartReminder />
			</PageHeader>
			{#if ideas.length === 0}
				<EmptyHand soon={soonNames} />
			{/if}
		{/if}

		{#if ideas.length > 0}
			<PantryIdeas {ideas} oncook={cookNow} onadd={add} />
		{/if}
	</div>

	<div class="split__side today__side">
		<div class="split__extra">
			<div class="today__panels">
				<WeekBoard {...week} />
				<UseSoonList items={soon} />
				<ShopGlance names={shop.names} />
			</div>
		</div>

		<div class="today__menu">
			<a class="button" href={resolve('/menu')}>Change the menu</a>
		</div>
	</div>
</div>

<style>
	/* The main column: the title and the hand, one block after the other. */
	.today__main {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
		min-inline-size: 0;
	}

	/* The side column has a vertical rule at its left edge, as the page of a ledger. */
	@container main (min-width: 50rem) {
		.today {
			--split-columns: minmax(0, 1fr) 17rem;
		}

		.today__side {
			padding-inline-start: var(--space-6);
			border-inline-start: var(--rule-1) solid var(--ink);
		}

		/*
		 * A tall screen: the page has the height of the screen, and nothing scrolls. The hand fills
		 * the main column. Offers from the pantry go below the hand, and the page scrolls to them. The side column
		 * goes to the top, the bottom, and the right edge of the screen.
		 */
		@media (min-height: 36rem) {
			.today {
				grid-template-rows: minmax(0, 1fr);
				block-size: calc(100dvh - 2 * var(--space-8));
			}

			/* The shared split aligns its blocks to the top: the main column must fill the height. */
			.today__main {
				align-self: stretch;
				min-block-size: 0;
			}

			.today__side.today__side {
				align-self: stretch;
				justify-content: space-between;
				min-block-size: 0;
				margin-block: calc(-1 * var(--space-8));
				margin-inline-end: calc(-1 * var(--gutter));
				padding: var(--space-8) var(--gutter) var(--space-8) var(--space-6);
				overflow-y: auto;
				scrollbar-width: thin;
			}
		}
	}

	.today__panels {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
	}
</style>
