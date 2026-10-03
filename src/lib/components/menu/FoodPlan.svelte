<script>
	import SoonShelf from './SoonShelf.svelte';

	/**
	 * The food to use first, and how much of it the menu uses. An item is "planned" when the
	 * meals on the menu use it completely. When all items are planned, the plan is done.
	 * A tap on an item selects it: the dealer then shows only the recipes that use it.
	 * @type {{
	 *   items: import('$lib/data/use-up').SoonItem[],
	 *   selected: Set<string>,
	 *   ontoggle: (ingredientId: string) => void
	 * }}
	 */
	let { items, selected, ontoggle } = $props();

	const planned = $derived(items.filter((item) => item.free === 0).length);
	const done = $derived(planned === items.length);
</script>

<section class="stack stack--tight" aria-labelledby="food-plan-title">
	<div class="cluster cluster--between">
		<h2 id="food-plan-title">Food to use</h2>
		{#if items.length > 0}
			<span class={['badge', done && 'badge--good']}>
				{done ? 'All planned' : `${planned} of ${items.length} planned`}
			</span>
		{/if}
	</div>

	{#if items.length > 0}
		<SoonShelf {items} {selected} {ontoggle} />
	{:else}
		<p class="muted">No fresh food waits.</p>
	{/if}
</section>
