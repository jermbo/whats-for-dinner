<script>
	import { setQuantity } from '$lib/data/pantry';

	/**
	 * Fast choices for a weight or a volume, because the eye cannot see an exact number.
	 * "Full" is the largest quantity that this item had.
	 * @type {{
	 *   item: import('$lib/types').PantryItem,
	 *   ingredient: import('$lib/types').Ingredient,
	 *   ondone: () => void
	 * }}
	 */
	let { item, ingredient, ondone } = $props();

	const LEVELS = [
		{ label: 'Full', factor: 1 },
		{ label: 'Half', factor: 0.5 },
		{ label: 'Almost empty', factor: 0.1 }
	];

	/** @param {number} factor */
	async function set(factor) {
		await setQuantity(ingredient.id, item.fullQuantity * factor, 'corrected');
		ondone();
	}
</script>

<div class="cluster">
	{#each LEVELS as level (level.label)}
		<button class="button" type="button" onclick={() => set(level.factor)}>
			{level.label}
			<span class="visually-hidden">: {ingredient.name}</span>
		</button>
	{/each}
</div>
