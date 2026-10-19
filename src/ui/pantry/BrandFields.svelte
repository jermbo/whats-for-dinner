<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import type { BrandDraft } from '../../kitchen/brand-actions';
	import type { Brand } from '../../pantry/brands';
	import BrandPhoto from '../parts/BrandPhoto.svelte';
	import BrandStrip from '../parts/BrandStrip.svelte';
	import Chip from '../parts/Chip.svelte';
	import type { Verdict } from '../../pantry/brands';

	type Props = {
		// The brands of the note, as the form opened.
		brands: Brand[];
		// The brands of the form. "Save" writes them, and "Cancel" forgets them.
		drafts: BrandDraft[];
		urlOf: (photo: string) => string | null;
		// The name of the food item, for a screen reader.
		of: string;
	};
	let { brands, drafts = $bindable(), urlOf, of }: Props = $props();

	const uid = $props.id();

	// A photo from the camera is not a file of the vault yet, so the screen gets an address for it.
	const addresses = new Map<Blob, string>();
	function addressOf(photo: Blob) {
		const known = addresses.get(photo);
		if (known) return known;
		const url = URL.createObjectURL(photo);
		addresses.set(photo, url);
		return url;
	}
	onDestroy(() => addresses.forEach((url) => URL.revokeObjectURL(url)));

	function urlOfDraft(draft: BrandDraft) {
		if (draft.photo) return addressOf(draft.photo);
		const photo = draft.at === null ? undefined : brands[draft.at]?.photos[0];
		return photo ? urlOf(photo) : null;
	}

	// The number of each draft that shows: a brand that you removed does not.
	const shown = $derived(drafts.flatMap((draft, at) => (draft.removed ? [] : [at])));
	const tiles = $derived(
		shown.map((at) => ({
			key: String(at),
			name: drafts[at].name.trim(),
			verdict: drafts[at].verdict,
			url: urlOfDraft(drafts[at])
		}))
	);

	// The number of the draft that shows large with its fields, and the small photo that it grows
	// from.
	let open = $state<{ at: number; from: HTMLElement | null } | null>(null);
	const draft = $derived(open ? drafts[open.at] : undefined);
	let strip = $state<HTMLElement>();

	function photoFrom(event: Event): Blob | null {
		const field = event.currentTarget as HTMLInputElement;
		const photo = field.files?.[0] ?? null;
		field.value = '';
		return photo;
	}

	// A photo is a new brand with no name. Its fields open at once, so that you can give it a name.
	async function add(event: Event) {
		const photo = photoFrom(event);
		if (!photo) return;
		drafts = [
			...drafts,
			{ at: null, start: '', name: '', startVerdict: null, verdict: null, photo, removed: false }
		];
		await tick();
		const last = strip?.querySelectorAll('.wfd-brands > button');
		open = { at: drafts.length - 1, from: (last?.[last.length - 1] as HTMLElement) ?? null };
	}

	function change(fields: Partial<BrandDraft>) {
		const at = open?.at;
		drafts = drafts.map((one, index) => (index === at ? { ...one, ...fields } : one));
	}

	// A tap on the verdict that is on puts it off.
	function judge(verdict: Verdict) {
		change({ verdict: draft?.verdict === verdict ? null : verdict });
	}

	const verdicts: { value: Verdict; label: string }[] = [
		{ value: 'buy again', label: 'Buy again' },
		{ value: 'avoid', label: 'Avoid' }
	];

	function newPhoto(event: Event) {
		const photo = photoFrom(event);
		if (photo) change({ photo });
	}

	function remove() {
		change({ removed: true });
		open = null;
	}

	// The field is in the form of the food item, so the key Enter would save the form.
	function enter(event: KeyboardEvent) {
		if (event.key !== 'Enter') return;
		event.preventDefault();
		open = null;
	}
</script>

<fieldset class="wfd-brand-fields">
	<legend class="wfd-label">Brands</legend>
	<div class="wfd-brand-fields__row" bind:this={strip}>
		{#if tiles.length}
			<BrandStrip
				brands={tiles}
				{of}
				ontap={(at, from) => (open = { at: shown[at], from })}
			/>
		{/if}
		<label class="wfd-brand-fields__add" for="{uid}-add">
			Add brand
			<input
				id="{uid}-add"
				class="wfd-brand-fields__hidden"
				type="file"
				accept="image/*"
				capture="environment"
				onchange={add}
			/>
		</label>
	</div>
</fieldset>

{#if open && draft}
	<BrandPhoto
		url={urlOfDraft(draft)}
		name={draft.name.trim()}
		from={open.from}
		onclose={() => (open = null)}
	>
		<label class="wfd-brand-fields__name">
			<span class="wfd-label">Name</span>
			<input
				type="text"
				placeholder="Optional"
				enterkeyhint="done"
				value={draft.name}
				oninput={(event) => change({ name: event.currentTarget.value })}
				onkeydown={enter}
			/>
		</label>
		<div class="wfd-brand-fields__verdict" role="group" aria-labelledby="{uid}-verdict">
			<span class="wfd-label" id="{uid}-verdict">Verdict</span>
			<div class="wfd-brand-fields__chips">
				{#each verdicts as option (option.value)}
					<Chip
						label={option.label}
						on={draft.verdict === option.value}
						onclick={() => judge(option.value)}
					/>
				{/each}
			</div>
		</div>
		<div class="wfd-brand-fields__actions">
			<label class="wfd-brand-fields__photo" for="{uid}-photo">
				New photo
				<input
					id="{uid}-photo"
					class="wfd-brand-fields__hidden"
					type="file"
					accept="image/*"
					capture="environment"
					onchange={newPhoto}
				/>
			</label>
			<button class="wfd-brand-fields__remove" type="button" onclick={remove}>Remove</button>
		</div>
	</BrandPhoto>
{/if}

<style>
	.wfd-brand-fields {
		display: grid;
		gap: 6px;
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
		color: var(--wfd-ink-2);
	}

	.wfd-brand-fields__verdict {
		display: grid;
		gap: 4px;
		color: var(--wfd-ink-2);
	}

	.wfd-brand-fields__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0 8px;
	}

	.wfd-brand-fields__row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
	}

	/* The labels are the buttons of the camera. The file field of the browser is hidden. */
	.wfd-brand-fields__add,
	.wfd-brand-fields__photo,
	button.wfd-brand-fields__remove {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		block-size: auto;
		min-block-size: 48px;
		padding: 0 16px;
		border: 2px solid var(--wfd-ink);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-quiet);
		box-shadow: none;
		color: var(--wfd-ink);
		font-family: inherit;
		font-size: 16px;
		font-weight: 700;
		cursor: pointer;

		&:focus-within,
		&:focus-visible {
			outline: 2px solid var(--wfd-ink);
			outline-offset: 2px;
		}
	}

	.wfd-brand-fields__add {
		border-style: dashed;
	}

	button.wfd-brand-fields__remove {
		border-color: var(--wfd-tomato);
		color: var(--wfd-tomato);
	}

	.wfd-brand-fields__hidden {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}

	.wfd-brand-fields__name {
		display: grid;
		gap: 6px;
		color: var(--wfd-ink-2);

		& input {
			inline-size: 100%;
		}
	}

	.wfd-brand-fields__actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
</style>
