<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { BrandDraft } from '../../kitchen/brand-actions';
	import type { Brand } from '../../pantry/brands';
	import { makeStock } from '../../pantry/food-item';
	import { KINDS, showKind, type StapleLabel } from '../../pantry/staple';
	import type { Stock } from '../../pantry/types';
	import { entryOf, refusal } from '../../pantry/unit-list';
	import Button from '../parts/Button.svelte';
	import Field from '../parts/Field.svelte';
	import BrandFields from './BrandFields.svelte';
	import Panel from '../parts/Panel.svelte';

	type Props = {
		title: string;
		// With a list of names, the editor asks for the name of the food item.
		names?: string[];
		// The name that the field starts with, such as the text that found no food.
		startName?: string;
		stock?: Stock;
		// The places that the pantry has. One tap selects a place.
		places: string[];
		// The place that a new row starts with, such as "Place for new food".
		startPlace?: string;
		// The kind of the food item, "never" when the Shop part never asks about it, or null. With no
		// value here, the editor does not ask for it.
		staple?: StapleLabel;
		// Small text below the fields, such as the other names of the food item.
		facts?: string[];
		// The brands of the food item, and the address of a photo for the screen. A new food item
		// has no brand yet.
		brands?: Brand[];
		urlOf?: (photo: string) => string | null;
		onsave: (
			stock: Stock,
			name: string,
			labels: { staple: StapleLabel },
			brands: BrandDraft[]
		) => void;
		oncancel: () => void;
		onusedup?: () => void;
		onopen?: () => void;
	};
	let {
		title,
		names,
		startName = '',
		stock,
		places,
		startPlace = '',
		staple,
		facts = [],
		brands = [],
		urlOf = () => null,
		onsave,
		oncancel,
		onusedup,
		onopen
	}: Props = $props();

	const uid = $props.id();
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	// The fields start with the row as it is. After that, they are yours.
	const first = () => stock;
	const firstName = () => startName;
	const firstPlace = () => first()?.place ?? startPlace;
	const firstKind = (): StapleLabel => staple ?? null;
	let name = $state(firstName());
	let kind = $state(firstKind());
	let amount = $state(first()?.amountText ?? '');
	// The size of the package. Food that is already open needs it, so that its bar ends at the size
	// of the bottle. With no size, the amount is the size.
	let size = $state(first()?.sizeText ?? '');
	let place = $state(firstPlace());
	let useBy = $state(first()?.useBy ?? '');
	// A place that the pantry does not have yet.
	let newPlace = $state('');
	const firstBrands = () => brands;
	let drafts = $state<BrandDraft[]>(
		firstBrands().map((brand, at) => ({
			at,
			start: brand.name,
			name: brand.name,
			startVerdict: brand.verdict,
			verdict: brand.verdict,
			photo: null,
			removed: false
		}))
	);

	const kinds: { value: StapleLabel; label: string }[] = [
		{ value: 'never', label: 'Never ask' },
		{ value: null, label: 'Not a staple' },
		...KINDS.map((value) => ({ value, label: showKind(value) }))
	];

	const where = $derived(newPlace.trim() || place);
	const ready = $derived(Boolean(where) && (!names || Boolean(name.trim())));
	// The amounts as the rows get them, or null for an amount that the vault does not permit.
	const entries = $derived({
		amount: entryOf(amount),
		size: entryOf(size)
	});
	const refused = $derived(Object.values(entries).some((entry) => entry === null));
	// The message waits for "Save", so that "1 j" does not get an error while you type "1 jar".
	let tried = $state(false);

	function save(event: SubmitEvent) {
		event.preventDefault();
		tried = true;
		const { amount, size } = entries;
		if (!ready || amount === null || size === null) return;
		onsave(makeStock(where, amount, useBy, size), name.trim(), { staple: kind }, drafts);
	}
</script>

<Panel kind="form">
	<form class="wfd-editor" onsubmit={save}>
		<div class="wfd-editor__top">
			<h3 class="wfd-editor__title wfd-display">{title}</h3>
			<Button kind="link" onclick={oncancel}>Cancel</Button>
		</div>

		{#if names}
			<Field label="Name">
				<!-- svelte-ignore a11y_autofocus -->
				<input type="text" list="{uid}-names" autofocus bind:value={name} />
				<datalist id="{uid}-names">
					{#each names as option}
						<option value={option}></option>
					{/each}
				</datalist>
			</Field>
		{/if}

		<fieldset class="wfd-editor__field">
			<legend class="wfd-label">Where</legend>
			<div class="wfd-editor__options">
				{#each places as option}
					<button
						class="wfd-editor__option"
						class:wfd-editor__option--on={!newPlace.trim() && place === option}
						type="button"
						aria-pressed={!newPlace.trim() && place === option}
						onclick={() => ((place = option), (newPlace = ''))}
					>
						{option}
					</button>
				{/each}
				<div class="wfd-editor__new">
					<Field kind="new">
						<input type="text" aria-label="A new place" placeholder="A new place" bind:value={newPlace} />
					</Field>
				</div>
			</div>
		</fieldset>

		<div class="wfd-editor__pair">
			<Field label="How much">
				<input
					type="text"
					placeholder="1/2 gal"
					aria-invalid={tried && entries.amount === null}
					bind:value={amount}
				/>
			</Field>
			<Field label="Package size">
				<input
					type="text"
					placeholder={amount || '1 gal'}
					aria-invalid={tried && entries.size === null}
					bind:value={size}
				/>
			</Field>
			<Field label="Use by">
				<input type="date" bind:value={useBy} />
			</Field>
		</div>
		{#if tried && refused}
			<p class="wfd-editor__refused" role="alert" transition:slide={{ duration }}>{refusal}</p>
		{/if}

		{#if staple !== undefined}
			<!--
				How often you buy the food. The plugin asks about each food item that is low, and about a staple
				when its time is over. "Never ask" is for food that you bought for one recipe.
			-->
			<fieldset class="wfd-editor__field">
				<legend class="wfd-label">Staple</legend>
				<div class="wfd-editor__options">
					{#each kinds as option (option.label)}
						<button
							class="wfd-editor__option"
							class:wfd-editor__option--on={kind === option.value}
							type="button"
							aria-pressed={kind === option.value}
							onclick={() => (kind = option.value)}
						>
							{option.label}
						</button>
					{/each}
				</div>
			</fieldset>
		{/if}

		<BrandFields {brands} bind:drafts {urlOf} of={names ? name || title : title} />

		{#if facts.length}
			<p class="wfd-editor__facts">{facts.join(' · ')}</p>
		{/if}

		<div class="wfd-editor__actions">
			{#if onusedup}
				<Button onclick={onusedup}>Used up</Button>
			{/if}
			<Button kind="main" type="submit" disabled={!ready}>Save</Button>
		</div>
		{#if onopen}
			<Button kind="link" onclick={onopen}>Open note</Button>
		{/if}
	</form>
</Panel>

<style>
	.wfd-editor__refused {
		margin: 0;
		color: var(--wfd-color-danger);
		font-size: var(--wfd-font-size-small);
	}

	.wfd-editor {
		display: grid;
		gap: var(--wfd-space-section);
	}

	.wfd-editor__top {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: center;
		justify-content: space-between;
		border-block-end: var(--wfd-border) solid var(--wfd-color-border);
	}

	.wfd-editor__title {
		margin: 0;
		color: var(--wfd-color-text);
		font-size: var(--wfd-font-size-title);
	}

	.wfd-editor__field {
		display: grid;
		gap: var(--wfd-space-group);
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
		color: var(--wfd-color-text-muted);
	}

	.wfd-editor__options {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group);
	}

	button.wfd-editor__option {
		block-size: auto;
		min-block-size: var(--wfd-control);
		padding: 0 var(--wfd-space-inset);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-control);
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		font-size: var(--wfd-font-size-text);
		font-weight: 600;
		cursor: pointer;
		transition:
			background-color var(--wfd-chip-motion),
			color var(--wfd-chip-motion);

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	button.wfd-editor__option--on {
		border-color: var(--wfd-color-selected);
		background: var(--wfd-color-selected);
		color: var(--wfd-color-on-selected);
	}

	.wfd-editor__new {
		flex: 1 1 10rem;
	}

	.wfd-editor__pair {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 9rem), 1fr));
		gap: var(--wfd-space-stack);
	}

	.wfd-editor__facts {
		margin: 0;
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
	}

	.wfd-editor__actions {
		display: grid;
		grid-auto-columns: 1fr;
		grid-auto-flow: column;
		gap: var(--wfd-space-stack);
	}
</style>
