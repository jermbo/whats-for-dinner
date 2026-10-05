<script>
	import ChoiceChips from '$lib/components/ui/ChoiceChips.svelte';
	import { correct, setProduct } from '$lib/data/cart';
	import { withinChoices } from '$lib/domain/use-by';
	import ItemFields from './ItemFields.svelte';

	/** @typedef {import('$lib/domain/put-away').CartEntry} CartEntry */

	/**
	 * The card of an item that is in the cart. A change on the card goes into the record at once,
	 * so the receipt shows it after "Later" too. "Put away" puts the item into the pantry.
	 * For food that spoils, "Use within" proposes the usual days of the food: the answer is the
	 * use-by date in the pantry. "Not bought" is for a wrong tap, or for a store that had none:
	 * the item goes back on the shopping list.
	 * @type {{
	 *   entry: CartEntry,
	 *   titleId: string,
	 *   onputaway: (entry: CartEntry) => void,
	 *   onlater: () => void,
	 *   onnotbought: () => void,
	 *   onnew: () => void
	 * }}
	 *   onputaway: gets the item with the numbers of the fields.
	 */
	let { entry, titleId, onputaway, onlater, onnotbought, onnew } = $props();

	/**
	 * The answer to "Use within" that the owner selected on this card. The card shows it before
	 * the record has it.
	 * @type {import('$lib/types').UseWithin | null}
	 */
	let selected = $state(null);

	const within = $derived(selected ?? entry.within);

	/** @param {string} value A number of days, or "freezer". */
	function setWithin(value) {
		selected = value === 'freezer' ? value : Number(value);
		correct(entry.purchase, { within: selected });
	}
</script>

<ItemFields
	{entry}
	{titleId}
	product={entry.product}
	quantity={entry.quantity ?? 0}
	cancel="Later"
	confirm="Put away"
	onselect={(product) => setProduct(entry.purchase, product.id)}
	{onnew}
	onquantity={(quantity) => correct(entry.purchase, { quantity })}
	onprice={(price) => correct(entry.purchase, { price })}
	oncancel={onlater}
	onconfirm={(numbers) => onputaway({ ...entry, within, ...numbers })}
>
	{#if entry.ingredient && within !== null}
		<ChoiceChips
			legend="Use within"
			options={withinChoices(entry.ingredient)}
			bind:value={() => String(within), setWithin}
		/>
	{/if}

	{#snippet foot()}
		<button class="button button--link cart-item__not" type="button" onclick={onnotbought}>
			Not bought
		</button>
	{/snippet}
</ItemFields>

<style>
	/* A quiet action below the two buttons: it is not the usual answer. */
	.cart-item__not {
		align-self: center;
		margin-block-start: calc(-1 * var(--space-2));
	}
</style>
