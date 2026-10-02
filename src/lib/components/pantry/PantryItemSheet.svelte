<script>
	import { LOCATIONS } from '$lib/data/options';
	import { removeItem, setLocation } from '$lib/data/pantry';
	import { status } from '$lib/status.svelte';
	import ExactQuantityForm from './ExactQuantityForm.svelte';

	/**
	 * @typedef {import('$lib/types').PantryItem} PantryItem
	 * @typedef {import('$lib/data/pantry-view').PantryRow} PantryRow
	 */

	/**
	 * The edits of one pantry item that the gauge cannot do: an exact number, the location,
	 * and "gone".
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
	async function remove(gone, cause) {
		await removeItem(gone.item, cause);
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

			<div class="cluster">
				<button class="button" type="button" onclick={() => remove(current, 'used')}>
					Used up
				</button>
				<button
					class="button button--danger"
					type="button"
					onclick={() => remove(current, 'thrown')}
				>
					Thrown away
				</button>
			</div>

			<button class="button button--strong" type="button" onclick={() => dialog?.close()}>
				Close
			</button>
		</div>
	{/if}
</dialog>
