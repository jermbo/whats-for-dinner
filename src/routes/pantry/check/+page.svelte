<script>
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { resolve } from '$app/paths';
	import PantryGauge from '$lib/components/pantry/PantryGauge.svelte';
	import PantryItemSheet from '$lib/components/pantry/PantryItemSheet.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { findDoubts } from '$lib/data/doubt';
	import { groupByLocation, pantryRows } from '$lib/data/pantry-view';
	import { now } from '$lib/db/ids';
	import { getMeta, setMeta } from '$lib/db/meta';
	import { useKitchen } from '$lib/kitchen.svelte';
	import { live } from '$lib/live.svelte';
	import { status } from '$lib/status.svelte';
	import { formatDate, plural } from '$lib/util/format';

	const kitchen = useKitchen();
	const lastCheck = live(() => getMeta('lastPantryCheckAt'), undefined);

	/**
	 * The doubts at the start of the check: the item ID and the reason.
	 * They do not change during the check, so a row stays in its place after a correction.
	 * @type {Map<string, string> | undefined}
	 */
	let doubts = $state.raw();
	/** The IDs of the items that the owner changed in this check. */
	const changed = new SvelteSet();
	let finished = $state(false);
	/** @type {PantryItemSheet | undefined} */
	let sheet = $state();

	onMount(async () => {
		doubts = await findDoubts();
	});

	const rows = $derived(pantryRows(kitchen.pantry, kitchen.ingredientsById));
	const doubtful = $derived(rows.filter((row) => doubts?.has(row.item.id)));
	const sure = $derived(rows.filter((row) => !doubts?.has(row.item.id)));
	const sureGroups = $derived(groupByLocation(sure));

	async function finish() {
		await setMeta('lastPantryCheckAt', now());
		status.say('The pantry check is complete.');
		finished = true;
	}
</script>

<PageHeader title="Pantry check">
	{#if !finished}
		<a class="button" href={resolve('/pantry/scan')}>Scan a new item</a>
	{/if}
</PageHeader>

{#if finished}
	<section class="stack" aria-labelledby="check-done">
		<p><span class="stamp">Checked</span></p>
		<h2 id="check-done">The pantry is correct</h2>
		<p>{changed.size === 0 ? 'No item changed.' : `${plural(changed.size, 'item')} changed.`}</p>
		<div class="cluster">
			<a class="button button--primary" href={resolve('/menu')}>Plan the menu</a>
			<a class="button" href={resolve('/pantry')}>Open the pantry</a>
		</div>
	</section>
{:else if doubts}
	{#if rows.length === 0}
		<p class="muted">The pantry is empty. Scan or add the items that you have.</p>
	{:else}
		<div class="stack stack--tight">
			<p class="check__verdict">
				{#if doubtful.length === 0}
					I am sure about all <strong>{plural(rows.length, 'item')}</strong>.
				{:else}
					I am sure about <strong>{plural(sure.length, 'item')}</strong>. I have doubts about
					<strong>{doubtful.length}</strong>.
				{/if}
			</p>
			<p class="muted">
				Slide a row to the real amount. Do not touch a row that is correct.
				{#if typeof lastCheck.current === 'string'}
					Last check: {formatDate(lastCheck.current)}.
				{/if}
			</p>
		</div>

		{#if doubtful.length > 0}
			<section class="stack stack--tight" aria-labelledby="check-doubts">
				<h2 class="section-title" id="check-doubts">Look at these</h2>
				<ul class="gauges">
					{#each doubtful as row (row.item.id)}
						<PantryGauge
							item={row.item}
							ingredient={row.ingredient}
							note={doubts.get(row.item.id)}
							done={changed.has(row.item.id)}
							checking
							onchange={() => changed.add(row.item.id)}
							onmore={() => sheet?.open(row)}
						/>
					{/each}
				</ul>
			</section>
		{/if}

		{#if sure.length > 0}
			<details>
				<summary class="button">
					{plural(sure.length, 'item')} that I am sure about
				</summary>
				<div class="check__sure grid">
					{#each sureGroups as group (group.location)}
						<section class="stack stack--tight" aria-labelledby="check-{group.location}">
							<h3 class="section-title" id="check-{group.location}">{group.label}</h3>
							<ul class="gauges">
								{#each group.rows as row (row.item.id)}
									<PantryGauge
										item={row.item}
										ingredient={row.ingredient}
										done={changed.has(row.item.id)}
										checking
										onchange={() => changed.add(row.item.id)}
										onmore={() => sheet?.open(row)}
									/>
								{/each}
							</ul>
						</section>
					{/each}
				</div>
			</details>
		{/if}

		<button class="button button--primary button--wide" type="button" onclick={finish}>
			{doubtful.length === 0 && changed.size === 0 ? 'All is correct' : 'The rest is correct'}
		</button>
	{/if}
{/if}

<PantryItemSheet bind:this={sheet} onchange={(item) => changed.add(item.id)} />

<style>
	/* The answer of the app is the largest text on the screen. */
	.check__verdict {
		font-family: var(--font-display);
		font-size: 1.5rem;
		line-height: 1.25;

		& strong {
			color: var(--ink);
		}
	}

	.check__sure {
		padding-block-start: var(--space-4);
	}
</style>
