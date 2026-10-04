<script>
	import { resolve } from '$app/paths';
	import PantryAddForm from '$lib/components/pantry/PantryAddForm.svelte';
	import PantryGauge from '$lib/components/pantry/PantryGauge.svelte';
	import PantryItemSheet from '$lib/components/pantry/PantryItemSheet.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { pantryGroups } from '$lib/domain/pantry-view';
	import { useKitchen } from '$lib/state/kitchen.svelte';

	const kitchen = useKitchen();

	let search = $state('');
	/** @type {PantryItemSheet | undefined} */
	let sheet = $state();

	const groups = $derived(pantryGroups(kitchen.pantry, kitchen.ingredientsById, search));
</script>

<PageHeader title="Pantry">
	<a class="button button--primary" href={resolve('/pantry/scan')}>Scan</a>
	<a class="button" href={resolve('/pantry/check')}>Pantry check</a>
</PageHeader>

<div class="field">
	<label class="field__label" for="pantry-search">Do I have this?</label>
	<input
		class="field__control"
		id="pantry-search"
		type="search"
		bind:value={search}
		autocomplete="off"
	/>
</div>

{#if groups.length > 0}
	<p class="muted">Slide a row, or tap it, to change the amount.</p>
{/if}

<div class="grid">
	{#each groups as group (group.location)}
		<section class="stack stack--tight" aria-labelledby="pantry-{group.location}">
			<h2 class="section-title" id="pantry-{group.location}">{group.label}</h2>
			<ul class="gauges">
				{#each group.rows as row (row.item.id)}
					<PantryGauge
						item={row.item}
						ingredient={row.ingredient}
						onmore={() => sheet?.open(row)}
					/>
				{/each}
			</ul>
		</section>
	{:else}
		<p class="muted" role="status">
			{search ? `"${search}" is not in the pantry.` : 'The pantry is empty.'}
		</p>
	{/each}
</div>

<details>
	<summary class="button">Add an item by hand</summary>
	<div class="card">
		<PantryAddForm ingredients={kitchen.ingredients} />
	</div>
</details>

<PantryItemSheet bind:this={sheet} />
