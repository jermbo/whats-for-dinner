<script>
	import SegmentedControl from '$lib/components/ui/SegmentedControl.svelte';
	import { LOCATIONS, STOCK_STATES } from '$lib/data/options';
	import { removeItem, setLocation, setState } from '$lib/data/pantry';
	import { status } from '$lib/status.svelte';
	import ExactQuantityForm from './ExactQuantityForm.svelte';
	import QuantityStepper from './QuantityStepper.svelte';

	/** @typedef {import('$lib/types').PantryItem} PantryItem */

	/**
	 * One pantry item. The fast edits are always in view. The other edits are under "More".
	 * @type {{ item: PantryItem, ingredient: import('$lib/types').Ingredient }}
	 */
	let { item, ingredient } = $props();

	const uid = $props.id();

	/** @param {'used' | 'thrown'} cause */
	async function gone(cause) {
		await removeItem(item, cause);
		status.say(`${ingredient.name} is removed from the pantry.`);
	}
</script>

<li class="list__item stack stack--tight">
	<div class="cluster cluster--between">
		<strong>{ingredient.name}</strong>

		{#if ingredient.tracking === 'quantity'}
			<QuantityStepper {item} {ingredient} />
		{:else}
			<SegmentedControl
				legend="Stock of {ingredient.name}"
				hideLegend
				options={STOCK_STATES}
				value={item.state}
				onchange={(state) =>
					setState(ingredient.id, /** @type {PantryItem['state']} */ (state), 'corrected')}
			/>
		{/if}
	</div>

	<details class="pantry-row__more">
		<summary class="pantry-row__summary">
			More <span class="visually-hidden">options for {ingredient.name}</span>
		</summary>

		<div class="stack stack--tight">
			{#if ingredient.tracking === 'quantity'}
				<ExactQuantityForm {item} {ingredient} />
			{/if}

			<div class="field">
				<label class="field__label" for="{uid}-location">Location</label>
				<select
					class="field__control"
					id="{uid}-location"
					value={item.location}
					onchange={(event) =>
						setLocation(item.id, /** @type {PantryItem['location']} */ (event.currentTarget.value))}
				>
					{#each LOCATIONS as location (location.value)}
						<option value={location.value}>{location.label}</option>
					{/each}
				</select>
			</div>

			<div class="cluster">
				<button class="button" type="button" onclick={() => gone('used')}>Used up</button>
				<button class="button button--danger" type="button" onclick={() => gone('thrown')}>
					Thrown away
				</button>
			</div>
		</div>
	</details>
</li>

<style>
	.pantry-row__summary {
		display: inline-flex;
		align-items: center;
		min-block-size: var(--tap);
		color: var(--color-accent-strong);
		font-weight: 600;
		cursor: pointer;
	}
</style>
