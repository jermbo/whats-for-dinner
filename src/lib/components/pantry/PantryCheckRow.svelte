<script>
	import SegmentedControl from '$lib/components/ui/SegmentedControl.svelte';
	import { STOCK_STATES, labelOf } from '$lib/data/options';
	import { removeItem, setState } from '$lib/data/pantry';
	import { formatQuantity } from '$lib/util/format';
	import ExactQuantityForm from './ExactQuantityForm.svelte';
	import LevelButtons from './LevelButtons.svelte';

	/** @typedef {import('$lib/types').PantryItem} PantryItem */

	/**
	 * One item in the weekly pantry check: correct, change the amount, or gone.
	 * @type {{
	 *   item: PantryItem,
	 *   ingredient: import('$lib/types').Ingredient,
	 *   checked: boolean,
	 *   oncheck: (checked: boolean) => void
	 * }}
	 */
	let { item, ingredient, checked, oncheck } = $props();

	const counted = $derived(ingredient.tracking === 'quantity');
	const amount = $derived(
		counted ? formatQuantity(item.quantity, ingredient.unit) : labelOf(STOCK_STATES, item.state)
	);

	/** @param {string} state */
	async function changeState(state) {
		await setState(ingredient.id, /** @type {PantryItem['state']} */ (state), 'corrected');
		oncheck(true);
	}
</script>

<li class="list__item stack stack--tight">
	<div class="cluster cluster--between">
		<span><strong>{ingredient.name}</strong> · {amount}</span>

		{#if checked}
			<span class="cluster">
				<span class="badge badge--good">Checked</span>
				<button class="button" type="button" onclick={() => oncheck(false)}>
					Change <span class="visually-hidden">{ingredient.name}</span>
				</button>
			</span>
		{:else}
			<button class="button button--strong" type="button" onclick={() => oncheck(true)}>
				Correct <span class="visually-hidden">: {ingredient.name}</span>
			</button>
		{/if}
	</div>

	{#if !checked}
		{#if counted}
			{#if ingredient.unit !== 'count' && item.fullQuantity > 0}
				<LevelButtons {item} {ingredient} ondone={() => oncheck(true)} />
			{/if}
			<ExactQuantityForm {item} {ingredient} ondone={() => oncheck(true)} />
		{:else}
			<SegmentedControl
				legend="Stock of {ingredient.name}"
				hideLegend
				options={STOCK_STATES}
				value={item.state}
				onchange={changeState}
			/>
		{/if}

		<div class="cluster">
			<button class="button" type="button" onclick={() => removeItem(item, 'used')}>
				Gone: used <span class="visually-hidden">({ingredient.name})</span>
			</button>
			<button
				class="button button--danger"
				type="button"
				onclick={() => removeItem(item, 'thrown')}
			>
				Gone: thrown away <span class="visually-hidden">({ingredient.name})</span>
			</button>
		</div>
	{/if}
</li>
