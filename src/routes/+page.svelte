<script>
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
	import { addAndStartCook, cook, startCook } from '$lib/data/cooking';
	import { addToMenu, markPrepDone } from '$lib/data/menu';
	import { usePreferences } from '$lib/state/preferences.svelte';
	import { useShopping } from '$lib/state/shopping.svelte';
	import { status } from '$lib/state/status.svelte';
	import { useToday } from '$lib/state/today.svelte';
	import { todayInWords } from '$lib/util/format';

	/** @typedef {import('$lib/domain/menu').MenuEntry} MenuEntry */

	const today = useToday();
	const shopping = useShopping();
	const preferences = usePreferences();

	/** The title block of the screen. */
	const header = $derived({
		title: 'Today',
		heading: today.heading,
		eyebrow: todayInWords(),
		subline: today.subline
	});

	/** The food names for the line of the empty hand. */
	const soonNames = $derived(
		today.soon
			.filter((item) => item.free > 0)
			.slice(0, 2)
			.map((item) => item.ingredient.name)
	);

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
		const id = await addAndStartCook(recipe.id);
		if (id) goto(resolve('/cook/[id]', { id }));
	}
</script>

<!-- The hand is the main column. The plan of the week and of the food is the side column. -->
<div class="split split--loose today">
	<div class="today__main">
		{#if today.hand.length > 0}
			<MealHand
				entries={today.hand}
				lastSessions={today.lastSessions}
				soon={today.soon}
				cooking={today.cooking}
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
			{#if today.ideas.length === 0}
				<EmptyHand meals={preferences.values.mealsInWeek} soon={soonNames} />
			{/if}
		{/if}

		{#if today.ideas.length > 0}
			<PantryIdeas ideas={today.ideas} oncook={cookNow} onadd={add} />
		{/if}
	</div>

	<div class="split__side today__side">
		<div class="split__extra">
			<div class="today__panels">
				<WeekBoard {...today.week} />
				<UseSoonList items={today.soon} />
				<ShopGlance names={shopping.needed.map((row) => row.name)} />
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
		 * goes to the top, the bottom, and the right edge of the screen. The same condition is in
		 * MealHand: it tells why the screen must be this tall.
		 */
		@media (min-height: 52rem) {
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
