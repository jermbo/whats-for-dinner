<script>
	import { resolve } from '$app/paths';
	import ManualItemForm from '$lib/components/shop/ManualItemForm.svelte';
	import ManualItemRow from '$lib/components/shop/ManualItemRow.svelte';
	import ShoppingRow from '$lib/components/shop/ShoppingRow.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { shoppingNeeds } from '$lib/data/shopping';
	import { db } from '$lib/db/db';
	import { useKitchen } from '$lib/kitchen.svelte';
	import { live } from '$lib/live.svelte';
	import { groupBy } from '$lib/util/collections';

	const kitchen = useKitchen();
	const manualItems = live(() => db.shopping.toArray(), []);

	const needs = $derived(
		shoppingNeeds(
			kitchen.menu,
			kitchen.recipesById,
			kitchen.ingredientsById,
			kitchen.pantryByIngredient
		)
	);
	const categories = $derived(groupBy(needs, (need) => need.ingredient.category));
</script>

<PageHeader title="Shopping list">
	<a class="button" href={resolve('/pantry')}>Do I have this?</a>
	<a class="button" href={resolve('/pantry/scan')}>Scan</a>
</PageHeader>

<p class="muted">
	The list has the ingredients of the meals on the menu, minus the items that the pantry has.
</p>

{#each categories as [category, items] (category)}
	<section class="stack stack--tight" aria-labelledby="shop-{category}">
		<h2 id="shop-{category}">{category}</h2>
		<ul class="list">
			{#each items as need (need.ingredient.id)}
				<ShoppingRow {need} />
			{/each}
		</ul>
	</section>
{:else}
	<p class="card" role="status">The pantry has all ingredients for the menu.</p>
{/each}

<section class="stack stack--tight" aria-labelledby="shop-other">
	<h2 id="shop-other">Other items</h2>

	{#if manualItems.current.length > 0}
		<ul class="list">
			{#each manualItems.current as item (item.id)}
				<ManualItemRow
					{item}
					ingredient={item.ingredientId
						? kitchen.ingredientsById.get(item.ingredientId)
						: undefined}
				/>
			{/each}
		</ul>
	{/if}

	<ManualItemForm ingredients={kitchen.ingredients} />
</section>
