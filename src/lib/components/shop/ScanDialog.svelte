<script>
	import BarcodeEntryForm from '$lib/components/pantry/BarcodeEntryForm.svelte';
	import BarcodeScanner from '$lib/components/pantry/BarcodeScanner.svelte';
	import { findProduct } from '$lib/data/products';

	/**
	 * Scans a barcode in the store. A product that the owner scanned before goes to "onfound":
	 * the result is the same as a tap on its photo. This works with no connection.
	 * A barcode that the app does not know stays in the dialog, with a message.
	 * @type {{ onfound: (product: import('$lib/types').Product) => void }}
	 */
	let { onfound } = $props();

	const uid = $props.id();

	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state();
	/** The camera is on only while the dialog is open. */
	let scanning = $state(false);
	/** The last barcode that the app does not know. The camera sees a barcode many times. */
	let unknown = $state('');
	let busy = false;

	export function open() {
		unknown = '';
		scanning = true;
		dialog?.showModal();
	}

	/** @param {string} barcode */
	async function found(barcode) {
		if (busy || barcode === unknown) return;
		busy = true;
		const product = await findProduct(barcode);
		busy = false;

		if (!product) {
			unknown = barcode;
			return;
		}
		dialog?.close();
		onfound(product);
	}
</script>

<dialog bind:this={dialog} aria-labelledby="{uid}-title" onclose={() => (scanning = false)}>
	<div class="stack">
		<h2 id="{uid}-title">Scan a barcode</h2>

		{#if scanning}
			<BarcodeScanner ondetect={found} />
			<BarcodeEntryForm onsubmit={found} />
		{/if}

		<p class={['card', unknown && 'card--notice']} role="status" hidden={!unknown}>
			{#if unknown}
				This product is new. Tap the item on the list. You can add the product at home.
			{/if}
		</p>

		<button class="button button--strong" type="button" onclick={() => dialog?.close()}>
			Close
		</button>
	</div>
</dialog>
