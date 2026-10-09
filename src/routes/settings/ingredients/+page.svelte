<script>
	import { resolve } from '$app/paths';
	import IngredientDialog from '$lib/components/ingredients/IngredientDialog.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { TRACKING, labelOf } from '$lib/domain/options';
	import { useKitchen } from '$lib/state/kitchen.svelte';
	import { sortByName } from '$lib/util/collections';
	import { unitLabel } from '$lib/util/format';

	const kitchen = useKitchen();
	const sorted = $derived(sortByName(kitchen.ingredients));

	/** @type {IngredientDialog | undefined} */
	let dialog = $state();
</script>

<PageHeader title="Ingredients">
	<a class="button" href={resolve('/settings')}>Settings</a>
	<button class="button button--primary" type="button" onclick={() => dialog?.open()}>
		New ingredient
	</button>
</PageHeader>

{#if sorted.length === 0}
	<p class="muted">There are no ingredients. Add the first one.</p>
{:else}
	<ul class="list">
		{#each sorted as ingredient (ingredient.id)}
			<li class="list__item cluster cluster--between">
				<span class="stack stack--tight">
					<strong>{ingredient.name}</strong>
					<span class="muted">
						{ingredient.category} ·
						{ingredient.tracking === 'quantity'
							? unitLabel(ingredient.unit)
							: labelOf(TRACKING, ingredient.tracking)}
						{#if ingredient.perishable}· Perishable{/if}
					</span>
				</span>
				<button class="button" type="button" onclick={() => dialog?.open(ingredient)}>
					Edit <span class="visually-hidden">{ingredient.name}</span>
				</button>
			</li>
		{/each}
	</ul>
{/if}

<IngredientDialog bind:this={dialog} />
