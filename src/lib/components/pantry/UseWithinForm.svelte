<script>
	import { setUseWithin } from '$lib/data/pantry';
	import { daysLeft } from '$lib/domain/use-by';

	/**
	 * Sets the days in which the owner must use one pantry item. An empty field tells that the
	 * food keeps: the item has no use-by date.
	 * @type {{ item: import('$lib/types').PantryItem, ondone?: () => void }}
	 */
	let { item, ondone } = $props();

	const uid = $props.id();

	const left = $derived(daysLeft(item, Date.now()));

	/** @param {SubmitEvent & { currentTarget: HTMLFormElement }} event */
	async function submit(event) {
		event.preventDefault();
		const text = String(new FormData(event.currentTarget).get('days') ?? '').trim();
		const days = Number(text);
		if (Number.isNaN(days)) return;
		await setUseWithin(item.id, text ? days : null);
		ondone?.();
	}
</script>

<form class="use-within" onsubmit={submit}>
	<div class="field">
		<label class="field__label" for="{uid}-days">Use within (days)</label>
		<input
			class="field__control"
			id="{uid}-days"
			name="days"
			type="number"
			inputmode="numeric"
			min="0"
			step="1"
			placeholder="Keeps"
			value={left === null ? '' : Math.max(0, left)}
		/>
	</div>
	<button class="button" type="submit">Set</button>
</form>

<style>
	.use-within {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: end;
		gap: var(--space-2);
	}
</style>
