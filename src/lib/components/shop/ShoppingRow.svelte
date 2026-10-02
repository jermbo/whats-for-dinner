<script>
	import { collapse } from '$lib/motion/transitions';
	import { buy } from '$lib/data/shopping';
	import { status } from '$lib/status.svelte';
	import { unitLabel } from '$lib/util/format';

	/**
	 * One item that the menu needs and the pantry does not have.
	 * "Bought" puts it into the pantry. The owner can change the quantity first.
	 * @type {{ need: import('$lib/data/shopping').Need }}
	 */
	let { need } = $props();

	const uid = $props.id();
	const ingredient = $derived(need.ingredient);
	const counted = $derived(ingredient.tracking === 'quantity');

	/** @param {SubmitEvent & { currentTarget: HTMLFormElement }} event */
	async function submit(event) {
		event.preventDefault();
		const quantity = Number(new FormData(event.currentTarget).get('quantity')) || need.quantity;
		await buy(ingredient, quantity);
		status.say(`${ingredient.name} is in the pantry.`);
	}
</script>

<li class="list__item" transition:collapse>
	<form class="shopping-row" onsubmit={submit}>
		<div class="shopping-row__name stack stack--tight">
			<strong>{ingredient.name}</strong>
			<span class="muted">For: {need.recipes.join(', ')}</span>
		</div>

		{#if counted}
			<div class="field shopping-row__quantity">
				<label class="field__label" for="{uid}-quantity">
					<span class="visually-hidden">Quantity of {ingredient.name} in</span>
					{unitLabel(ingredient.unit)}
				</label>
				<input
					class="field__control"
					id="{uid}-quantity"
					name="quantity"
					type="number"
					inputmode="decimal"
					min="0"
					step="any"
					value={need.quantity}
				/>
			</div>
		{/if}

		<button class="button button--strong" type="submit">
			Bought <span class="visually-hidden">: {ingredient.name}</span>
		</button>
	</form>
</li>

<style>
	.shopping-row {
		display: grid;
		grid-template-columns: 1fr 6rem auto;
		align-items: end;
		gap: var(--space-2);
	}

	.shopping-row__name {
		align-self: center;
	}

	.shopping-row__quantity {
		grid-column: 2;
	}

	.shopping-row > .button {
		grid-column: 3;
	}
</style>
