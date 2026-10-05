<script>
	import { resolve } from '$app/paths';
	import PantryAddCard from '$lib/components/pantry/PantryAddCard.svelte';
	import PantryCounts from '$lib/components/pantry/PantryCounts.svelte';
	import PantryGroup from '$lib/components/pantry/PantryGroup.svelte';
	import PantryItemSheet from '$lib/components/pantry/PantryItemSheet.svelte';
	import PantryTools from '$lib/components/pantry/PantryTools.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { lastPantryCheck } from '$lib/data/doubt';
	import { groupByLevel, groupByLocation, pantryCounts, pantryRows } from '$lib/domain/pantry-view';
	import { useRegroup } from '$lib/motion/regroup.svelte';
	import { useKitchen } from '$lib/state/kitchen.svelte';
	import { live } from '$lib/state/live.svelte';
	import { formatDay } from '$lib/util/format';

	const kitchen = useKitchen();
	const lastCheck = live(lastPantryCheck, '');

	let view = $state(/** @type {import('$lib/domain/pantry-view').PantryView} */ ('place'));
	let search = $state('');
	/** @type {PantryAddCard | undefined} */
	let addCard = $state();
	/** The ID of the item that the owner added a moment ago. Its row shows itself. */
	let fresh = $state('');
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let freshTimer;
	/** @type {PantryItemSheet | undefined} */
	let sheet = $state();
	/** @type {HTMLElement | undefined} */
	let list = $state();

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

	// A change of the view moves each row to its new place.
	useRegroup(
		() => list,
		() => view
	);

	/** The counts are of the full pantry: a search does not change them. */
	const all = $derived(pantryRows(kitchen.pantry, kitchen.ingredientsById));
	const counts = $derived(pantryCounts(all));

	const rows = $derived(
		search.trim() ? pantryRows(kitchen.pantry, kitchen.ingredientsById, search) : all
	);
	const groups = $derived(view === 'low' ? groupByLevel(rows) : groupByLocation(rows));
</script>

<!-- One block, so that the controls are close to the title and the list starts high. -->
<div class="stack stack--tight wide">
	<PageHeader title="Pantry">
		<PantryCounts {...counts} />
	</PageHeader>

	<PantryTools bind:view bind:search onadd={() => addCard?.open()} />

	<p class="pantry__check">
		<a href={resolve('/pantry/check')}>Pantry check</a>
		{#if lastCheck.current}
			<span class="muted">Last: {formatDay(lastCheck.current)}</span>
		{/if}
	</p>
</div>

<div class="grid" bind:this={list}>
	{#each groups as group (group.key)}
		<PantryGroup {group} {fresh} onmore={(row) => sheet?.open(row)} />
	{:else}
		<p class="muted" role="status">
			{search ? `"${search}" is not in the pantry.` : 'The pantry is empty.'}
		</p>
	{/each}
</div>

<PantryItemSheet bind:this={sheet} />
<PantryAddCard
	bind:this={addCard}
	ingredients={kitchen.ingredients}
	pantryByIngredient={kitchen.pantryByIngredient}
	onadded={added}
/>

<style>
	/* The weekly task: a link, as a second action in the design, with the date of the last one. */
	.pantry__check {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-3);
		font-weight: 700;
	}
</style>
