<script>
	import ItemFields from './ItemFields.svelte';

	/**
	 * @typedef {import('$lib/domain/put-away').CartEntry} CartEntry
	 * @typedef {import('$lib/types').Product} Product
	 */

	/**
	 * The card that corrects an item that is put away. The changes wait on the card, and go into
	 * the record with "Save", so that the pantry changes one time. "Cancel" makes no change.
	 * A new product is different: it goes into the record when it is made.
	 * @type {{
	 *   entry: CartEntry,
	 *   titleId: string,
	 *   onsave: (entry: CartEntry) => void,
	 *   oncancel: () => void,
	 *   onnew: () => void
	 * }}
	 *   onsave: gets the item with the changes and the numbers of the fields.
	 */
	let { entry, titleId, onsave, oncancel, onnew } = $props();

	/**
	 * The quantity and the product that the owner set on this card. Null: no change.
	 * @type {number | null}
	 */
	let newQuantity = $state(null);
	/** @type {Product | null} */
	let newProduct = $state(null);

	const product = $derived(newProduct ?? entry.product);
	const quantity = $derived(newQuantity ?? entry.quantity ?? 0);

	/** The card shows the new product of the record, and not a product that waits for "Save". */
	function startProduct() {
		newProduct = null;
		onnew();
	}
</script>

<ItemFields
	{entry}
	{titleId}
	{product}
	{quantity}
	cancel="Cancel"
	confirm="Save"
	onselect={(selected) => (newProduct = selected)}
	onnew={startProduct}
	onquantity={(value) => (newQuantity = value)}
	{oncancel}
	onconfirm={(numbers) => onsave({ ...entry, product, ...numbers })}
/>
