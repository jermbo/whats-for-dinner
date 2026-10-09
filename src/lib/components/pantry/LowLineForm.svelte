<script>
	import { setLowLine } from '$lib/data/ingredients';
	import { pantryScale } from '$lib/domain/pantry-scale';
	import { unitLabel } from '$lib/util/format';

	/**
	 * Sets the low line of one ingredient: at this quantity or less, the pantry is low.
	 * An empty field gives the low line of the app again: a quarter of a full package.
	 * @type {{
	 *   item: import('$lib/types').PantryItem,
	 *   ingredient: import('$lib/types').Ingredient,
	 *   ondone?: () => void
	 * }}
	 */
	let { item, ingredient, ondone } = $props();

	const uid = $props.id();

	const scale = $derived(pantryScale(item, ingredient));

	/** @param {SubmitEvent & { currentTarget: HTMLFormElement }} event */
	async function submit(event) {
		event.preventDefault();
		const text = String(new FormData(event.currentTarget).get('low') ?? '').trim();
		const low = Number(text);
		if (Number.isNaN(low)) return;
		await setLowLine(ingredient.id, text ? low : undefined);
		ondone?.();
	}
</script>

<form class="low-line" onsubmit={submit}>
	<div class="field">
		<label class="field__label" for="{uid}-low">
			Low at ({unitLabel(ingredient.unit)})
		</label>
		<input
			class="field__control"
			id="{uid}-low"
			name="low"
			type="number"
			inputmode="decimal"
			min="0"
			step="any"
			value={scale.low}
		/>
	</div>
	<button class="button" type="submit">Set</button>
</form>

<style>
	.low-line {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: end;
		gap: var(--space-2);
	}
</style>
