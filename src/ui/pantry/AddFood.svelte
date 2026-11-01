<script lang="ts" module>
	import type { ScannedBrand } from '../../kitchen/brand-actions';
	import type { Product } from '../../pantry/product';

	// What one add writes: the packages of one food item, with their date, and the barcode of a scan.
	export type Added = {
		name: string;
		size: string;
		place: string;
		count: number;
		useBy: string;
		scan: ScannedBrand | null;
	};

	// Each barcode that the form added, until Obsidian starts again. A second scan of that can
	// needs no lookup, also before the queue wrote its brand into the note.
	const scanned = new Map<string, { name: string; size: string; product: Product | null }>();
</script>

<script lang="ts">
	import { tick } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { showDate } from '../../dates';
	import type { FoodNote } from '../../note';
	import { newestPlace } from '../../pantry/card';
	import { foodOfBarcode, proposedFoods } from '../../pantry/product';
	import { isFound } from '../../pantry/views';
	import Button from '../parts/Button.svelte';
	import Field from '../parts/Field.svelte';
	import Panel from '../parts/Panel.svelte';
	import { barcodeReader, type ReadBarcode } from './barcode-reader';
	import PackageFacts from './PackageFacts.svelte';
	import Scanner from './Scanner.svelte';
	import SizeField from './SizeField.svelte';
	import UseByCorrect from './UseByCorrect.svelte';

	// "Add to pantry" is for a full shelf: it stays open until "Done". It opens on the scan when the
	// device can read barcodes. Without a camera, or when the scan does not work, you type the
	// digits of the barcode, or the name. The last step fills in each fact of the package, and asks
	// only for the use-by date: "Correct" writes one full row for each package. Then the
	// form starts again at the scan (or the name) at once, and the writes go on behind it.
	type Props = {
		foods: FoodNote[];
		places: string[];
		startName: string;
		startPlace: string;
		// The size of the next package of a known food in a place, or null when it has no size.
		sizeOf: (food: FoodNote, place: string) => string | null;
		// Null when the setting "Look up barcodes online" is off.
		lookUp: ((barcode: string) => Promise<Product | null>) | null;
		onadd: (added: Added) => void;
		ondone: () => void;
	};
	let { foods, places, startName, startPlace, sizeOf, lookUp, onadd, ondone }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 150);
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
	// The place of the last step, and the place of the last add, which a new food item gets.
	let place = $state(first().place);
	let lastPlace = $state(first().place);
	let count = $state(1);
	// The barcode of the last scan, and its product when the database knows it.
	let barcode = $state<string | null>(null);
	let product = $state<Product | null>(null);
	// The barcode and the date of the last add. A second can of the same row gets "Same date".
	let lastAdd = $state<{ barcode: string | null; useBy: string } | null>(null);
	// The digits in the barcode field of the name step, and in the step where the code is typed.
	// A code is 8 to 14 digits: EAN-8, UPC-A, EAN-13 and GTIN-14.
	let draft = $state('');
	let typed = $state('');
	// What the last add wrote, or why a scan found nothing.
	let told = $state('');
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
	const isNew = $derived(!foods.some((food) => food.item.name.toLowerCase() === text.toLowerCase()));
	const same = $derived(
		barcode && lastAdd?.useBy && lastAdd.barcode === barcode ? lastAdd.useBy : null
	);

	// The last step, with each fact filled in. A known food goes to the place of its newest
	// package; a new one goes where the last add went.
	function toLast(foodName: string, food: FoodNote | null, start: string | null = null) {
		name = foodName;
		place = (food && newestPlace(food.item)) || lastPlace;
		size = product?.size ?? start ?? (food && sizeOf(food, place)) ?? '';
		count = 1;
		told = '';
		step = size ? 'last' : 'size';
	}

	const pick = (food: FoodNote) => toLast(food.item.name, food);

	// A photo with no code stays on the scan, which opens the camera again.
	async function onread(code: string | null) {
		if (!code) {
			told = 'No barcode in the photo.';
			return;
		}
		told = '';
		step = 'name';
		barcode = code;
		draft = code;
		typed = '';
		product = null;
		const again = scanned.get(code);
		if (again) {
			product = again.product;
			return toLast(again.name, foods.find((food) => food.item.name === again.name) ?? null, again.size);
		}
		const known = foodOfBarcode(foods, code);
		if (known) return pick(known);
		if (lookUp) {
			step = 'looking';
			product = await lookUp(code);
			step = 'name';
		}
		if (!product) {
			told = 'No product for this barcode.';
			return;
		}
		const [match] = proposedFoods(product, foods);
		if (match) pick(match);
		else toLast(product.newName, null);
	}

	// The form does not wait for the note: the next can matters more than this one.
	async function add(useBy: string) {
		if (!place) return;
		const scan = barcode ? { barcode, brand: product?.brand ?? '', photo: product?.photo ?? null } : null;
		onadd({ name: text, size, place, count, useBy, scan });
		if (barcode) scanned.set(barcode, { name: text, size, product });
		told = `Added ${count} × ${text}${useBy ? ` · ${showDate(useBy)}` : ''}`;
		lastAdd = { barcode, useBy };
		lastPlace = place;
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
	const cancel = () => ((told = ''), startAgain());

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
				<Button kind="link" onclick={cancel}>Cancel</Button>
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
			<!-- The screen of the date: the facts are small at the top, because you only check them. -->
			<div class="wfd-add__last" in:fade={{ duration }}>
				<div class="wfd-add__head">
					{#if product?.photo}
						<img class="wfd-add__photo" src={product.photo} alt="" />
					{/if}
					<PackageFacts
						name={text}
						{isNew}
						{size}
						{place}
						{places}
						{count}
						onname={() => (step = 'name')}
						onsize={() => (step = 'size')}
						onplace={(next) => (place = next)}
						oncount={(next) => (count = next)}
					/>
				</div>
				<UseByCorrect {same} busy={!place} oncorrect={add} />
			</div>
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

	.wfd-add__last {
		display: grid;
		gap: var(--wfd-space-stack);
	}

	.wfd-add__head {
		display: flex;
		gap: var(--wfd-space-group);
		align-items: start;
	}
</style>
