<script>
	import { SvelteSet } from 'svelte/reactivity';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import FoodPlan from '$lib/components/menu/FoodPlan.svelte';
	import MealDealer from '$lib/components/menu/MealDealer.svelte';
	import MenuHand from '$lib/components/menu/MenuHand.svelte';
	import BuyList from '$lib/components/plan/BuyList.svelte';
	import NightPicker from '$lib/components/plan/NightPicker.svelte';
	import PlanHead from '$lib/components/plan/PlanHead.svelte';
	import WeekList from '$lib/components/plan/WeekList.svelte';
	import ToggleChip from '$lib/components/ui/ToggleChip.svelte';
	import { addToMenu, markPrepDone, removeFromMenu } from '$lib/data/menu';
	import { saveNights, setNights, setTheMenu } from '$lib/data/menu-plan';
	import { haveIt } from '$lib/data/pantry';
	import { dealFacts } from '$lib/domain/deal';
	import { entryName } from '$lib/domain/menu';
	import {
		fillNights,
		hasNights,
		moveMeal,
		nightsFor,
		offSentence,
		openNights,
		weekSentence,
		weekSequence
	} from '$lib/domain/menu-plan';
	import { nightStart } from '$lib/domain/nights';
	import { pop, rise } from '$lib/motion/transitions';
	import { useKitchen } from '$lib/state/kitchen.svelte';
	import { useMenuPlan } from '$lib/state/menu-plan.svelte';
	import { status } from '$lib/state/status.svelte';
	import { formatDay, plural } from '$lib/util/format';

	/**
	 * @typedef {import('$lib/domain/menu').MenuEntry} MenuEntry
	 * @typedef {import('$lib/domain/menu-plan').PlanStep} PlanStep
	 * @typedef {import('$lib/domain/shopping').ListRow} ListRow
	 */

	const kitchen = useKitchen();

	/** The step on the screen. Null until the database gives the plan. */
	let step = $state(/** @type {PlanStep | null} */ (null));
	/** The nights that the owner selects in the first step. */
	let nights = $state(/** @type {string[]} */ ([]));
	/** The filters of the dealer. */
	const filters = $state({ uses: false, quick: false, fresh: false });
	/** The food that is selected in "Use first". The dealer shows the recipes that use it. */
	const selected = new SvelteSet();
	/**
	 * The nights of a drag that the database does not have yet. The week shows them at once.
	 * @type {Map<string, string | null> | null}
	 */
	let moved = $state.raw(null);

	const menu = useMenuPlan({ nights: () => nights, moved: () => moved, filters, selected });

	// The screen opens with the step of the plan: the nights for a new week, the dealer for a
	// plan that is not complete, and the week for a menu that is set.
	$effect(() => {
		if (step !== null || !menu.ready) return;
		if (menu.firstStep === 'nights') nights = [...menu.usualNights];
		step = menu.firstStep;
	});

	// The database has the nights of the drag: the week shows the database again.
	$effect(() => {
		if (moved && hasNights(kitchen.menu, moved)) moved = null;
	});

	// Food that the menu uses up completely can no longer be selected.
	$effect(() => {
		for (const item of menu.soon) {
			if (item.free === 0) selected.delete(item.ingredient.id);
		}
	});

	/** @param {string} ingredientId */
	function toggle(ingredientId) {
		if (selected.has(ingredientId)) selected.delete(ingredientId);
		else selected.add(ingredientId);
	}

	/** The first step again, with the nights of the plan. */
	function changeNights() {
		nights = [...(menu.plan?.nights ?? menu.usualNights)];
		step = 'nights';
	}

	/** The meals in their sequence: the meal with the food that spoils first is first. */
	const sequence = () => weekSequence(menu.entries, menu.soon);

	/**
	 * Until the menu is set, the app puts the meals in their sequence.
	 * @param {string[]} free The nights from tonight.
	 */
	async function arrange(free) {
		if (!menu.plan?.setAt) await setNights(nightsFor(sequence(), free));
		step = 'week';
	}

	/**
	 * "Deal": the plan gets its nights, and each meal of the menu gets one of them. With a meal
	 * for each night, the week is next.
	 */
	async function deal() {
		const isSet = menu.plan?.setAt ?? null;
		const free = openNights(nights, menu.now);
		await saveNights(nights, isSet);
		await setNights(isSet ? fillNights(menu.meals, free) : nightsFor(sequence(), free));
		step = free.length > menu.meals.length ? 'deal' : 'week';
	}

	/**
	 * The dealer shows the result: the card goes up to the next place. A message would cover its
	 * buttons.
	 * @param {import('$lib/types').Recipe} recipe
	 */
	function keep(recipe) {
		return addToMenu(recipe.id);
	}

	/**
	 * A drag in the week: the meals change places.
	 * @param {number} from
	 * @param {number} to
	 */
	function sort(from, to) {
		moved = moveMeal(menu.rows, from, to);
		setNights(moved);
	}

	/** @param {ListRow} row */
	async function have(row) {
		if (!row.ingredient) return;
		await haveIt(row.ingredient, row.quantity);
		status.say(`The pantry has the ${row.name.toLowerCase()}.`);
	}

	async function setMenu() {
		await setTheMenu();
		goto(resolve('/'));
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

{#snippet count(/** @type {number} */ have, /** @type {number} */ total)}
	<p class="count">
		<span aria-hidden="true">
			{#key have}<span class="plan__pop" in:pop>{have}</span>{/key}<span class="count__total"
				>/{total}</span
			>
		</span>
		<span class="visually-hidden">{have} of {total}</span>
	</p>
{/snippet}

{#if step === 'nights'}
	<!-- Step 1: the nights of the week. The nights of the last week are the proposal. -->
	<div class="stack plan" in:rise>
		<PlanHead
			title="Which nights?"
			step="nights"
			sub="Week of {formatDay(nightStart(menu.week[0]))}."
			back={menu.plan ? 'Week' : undefined}
			onback={() => (step = 'week')}
		/>

		<div class="stack stack--tight">
			<NightPicker week={menu.week} bind:value={nights} />
			<p class="muted">{offSentence(menu.week, nights)} Tap a night to switch it.</p>
		</div>

		<div class="plan__fact">
			<span class="label">Meals</span>
			{#key nights.length}
				<span class="count plan__pop" in:pop>{nights.length}</span>
			{/key}
		</div>

		<FoodPlan items={menu.soon} {selected} ontoggle={toggle} />

		<button
			class="button button--strong button--wide"
			type="button"
			disabled={nights.length === 0}
			onclick={deal}
		>
			{menu.toDeal > 0 ? `Deal ${plural(menu.toDeal, 'meal')}` : 'See your week'}
		</button>
	</div>
{:else if step === 'deal'}
	<!--
		Step 2: the dealer. The places and the filters are the main column. The dealer is the side
		column.
	-->
	<div class="split" in:rise>
		<div class="stack stack--tight">
			<PlanHead title="Keep {menu.places.length}" step="deal" back="Nights" onback={changeNights}>
				{#snippet aside()}
					{@render count(menu.places.length - menu.open, menu.places.length)}
				{/snippet}
			</PlanHead>

			<MenuHand
				entries={menu.entries}
				open={menu.open}
				lastSessions={menu.lastSessions}
				onremove={remove}
				onprep={prepared}
			/>

			<div class="plan__filters">
				<ToggleChip label="Uses what I have" bind:checked={filters.uses} />
				<ToggleChip label="Quick" bind:checked={filters.quick} />
				<ToggleChip label="New to me" bind:checked={filters.fresh} />
			</div>
		</div>

		<div class="split__side">
			{#if menu.open > 0}
				<MealDealer
					title="Next best meal"
					deck={menu.deck}
					{selected}
					facts={(recipe) => dealFacts(recipe, menu.lastSessions.get(recipe.id))}
					empty="No recipe passes the filters."
					onadd={keep}
				/>
			{:else}
				<p class="plan__full" in:rise>
					Each night has a meal.
					<a href={resolve('/recipes')}>All recipes</a>
				</p>
			{/if}

			<button
				class={['button', 'button--wide', menu.open === 0 && 'button--strong']}
				type="button"
				disabled={menu.meals.length === 0}
				onclick={() => arrange(menu.places)}
			>
				See your week
			</button>
		</div>
	</div>
{:else if step === 'week'}
	<!-- Step 3: each meal on a night. After "Set the menu", the Menu tab opens here. -->
	<div class="stack plan" in:rise>
		<PlanHead
			title="Your week"
			step="week"
			sub="{weekSentence(menu.rows, menu.soon)} Drag to swap nights."
			back="Deal"
			onback={() => (step = 'deal')}
		/>

		<WeekList
			rows={menu.rows}
			loose={menu.loose}
			notes={menu.notes}
			today={menu.today}
			entries={menu.entries}
			lastSessions={menu.lastSessions}
			onsort={sort}
			onremove={remove}
			onprep={prepared}
			ondeal={() => (step = 'deal')}
		/>

		<p class="plan__off">
			<span class="muted">{offSentence(menu.week, menu.nights)}</span>
			<button class="button button--link" type="button" onclick={changeNights}>
				Change the nights
			</button>
		</p>

		<button class="button button--strong button--wide" type="button" onclick={() => (step = 'buy')}>
			See what to buy
		</button>
	</div>
{:else if step === 'buy'}
	<!-- Step 4: the gap between the meals and the pantry. "Set the menu" is the end of the flow. -->
	<div class="stack plan" in:rise>
		<PlanHead
			title={menu.toBuy.length > 0 ? `${menu.toBuy.length} to buy` : 'Nothing to buy'}
			step="buy"
			back="Week"
			onback={() => (step = 'week')}
		>
			{#snippet aside()}
				{#if menu.pantryHas.need > 0}
					<p class="plan__has">Pantry has {menu.pantryHas.have} of {menu.pantryHas.need}</p>
				{/if}
			{/snippet}
		</PlanHead>

		<BuyList rows={menu.toBuy} onhave={have} />

		<button class="button button--strong button--wide" type="button" onclick={setMenu}>
			{menu.plan?.setAt ? 'Go to Today' : 'Set the menu'}
		</button>
	</div>
{/if}

<style>
	/* A fact of the plan: its label at the left, and its number at the right, between two rules. */
	.plan__fact {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-block: var(--space-3);
		border-block: var(--rule-1) solid var(--ink);
		border-block-start-width: var(--rule-4);
	}

	/* A transform needs a box. */
	.plan__pop {
		display: inline-block;
		transform-origin: bottom center;
	}

	/* The filters: one row of small chips. */
	.plan__filters {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	/* The dealer has no card: a dashed note, as a place that waits. */
	.plan__full {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-2);
		padding: var(--space-5) var(--space-4);
		font-weight: 700;
		border: 2px dashed var(--ink);
		border-radius: var(--radius);
	}

	.plan__off {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0 var(--space-3);
	}

	.plan__has {
		padding-block-end: var(--space-1);
		font-weight: 700;
		text-align: end;
	}
</style>
