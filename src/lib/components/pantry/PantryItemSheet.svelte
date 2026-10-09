<script>
	import { emptyItem } from '$lib/data/pantry';
	import { status } from '$lib/state/status.svelte';
	import PantryItemEdit from './PantryItemEdit.svelte';

	/**
	 * @typedef {import('$lib/types').PantryItem} PantryItem
	 * @typedef {import('$lib/domain/pantry-view').PantryRow} PantryRow
	 */

	/**
	 * The edits of one pantry item, as a sheet above the page of the pantry check. An item that
	 * is used up stays in the pantry as "none".
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

	/** @param {PantryRow} done */
	function changed(done) {
		dialog?.close();
		onchange?.(done.item);
	}

	/** @param {PantryRow} gone */
	async function usedUp(gone) {
		await emptyItem(gone.ingredient, 'used');
		status.say(`${gone.ingredient.name} is used up.`);
		changed(gone);
	}
</script>

<dialog bind:this={dialog} aria-labelledby="{uid}-title">
	{#if row}
		{@const current = row}

		<div class="stack">
			<h2 id="{uid}-title">{current.ingredient.name}</h2>

			{#key opened}
				<PantryItemEdit row={current} ondone={() => changed(current)} />
			{/key}

			{#if current.level !== 'out'}
				<button class="button" type="button" onclick={() => usedUp(current)}>Used up</button>
			{/if}

			<button class="button button--strong" type="button" onclick={() => dialog?.close()}>
				Close
			</button>
		</div>
	{/if}
</dialog>
