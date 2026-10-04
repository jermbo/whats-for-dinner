<script>
	import Gauge from '$lib/components/ui/Gauge.svelte';
	import { setQuantity } from '$lib/data/pantry';
	import { pantryScale } from '$lib/domain/pantry-scale';
	import { formatQuantity } from '$lib/util/format';

	/** The first row starts after the page is in view. Each next row starts a moment later. */
	const START_MS = 600;
	const STAGGER_MS = 220;

	/**
	 * One ingredient that a meal used. The gauge goes down from the amount before the meal to
	 * the amount now. The owner can slide it if the real amount is different.
	 * @type {{
	 *   deduction: import('$lib/types').Deduction,
	 *   ingredient: import('$lib/types').Ingredient,
	 *   item: import('$lib/types').PantryItem,
	 *   index?: number
	 * }}
	 */
	let { deduction, ingredient, item, index = 0 } = $props();

	const scale = $derived(pantryScale(item, ingredient));
</script>

<li>
	<Gauge
		label={ingredient.name}
		{scale}
		note="Used {formatQuantity(deduction.amount, ingredient.unit)}"
		from={item.quantity + deduction.amount}
		delay={START_MS + index * STAGGER_MS}
		onchange={(value) => setQuantity(ingredient.id, value, 'corrected')}
	/>
</li>
