<script>
	import { emptyItem, removeItem, setLocation } from '$lib/data/pantry';
	import { LOCATIONS } from '$lib/domain/options';
	import { status } from '$lib/state/status.svelte';
	import ExactQuantityForm from './ExactQuantityForm.svelte';
	import LowLineForm from './LowLineForm.svelte';

	/**
	 * @typedef {import('$lib/types').PantryItem} PantryItem
	 * @typedef {import('$lib/domain/pantry-view').PantryRow} PantryRow
	 */

	/**
	 * The edits of one pantry item that the gauge cannot do: an exact number, the low line,
	 * the location, "used up", and "remove". An item that is used up stays in the pantry as "none".
	 * @type {{ onchange?: (item: PantryItem) => void }}
	 */
	let { onchange } = $props();

	const uid = $props.id();

	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state();
	/** @type {PantryRow | undefined} */
	let row = $state.raw();
	// A new key gives new fields each time the dialog opens.
	let opened = $state(0);

	/** @param {PantryRow} next */
	export function open(next) {
		row = next;
		opened += 1;
		dialog?.showModal();
	}

	/** @param {PantryItem} item */
	function changed(item) {
		dialog?.close();
		onchange?.(item);
	}

	/**
	 * @param {PantryRow} gone
	 * @param {'used' | 'thrown'} cause
	 */
	async function empty(gone, cause) {
		await emptyItem(gone.ingredient, cause);
		const { name } = gone.ingredient;
		status.say(cause === 'used' ? `${name} is used up.` : `${name} is thrown away.`);
		changed(gone.item);
	}

	/** @param {PantryRow} gone */
	async function remove(gone) {
		await removeItem(gone.item);
		status.say(`${gone.ingredient.name} is removed from the pantry.`);
		changed(gone.item);
	}
</script>

<dialog bind:this={dialog} aria-labelledby="{uid}-title">
	{#if row}
		{@const current = row}
		{@const { item, ingredient } = current}

		<div class="stack">
			<h2 id="{uid}-title">{ingredient.name}</h2>

			{#key opened}
				{#if ingredient.tracking === 'quantity'}
					<ExactQuantityForm {item} {ingredient} ondone={() => changed(item)} />
					<LowLineForm {item} {ingredient} ondone={() => changed(item)} />
				{/if}

				<div class="field">
					<label class="field__label" for="{uid}-location">Location</label>
					<select
						class="field__control"
						id="{uid}-location"
						value={item.location}
						onchange={(event) =>
							setLocation(
								item.id,
								/** @type {PantryItem['location']} */ (event.currentTarget.value)
							)}
					>
						{#each LOCATIONS as location (location.value)}
							<option value={location.value}>{location.label}</option>
						{/each}
					</select>
				</div>
			{/key}

			{#if current.level !== 'out'}
				<div class="cluster">
					<button class="button" type="button" onclick={() => empty(current, 'used')}>
						Used up
					</button>
					<button class="button" type="button" onclick={() => empty(current, 'thrown')}>
						Thrown away
					</button>
				</div>
			{/if}

			<button class="button button--danger" type="button" onclick={() => remove(current)}>
				Remove from the pantry
			</button>

			<button class="button button--strong" type="button" onclick={() => dialog?.close()}>
				Close
			</button>
		</div>
	{/if}
</dialog>
