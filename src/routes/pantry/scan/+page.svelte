<script>
	import { resolve } from '$app/paths';
	import BarcodeEntryForm from '$lib/components/pantry/BarcodeEntryForm.svelte';
	import BarcodeScanner from '$lib/components/pantry/BarcodeScanner.svelte';
	import KnownProductCard from '$lib/components/pantry/KnownProductCard.svelte';
	import ProductForm from '$lib/components/pantry/ProductForm.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import SegmentedControl from '$lib/components/ui/SegmentedControl.svelte';
	import { stock } from '$lib/data/pantry';
	import { blankProduct, findProduct, lookupProduct } from '$lib/data/products';
	import { db } from '$lib/db/db';
	import { useKitchen } from '$lib/kitchen.svelte';
	import { status } from '$lib/status.svelte';

	/** @typedef {import('$lib/data/products').ProductDraft} ProductDraft */

	const CAUSES = [
		{ value: 'bought', label: 'New purchase' },
		{ value: 'corrected', label: 'Already at home' }
	];

	const kitchen = useKitchen();

	/** @type {'scan' | 'searching' | 'known' | 'form'} */
	let step = $state('scan');
	/** @type {ProductDraft} */
	let draft = $state.raw(blankProduct(''));
	let cause = $state('bought');

	/** @param {string} barcode */
	async function found(barcode) {
		if (step !== 'scan') return;
		step = 'searching';

		const known = await findProduct(barcode);
		if (known) {
			draft = known;
			step = 'known';
			return;
		}

		const info = await lookupProduct(barcode);
		draft = { ...blankProduct('', barcode), name: info?.name ?? '', quantity: info?.quantity ?? 0 };
		step = 'form';
	}

	/** @param {ProductDraft} product */
	async function add(product) {
		const ingredient = await db.ingredients.get(product.ingredientId);
		if (!ingredient) return;
		await stock(ingredient, product.quantity, cause === 'bought' ? 'bought' : 'corrected');
		status.say(`${ingredient.name} is added to the pantry.`);
		step = 'scan';
	}
</script>

<PageHeader title="Scan">
	<a class="button" href={resolve('/pantry')}>Pantry</a>
</PageHeader>

<SegmentedControl legend="This item is" options={CAUSES} bind:value={cause} />

{#if step === 'scan'}
	<BarcodeScanner ondetect={found} />
	<BarcodeEntryForm onsubmit={found} />
{:else if step === 'searching'}
	<p role="status">Looking for the product…</p>
{:else if step === 'known'}
	<KnownProductCard
		product={draft}
		ingredient={kitchen.ingredientsById.get(draft.ingredientId)}
		onadd={() => add(draft)}
		onedit={() => (step = 'form')}
		oncancel={() => (step = 'scan')}
	/>
{:else}
	<div class="stack">
		<h2>New product</h2>
		{#if !draft.name}
			<p class="muted">
				The product database has no data for this barcode, or there is no connection. Type the data
				one time. The next scan of this product needs one tap.
			</p>
		{/if}
		<ProductForm
			product={draft}
			ingredients={kitchen.ingredients}
			onsave={add}
			oncancel={() => (step = 'scan')}
		/>
	</div>
{/if}
