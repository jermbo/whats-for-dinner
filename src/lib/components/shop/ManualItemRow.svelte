<script>
	import { collapse } from '$lib/motion/transitions';
	import { buyManualItem, removeManualItem } from '$lib/data/shopping';
	import { status } from '$lib/status.svelte';
	import { formatQuantity } from '$lib/util/format';

	/**
	 * One item that the owner added to the list by hand.
	 * If it is an ingredient, "Bought" puts it into the pantry.
	 * @type {{
	 *   item: import('$lib/types').ShoppingItem,
	 *   ingredient: import('$lib/types').Ingredient | undefined
	 * }}
	 */
	let { item, ingredient } = $props();

	async function bought() {
		await buyManualItem(item, ingredient, item.quantity);
		status.say(ingredient ? `${item.name} is in the pantry.` : `${item.name} is bought.`);
	}
</script>

<li class="list__item cluster cluster--between" transition:collapse>
	<span>
		<strong>{item.name}</strong>
		{#if ingredient?.tracking === 'quantity' && item.quantity > 0}
			<span class="muted">{formatQuantity(item.quantity, ingredient.unit)}</span>
		{:else if item.quantity > 0}
			<span class="muted">{item.quantity}</span>
		{/if}
	</span>

	<span class="cluster">
		<button class="button button--strong" type="button" onclick={bought}>
			Bought <span class="visually-hidden">: {item.name}</span>
		</button>
		<button class="button" type="button" onclick={() => removeManualItem(item.id)}>
			Remove <span class="visually-hidden">{item.name}</span>
		</button>
	</span>
</li>
