<script>
	import IngredientDialog from '$lib/components/ingredients/IngredientDialog.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { db } from '$lib/db/db';
	import { TRACKING, labelOf } from '$lib/domain/options';
	import { live } from '$lib/state/live.svelte';
	import { sortByName } from '$lib/util/collections';
	import { unitLabel } from '$lib/util/format';

	const ingredients = live(() => db.ingredients.toArray(), []);
	const sorted = $derived(sortByName(ingredients.current));

	/** @type {IngredientDialog | undefined} */
	let dialog = $state();
</script>

<PageHeader title="Ingredients">
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
