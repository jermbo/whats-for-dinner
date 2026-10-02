<script>
	import { SvelteSet } from 'svelte/reactivity';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import PantryCheckRow from '$lib/components/pantry/PantryCheckRow.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { pantryGroups } from '$lib/data/pantry-view';
	import { now } from '$lib/db/ids';
	import { getMeta, setMeta } from '$lib/db/meta';
	import { useKitchen } from '$lib/kitchen.svelte';
	import { live } from '$lib/live.svelte';
	import { status } from '$lib/status.svelte';
	import { formatDate } from '$lib/util/format';

	const kitchen = useKitchen();
	const lastCheck = live(() => getMeta('lastPantryCheckAt'), undefined);

	/** The IDs of the items that are checked in this session. */
	const checked = new SvelteSet();

	const groups = $derived(pantryGroups(kitchen.pantry, kitchen.ingredientsById));
	const total = $derived(kitchen.pantry.length);

	/**
	 * @param {string} id
	 * @param {boolean} value
	 */
	function check(id, value) {
		if (value) checked.add(id);
		else checked.delete(id);
	}

	async function finish() {
		await setMeta('lastPantryCheckAt', now());
		status.say('The pantry check is complete.');
		goto(resolve('/menu'));
	}
</script>

<PageHeader title="Pantry check">
	<a class="button" href={resolve('/pantry/scan')}>Scan a new item</a>
</PageHeader>

<p class="muted">
	Look at each real item. Tap "Correct", change the amount, or tap "Gone".
	{#if typeof lastCheck.current === 'string'}
		Last check: {formatDate(lastCheck.current)}.
	{/if}
</p>

<p role="status"><strong>{checked.size} of {total} items checked.</strong></p>

{#each groups as group (group.location)}
	<section class="stack stack--tight" aria-labelledby="check-{group.location}">
		<h2 id="check-{group.location}">{group.label}</h2>
		<ul class="list">
			{#each group.rows as row (row.item.id)}
				<PantryCheckRow
					item={row.item}
					ingredient={row.ingredient}
					checked={checked.has(row.item.id)}
					oncheck={(value) => check(row.item.id, value)}
				/>
			{/each}
		</ul>
	</section>
{:else}
	<p class="muted">The pantry is empty. Scan or add the items that you have.</p>
{/each}

<button class="button button--primary button--wide" type="button" onclick={finish}>
	Finish the check and plan the menu
</button>
