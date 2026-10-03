<script>
	import BarcodeScanner from '$lib/components/pantry/BarcodeScanner.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { savePhoto } from '$lib/data/photo-storage';
	import { blankProduct, findProduct, lookupProduct, saveProduct } from '$lib/data/products';
	import { isCounted } from '$lib/data/put-away';
	import { unitLabel } from '$lib/util/format';
	import PhotoField from './PhotoField.svelte';

	/** @typedef {import('$lib/types').Product} Product */

	/**
	 * The form of a new product. The owner takes a photo and types the package size: this is
	 * the only time that the owner types it. The name and the barcode are optional.
	 * With a connection, a new barcode fills in the name and the package size.
	 * A barcode that is a product of this ingredient already gives that product.
	 * @type {{
	 *   ingredient: import('$lib/types').Ingredient,
	 *   onsave: (product: Product) => void,
	 *   oncancel: () => void
	 * }}
	 */
	let { ingredient, onsave, oncancel } = $props();

	const uid = $props.id();

	/** @type {Blob | null} */
	let photo = $state(null);
	/** @type {number | null} */
	let size = $state(null);
	let name = $state('');
	let barcode = $state('');
	let scanning = $state(false);
	let problem = $state('');
	let saving = $state(false);

	const counted = $derived(isCounted(ingredient));

	/**
	 * Looks for the barcode in the products on the phone.
	 * @returns {Promise<boolean>} False when the barcode is a product of a different ingredient.
	 */
	async function checkBarcode() {
		problem = '';
		const code = barcode.trim();
		const known = code ? await findProduct(code) : undefined;
		if (!known) return true;

		if (known.ingredientId === ingredient.id) {
			onsave(known);
		} else {
			problem = `This barcode is "${known.name}", a product of a different ingredient.`;
		}
		return false;
	}

	/** A new barcode: the public product database can know the name and the package size. */
	async function barcodeChanged() {
		const code = barcode.trim();
		if (!code || !(await checkBarcode())) return;

		const info = await lookupProduct(code);
		if (info?.name && !name) name = info.name;
		if (info?.quantity && size === null) size = info.quantity;
	}

	/** @param {string} code */
	function scanned(code) {
		if (!scanning) return;
		scanning = false;
		barcode = code;
		barcodeChanged();
	}

	/** @param {SubmitEvent} event */
	async function submit(event) {
		event.preventDefault();
		if (saving) return;
		saving = true;

		if (await checkBarcode()) {
			const photoId = photo ? await savePhoto(photo) : null;
			const product = await saveProduct({
				...blankProduct(ingredient.id, barcode.trim()),
				name: name.trim() || ingredient.name,
				quantity: counted ? (size ?? 0) : 0,
				photoId
			});
			onsave(product);
		}
		saving = false;
	}
</script>

<form class="stack" onsubmit={submit}>
	<PhotoField bind:blob={photo} />

	{#if counted}
		<div class="field field--narrow">
			<label class="field__label" for="{uid}-size">
				Package size ({unitLabel(ingredient.unit)})
			</label>
			<input
				class="field__control"
				id="{uid}-size"
				type="number"
				inputmode="decimal"
				min="0"
				step="any"
				bind:value={size}
				required
			/>
		</div>
	{/if}

	<div class="field">
		<label class="field__label" for="{uid}-name">
			Name <span class="field__hint">(optional)</span>
		</label>
		<input
			class="field__control"
			id="{uid}-name"
			placeholder={ingredient.name}
			autocomplete="off"
			bind:value={name}
		/>
	</div>

	{#if scanning}
		<BarcodeScanner ondetect={scanned} />
	{/if}

	<div class="new-product__barcode">
		<div class="field">
			<label class="field__label" for="{uid}-barcode">
				Barcode <span class="field__hint">(optional)</span>
			</label>
			<input
				class="field__control"
				id="{uid}-barcode"
				inputmode="numeric"
				pattern="[0-9]*"
				autocomplete="off"
				bind:value={barcode}
				onchange={barcodeChanged}
			/>
		</div>
		<button class="button new-product__scan" type="button" onclick={() => (scanning = !scanning)}>
			<Icon name="scan" />
			{scanning ? 'Stop' : 'Scan'}
		</button>
	</div>

	{#if problem}
		<p class="card card--notice" role="alert">{problem}</p>
	{/if}

	<div class="cluster">
		<button class="button button--primary" type="submit" disabled={saving}>Save</button>
		<button class="button" type="button" onclick={oncancel}>Cancel</button>
	</div>
</form>

<style>
	.new-product__barcode {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: end;
		gap: var(--space-2);
	}

	.new-product__scan {
		gap: var(--space-2);
	}
</style>
