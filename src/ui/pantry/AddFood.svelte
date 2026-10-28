<script lang="ts" module>
	import type { ScannedBrand } from '../../kitchen/brand-actions';

	// What one "Add" writes: the packages of one food item, and the barcode of a scan.
	export type Added = { name: string; size: string; place: string; count: number; scan: ScannedBrand | null };
</script>

<script lang="ts">
	import { tick } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import type { FoodNote } from '../../note';
	import { foodOfBarcode, proposedFoods, type Product } from '../../pantry/product';
	import { isFound } from '../../pantry/views';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import Field from '../parts/Field.svelte';
	import Panel from '../parts/Panel.svelte';
	import { barcodeReader, type ReadBarcode } from './barcode-reader';
	import Scanner from './Scanner.svelte';
	import SizeField from './SizeField.svelte';

	// "Add to pantry" is for a full shelf: it stays open until "Done". It opens on the scan when the
	// device can read barcodes. Without a camera, or when the scan does not work, you type the
	// digits of the barcode, or the name. A new food asks for its package size. The last step has
	// the place and a count, and "Add" writes one full row for each package. Then the form starts
	// again at the scan (or the name), with the same place.
	type Props = {
		foods: FoodNote[];
		places: string[];
		startName: string;
		startPlace: string;
		// The size of the next package of a known food in a place, or null when it has no size.
		sizeOf: (food: FoodNote, place: string) => string | null;
		// Null when the setting "Look up barcodes online" is off.
		lookUp: ((barcode: string) => Promise<Product | null>) | null;
		onadd: (added: Added) => Promise<boolean>;
		ondone: () => void;
	};
	let { foods, places, startName, startPlace, sizeOf, lookUp, onadd, ondone }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 150);
	const COUNTS = [1, 2, 3, 4, 6, 12];
	// The browser tells which codes it reads only after a moment, so the scan comes then. If the
	// form is still empty by then, and it did not start from a name, it turns to the scan.
	let read = $state<ReadBarcode | null>(null);
	void barcodeReader().then((reader) => {
		read = reader;
		if (reader && !startName.trim() && !text && !barcode && !product && step === 'name') step = 'scan';
	});

	const first = () => ({ name: startName, place: startPlace });
	let name = $state(first().name);
	let step = $state<'name' | 'scan' | 'type-code' | 'looking' | 'size' | 'last'>('name');
	let size = $state('');
	let place = $state(first().place);
	let count = $state(1);
	let countText = $state('');
	// The barcode of the last scan, and its product when the database knows it.
	let barcode = $state<string | null>(null);
	let product = $state<Product | null>(null);
	// The digits in the barcode field of the name step, and in the step where the code is typed.
	// A code is 8 to 14 digits: EAN-8, UPC-A, EAN-13 and GTIN-14.
	let draft = $state('');
	let typed = $state('');
	// What the last "Add" wrote, or why a scan found nothing.
	let told = $state('');
	let saving = $state(false);
	let nameField = $state<HTMLInputElement>();

	const text = $derived(name.trim());
	const validCode = (code: string) => /^\d{8,14}$/.test(code);
	const digits = (value: string) => value.replace(/\D/g, '');
	const proposed = $derived(product ? proposedFoods(product, foods) : []);
	const found = $derived(
		text
			? foods
					.filter((food) => isFound(food, text) && !proposed.includes(food))
					.sort((a, b) => a.item.name.localeCompare(b.item.name))
			: []
	);

	function toLast(foodName: string, start: string | null) {
		name = foodName;
		size = product?.size ?? start ?? '';
		count = 1;
		countText = '';
		told = '';
		step = size ? 'last' : 'size';
	}

	const pick = (food: FoodNote) => toLast(food.item.name, sizeOf(food, place));

	async function onread(code: string | null) {
		step = 'name';
		if (!code) {
			told = 'No barcode in the photo.';
			return;
		}
		barcode = code;
		draft = code;
		typed = '';
		product = null;
		const known = foodOfBarcode(foods, code);
		if (known) return pick(known);
		if (lookUp) {
			step = 'looking';
			product = await lookUp(code);
			step = 'name';
		}
		if (product) {
			name = product.newName;
			told = '';
		} else told = 'No product for this barcode.';
	}

	function setCount(next: string) {
		countText = next;
		const typed = Number(next);
		if (Number.isInteger(typed) && typed >= 1 && typed <= 99) count = typed;
	}

	async function add() {
		if (saving) return;
		saving = true;
		const scan = barcode ? { barcode, brand: product?.brand ?? '', photo: product?.photo ?? null } : null;
		const done = await onadd({ name: text, size, place, count, scan });
		saving = false;
		if (!done) return;
		told = `Added ${count} × ${text}`;
		startAgain();
		await tick();
		if (step === 'name') nameField?.focus();
	}

	function lookUpTyped(event: SubmitEvent) {
		event.preventDefault();
		if (validCode(typed)) void onread(typed);
	}

	// A new digit string in the barcode field of the name step takes the place of the old code.
	function lookUpDraft(event: SubmitEvent) {
		event.preventDefault();
		if (validCode(draft) && draft !== barcode) void onread(draft);
	}

	const typeCode = () => ((told = ''), (typed = ''), (step = 'type-code'));

	function startAgain() {
		name = '';
		size = '';
		barcode = null;
		product = null;
		draft = '';
		typed = '';
		step = read ? 'scan' : 'name';
	}
</script>

<Panel kind="form">
	<div class="wfd-add">
		<div class="wfd-add__top">
			<h3 class="wfd-add__title wfd-display">Add to pantry</h3>
			{#if step === 'scan' || step === 'name'}
				<Button kind="link" onclick={ondone}>Done</Button>
			{:else if step === 'type-code'}
				<Button kind="link" onclick={() => (step = read ? 'scan' : 'name')}>Cancel</Button>
			{:else if step !== 'looking'}
				<Button kind="link" onclick={() => (step = 'name')}>Cancel</Button>
			{/if}
		</div>

		{#if told}
			{#key told}
				<p class="wfd-add__told" aria-live="polite" in:fade={{ duration }}>{told}</p>
			{/key}
		{/if}

		{#if step === 'scan' && read}
			<Scanner {read} {onread} ontype={typeCode} oncancel={() => (step = 'name')} />
		{:else if step === 'type-code'}
			<form class="wfd-add__code" onsubmit={lookUpTyped}>
				<Field label="Barcode">
					<!-- svelte-ignore a11y_autofocus -->
					<input
						type="text"
						autofocus
						inputmode="numeric"
						autocomplete="off"
						enterkeyhint="search"
						value={typed}
						oninput={(event) => (typed = digits(event.currentTarget.value))}
					/>
				</Field>
				<Button kind="main" type="submit" disabled={!validCode(typed)}>Look up</Button>
			</form>
		{:else if step === 'looking'}
			<p class="wfd-add__what" aria-live="polite">Looking up…</p>
		{:else if step === 'name'}
			{#if product}
				<div class="wfd-add__product" in:fade={{ duration }}>
					{#if product.photo}
						<img class="wfd-add__photo" src={product.photo} alt="" />
					{/if}
					<div>
						<p class="wfd-add__what">{product.name}</p>
						<p class="wfd-add__facts">
							{[product.brand, product.size].filter(Boolean).join(' · ')}
						</p>
					</div>
				</div>
			{/if}
			{#if barcode}
				<!-- The keeper can overwrite a bad scan, and look the new code up. -->
				<form class="wfd-add__name" onsubmit={lookUpDraft}>
					<Field label="Barcode">
						<input
							type="text"
							inputmode="numeric"
							autocomplete="off"
							enterkeyhint="search"
							value={draft}
							oninput={(event) => (draft = digits(event.currentTarget.value))}
						/>
					</Field>
					<Button type="submit" disabled={!validCode(draft) || draft === barcode}>Look up</Button>
				</form>
			{/if}
			<div class="wfd-add__name">
				<Field label="Name">
					<!-- svelte-ignore a11y_autofocus -->
					<input type="text" autofocus enterkeyhint="search" bind:value={name} bind:this={nameField} />
				</Field>
				{#if read}
					<Button onclick={() => ((told = ''), (step = 'scan'))}>Scan</Button>
				{/if}
			</div>
			{#if !barcode}
				<div class="wfd-add__ways">
					<Button kind="link" onclick={typeCode}>Type barcode</Button>
				</div>
			{/if}
			{#if text || proposed.length}
				<ul class="wfd-add__list" in:fade={{ duration }}>
					{#each proposed as food (food.path)}
						<li>
							<button class="wfd-add__proposed" type="button" onclick={() => pick(food)}>
								{food.item.name}
							</button>
						</li>
					{/each}
					{#each found as food (food.path)}
						<li>
							<button type="button" onclick={() => pick(food)}>{food.item.name}</button>
						</li>
					{/each}
					{#if text}
						<li>
							<button class="wfd-add__new" type="button" onclick={() => toLast(text, null)}>
								New: {text}
							</button>
						</li>
					{/if}
				</ul>
			{/if}
		{:else if step === 'size'}
			<p class="wfd-add__what">{text}</p>
			<SizeField value={size} onchange={(next) => (size = next)} />
			<Button kind="main" disabled={!size} onclick={() => (step = 'last')}>Next</Button>
		{:else}
			<p class="wfd-add__what">{text} · {size}</p>
			<div class="wfd-add__chips" role="group" aria-label="Place">
				{#each places as option (option)}
					<Chip label={option} on={place === option} onclick={() => (place = option)} />
				{/each}
			</div>
			<div class="wfd-add__chips" role="group" aria-label="Packages">
				{#each COUNTS as option (option)}
					<Chip
						label={String(option)}
						on={count === option && !countText}
						onclick={() => ((count = option), (countText = ''))}
					/>
				{/each}
				<div class="wfd-add__count">
					<Field kind="number">
						<input
							type="text"
							inputmode="numeric"
							placeholder="More"
							aria-label="Number of packages"
							value={countText}
							oninput={(event) => setCount(event.currentTarget.value)}
						/>
					</Field>
				</div>
			</div>
			<Button kind="main" disabled={!place || saving} onclick={add}>
				Add {count > 1 ? `${count} packages` : ''}
			</Button>
		{/if}
	</div>
</Panel>

<style>
	.wfd-add {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-stack);
	}

	.wfd-add__top {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: center;
		justify-content: space-between;
	}

	.wfd-add__title {
		margin: 0;
		font-size: var(--wfd-font-size-title);
	}

	.wfd-add__told {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}

	/* A field and its button share one row, so the field stays at the top. */
	.wfd-add__name,
	.wfd-add__code {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: var(--wfd-space-group);
		align-items: end;
	}

	.wfd-add__ways {
		display: flex;
	}

	.wfd-add__product {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: var(--wfd-space-stack);
		align-items: center;
	}

	.wfd-add__photo {
		inline-size: var(--wfd-control);
		block-size: var(--wfd-control);
		object-fit: contain;
		border-radius: var(--wfd-radius-sticker);
		background: var(--wfd-color-control);
	}

	.wfd-add__facts {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}

	/* A long list scrolls in its own box, so that the field stays in view. */
	.wfd-add__list {
		display: grid;
		max-block-size: 40vh;
		margin: 0;
		padding: 0;
		overflow-y: auto;
		list-style: none;

		& button {
			inline-size: 100%;
			block-size: auto;
			min-block-size: var(--wfd-control);
			padding: 0 var(--wfd-space-tight);
			border: 0;
			border-block-end: var(--wfd-border-thin) solid var(--wfd-color-border);
			border-radius: 0;
			background: none;
			box-shadow: none;
			color: var(--wfd-color-text);
			font-family: inherit;
			font-size: var(--wfd-font-size-text);
			text-align: start;
			cursor: pointer;
		}
	}

	button.wfd-add__new,
	button.wfd-add__proposed {
		font-weight: 700;
	}

	.wfd-add__what {
		margin: 0;
		font-size: var(--wfd-font-size-name);
		font-weight: 600;
	}

	.wfd-add__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--wfd-space-group);
		align-items: center;
	}

	.wfd-add__count {
		inline-size: calc(2 * var(--wfd-control));
	}
</style>
