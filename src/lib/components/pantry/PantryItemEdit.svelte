<script>
	import { emptyItem, removeItem, setLocation } from '$lib/data/pantry';
	import { LOCATIONS } from '$lib/domain/options';
	import { status } from '$lib/state/status.svelte';
	import ExactQuantityForm from './ExactQuantityForm.svelte';
	import LowLineForm from './LowLineForm.svelte';
	import UseWithinForm from './UseWithinForm.svelte';

	/**
	 * @typedef {import('$lib/types').PantryItem} PantryItem
	 * @typedef {import('$lib/domain/pantry-view').PantryRow} PantryRow
	 */

	/**
	 * The edits of one pantry item that the gauge cannot do: an exact number, the low line, the
	 * days to use it, the location, "thrown away", and "remove".
	 * @type {{ row: PantryRow, ondone: () => void }}
	 *   ondone: the owner completed an edit that closes the item.
	 */
	let { row, ondone } = $props();

	const uid = $props.id();

	const item = $derived(row.item);
	const ingredient = $derived(row.ingredient);

	async function throwAway() {
		await emptyItem(ingredient, 'thrown');
		status.say(`${ingredient.name} is thrown away.`);
		ondone();
	}

	async function remove() {
		await removeItem(item);
		status.say(`${ingredient.name} is removed from the pantry.`);
		ondone();
	}
</script>

<div class="stack">
	{#if ingredient.tracking === 'quantity'}
		<ExactQuantityForm {item} {ingredient} {ondone} />
		<LowLineForm {item} {ingredient} {ondone} />
	{/if}

	{#if item.location !== 'freezer'}
		<UseWithinForm {item} {ondone} />
	{/if}

	<div class="field">
		<label class="field__label" for="{uid}-location">Location</label>
		<select
			class="field__control"
			id="{uid}-location"
			value={item.location}
			onchange={(event) =>
				setLocation(
					item,
					ingredient,
					/** @type {PantryItem['location']} */ (event.currentTarget.value)
				)}
		>
			{#each LOCATIONS as location (location.value)}
				<option value={location.value}>{location.label}</option>
			{/each}
		</select>
	</div>

	<div class="cluster">
		{#if row.level !== 'out'}
			<button class="button" type="button" onclick={throwAway}>Thrown away</button>
		{/if}
		<button class="button button--danger" type="button" onclick={remove}>
			Remove from the pantry
		</button>
	</div>
</div>
