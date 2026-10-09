<script>
	import { tick } from 'svelte';
	import { resolve } from '$app/paths';
	import PantryAddCard from '$lib/components/pantry/PantryAddCard.svelte';
	import PantryCounts from '$lib/components/pantry/PantryCounts.svelte';
	import PantryGroup from '$lib/components/pantry/PantryGroup.svelte';
	import PantryItemDetail from '$lib/components/pantry/PantryItemDetail.svelte';
	import PantrySide from '$lib/components/pantry/PantrySide.svelte';
	import PantryTools from '$lib/components/pantry/PantryTools.svelte';
	import PantryToShop from '$lib/components/pantry/PantryToShop.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { lastPantryCheck } from '$lib/data/doubt';
	import { addLowItems, addManualItem } from '$lib/data/shopping-items';
	import { belowSentence, soonSentence } from '$lib/domain/pantry-answers';
	import { usedIn } from '$lib/domain/pantry-detail';
	import {
		pantryGroups,
		pantryRows,
		rowsToShop,
		soonRows,
		viewCounts
	} from '$lib/domain/pantry-view';
	import { useRegroup } from '$lib/motion/regroup.svelte';
	import { useClock } from '$lib/state/clock.svelte';
	import { useKitchen } from '$lib/state/kitchen.svelte';
	import { live } from '$lib/state/live.svelte';
	import { usePantryHistory } from '$lib/state/pantry-history.svelte';
	import { useShopping } from '$lib/state/shopping.svelte';
	import { status } from '$lib/state/status.svelte';
	import { formatDay, pluralIs } from '$lib/util/format';
	import { MINUTE } from '$lib/util/time';

	/** @typedef {import('$lib/domain/pantry-view').PantryRow} PantryRow */

	const kitchen = useKitchen();
	const shopping = useShopping();
	const history = usePantryHistory();
	// A use-by date comes nearer each day, so the clock must move.
	const clock = useClock(MINUTE);
	const lastCheck = live(lastPantryCheck, '');

	let view = $state(/** @type {import('$lib/domain/pantry-view').PantryView} */ ('place'));
	let search = $state('');
	/** @type {PantryAddCard | undefined} */
	let addCard = $state();
	/** The ID of the item that the owner added a moment ago. Its row shows itself. */
	let fresh = $state('');
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let freshTimer;
	/** The ID of the item whose detail is open. */
	let openId = $state('');
	/** @type {PantryItemDetail | undefined} */
	let detail = $state();
	/** @type {HTMLElement | undefined} */
	let list = $state();

	// A change of the view moves each row to its new place.
	useRegroup(
		() => list,
		() => view
	);

	/** The counts are of the full pantry: a search does not change them. */
	const all = $derived(pantryRows(kitchen.pantry, kitchen.ingredientsById, clock.now));
	const rows = $derived(
		search.trim() ? pantryRows(kitchen.pantry, kitchen.ingredientsById, clock.now, search) : all
	);
	const groups = $derived(pantryGroups(view, rows));

	/** The two answers of the pantry: what to use, and what to buy. */
	const soon = $derived(soonRows(all));
	const below = $derived(all.filter((row) => row.level !== 'have'));
	const toShop = $derived(rowsToShop(all, shopping.listed));
	const soonText = $derived(soonSentence(soon[0], soon[0] ? usesOf(soon[0]) : []));

	const open = $derived(all.find((row) => row.item.id === openId));

	/** @param {PantryRow} row */
	function usesOf(row) {
		return usedIn(row.ingredient.id, kitchen.recipes, kitchen.menu);
	}

	/**
	 * The new item must be in view: a search can hide it.
	 * @param {string} id
	 */
	function added(id) {
		search = '';
		fresh = id;
		clearTimeout(freshTimer);
		freshTimer = setTimeout(() => (fresh = ''), 2500);
	}

	/** @param {PantryRow} row */
	async function openDetail(row) {
		openId = row.item.id;
		await tick();
		detail?.open();
	}

	async function allToShop() {
		const count = await addLowItems(toShop.map((row) => row.ingredient));
		status.say(`${pluralIs(count, 'item')} on the shopping list.`);
	}

	/**
	 * An item below the line goes to the list as "Low in the pantry". An item with enough
	 * stock goes to the list as an item that the owner added.
	 * @param {PantryRow} row
	 */
	async function oneToShop({ ingredient, level }) {
		if (level === 'have') await addManualItem(ingredient.name, kitchen.ingredients);
		else await addLowItems([ingredient]);
		status.say(`${ingredient.name} is on the shopping list.`);
	}
</script>

<!--
	The list is the main column. The side column has the two answers of the pantry, or the
	detail of one item. On a phone, the views give the answers, and the detail is a sheet.
-->
<div class="split pantry">
	<div class="stack">
		<!-- One block, so that the controls are close to the title and the list starts high. -->
		<div class="stack stack--tight">
			<PageHeader title="Pantry">
				<PantryCounts parts={viewCounts(view, all)} />
			</PageHeader>

			<PantryTools bind:view bind:search onadd={() => addCard?.open()} />

			<p class="pantry__check">
				<a href={resolve('/pantry/check')}>Pantry check</a>
				{#if lastCheck.current}
					<span class="muted">Last: {formatDay(lastCheck.current)}</span>
				{/if}
			</p>
		</div>

		{#if view === 'low' && !search}
			<div class="pantry__to-shop">
				<PantryToShop count={toShop.length} below={below.length} onadd={allToShop} />
			</div>
		{/if}

		<div class="pantry__list" bind:this={list}>
			{#each groups as group (group.key)}
				<PantryGroup {group} {fresh} onmore={openDetail} />
			{:else}
				<p class="muted" role="status">
					{search ? `"${search}" is not in the pantry.` : 'The pantry is empty.'}
				</p>
			{/each}
		</div>
	</div>

	<div class="split__side split__side--sticky">
		<PantryItemDetail
			bind:this={detail}
			row={open}
			uses={open ? usesOf(open) : []}
			lines={open ? history.linesOf(open.ingredient) : []}
			listed={open ? shopping.listed.has(open.ingredient.id) : false}
			onshop={oneToShop}
		/>

		<div class="split__extra pantry__answers">
			<PantrySide
				{soon}
				{soonText}
				below={below.length}
				belowText={belowSentence(below, toShop.length)}
				toShop={toShop.length}
				onadd={allToShop}
				onopen={openDetail}
			/>
		</div>
	</div>
</div>

<PantryAddCard
	bind:this={addCard}
	ingredients={kitchen.ingredients}
	pantryByIngredient={kitchen.pantryByIngredient}
	onadded={added}
/>

<style>
	/* The side column has a fixed width. The list gets the width that is left. */
	.pantry {
		--split-columns: minmax(0, 1fr) 21rem;
	}

	/* The weekly task: a link, as a second action in the design, with the date of the last one. */
	.pantry__check {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-3);
		font-weight: 700;
	}

	/*
	 * The places run down the columns: one on a phone, two in a wide main column. A group can
	 * go on in the next column, but a row and the title of a group stay whole.
	 */
	.pantry__list {
		columns: 2 20rem;
		column-gap: var(--space-8);

		& > :global(section) {
			margin-block-end: var(--space-5);
		}

		& :global(li),
		& :global([data-regroup^='title']) {
			break-inside: avoid;
		}

		& :global([data-regroup^='title']) {
			break-after: avoid;
		}
	}

	/* The side column is in view: the detail takes the place of the two answers. */
	.pantry :global(dialog[open] + .pantry__answers) {
		display: none;
	}

	@container main (min-width: 50rem) {
		/* The side column has the button. */
		.pantry__to-shop {
			display: none;
		}

		.pantry__answers {
			display: flex;
			flex-direction: column;
			gap: var(--space-6);
		}
	}
</style>
