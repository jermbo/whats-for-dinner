<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import type { BrandDraft } from '../../kitchen/brand-actions';
	import type { Stock } from '../../pantry/types';
	import { entryOf, refusal } from '../../pantry/unit-list';
	import { STAPLES } from '../../setup/starts';
	import Button from '../parts/Button.svelte';
	import Field from '../parts/Field.svelte';
	import StockEditor from '../pantry/StockEditor.svelte';
	import HiddenName from '../parts/HiddenName.svelte';
	import StepFrame from './StepFrame.svelte';

	let { kitchen }: { kitchen: Kitchen } = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	// The staples that you tapped, each with the amount that you typed.
	const picked = new SvelteMap<string, string>();
	let adding = $state(false);

	const names = $derived(kitchen.foods.map(({ item }) => item.name).sort());
	const given = $derived([...picked.values()].some((amount) => amount.trim()));
	// An amount such as "1 jar" stops "Finish setup", and its field says why.
	const isRefused = (amount: string) => entryOf(amount) === null;
	const refused = $derived([...picked.values()].some(isRefused));
	const ready = $derived(!refused && (given || kitchen.foods.length > 0));

	function toggle(name: string) {
		if (picked.has(name)) picked.delete(name);
		else picked.set(name, '');
	}

	// The note of the food item comes from the row, so its brands go after it.
	async function add(name: string, stock: Stock, brands: BrandDraft[]) {
		adding = false;
		if (!(await kitchen.pantry.addStock(name, stock))) return;
		if (brands.length) await kitchen.brands.saveBrands(name, brands);
	}

	const uid = $props.id();
</script>

<StepFrame
	title="First food"
	at={4}
	{ready}
	action="Finish setup"
	oncontinue={() => kitchen.setup.finishSetup(picked)}
>
	<p class="wfd-food__note">
		Tap what you have, and type how much. Staples go to "{kitchen.settings.newPlace}".
	</p>

	<HiddenName id="{uid}-staples" text="Staples" />
	<ul class="wfd-food" aria-labelledby="{uid}-staples">
		{#each STAPLES as name (name)}
			{@const on = picked.has(name)}
			<li class="wfd-food__row" class:wfd-food__row--on={on}>
				<button class="wfd-food__staple" type="button" aria-pressed={on} onclick={() => toggle(name)}>
					<span class="wfd-food__tick" aria-hidden="true">{on ? '✓' : ''}</span>
					<span class="wfd-display">{name}</span>
				</button>
				{#if on}
					<div class="wfd-food__amount" transition:slide={{ axis: 'x', duration }}>
						<Field>
							<input
								type="text"
								aria-label="How much {name}"
								placeholder="No amount"
								aria-invalid={isRefused(picked.get(name) ?? '')}
								value={picked.get(name)}
								oninput={(event) => picked.set(name, event.currentTarget.value)}
							/>
						</Field>
					</div>
				{/if}
			</li>
		{/each}
	</ul>
	{#if refused}
		<p class="wfd-food__refused" role="alert" transition:slide={{ duration }}>
			{refusal}
		</p>
	{/if}

	{#if adding}
		<div transition:slide={{ duration }}>
			<StockEditor
				title="Add to pantry"
				{names}
				places={kitchen.places}
				startPlace={kitchen.settings.newPlace}
				onsave={(stock, name, _, brands) => add(name, stock, brands)}
				oncancel={() => (adding = false)}
			/>
		</div>
	{:else}
		<Button onclick={() => (adding = true)}>Add other food</Button>
	{/if}

	{#if names.length}
		<p class="wfd-food__note" aria-live="polite">In the pantry: {names.join(', ')}</p>
	{/if}
</StepFrame>

<style>
	.wfd-food__refused {
		margin: 0;
		color: var(--wfd-color-danger);
		font-size: var(--wfd-font-size-small);
	}

	.wfd-food__note {
		margin: 0;
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
	}

	.wfd-food {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
		gap: var(--wfd-space-group);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-food__row {
		display: flex;
		gap: var(--wfd-space-group);
		align-items: center;
		min-block-size: var(--wfd-control);
		padding-inline-end: var(--wfd-space-tight);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-surface);
		transition: border-color var(--wfd-motion-change) var(--wfd-ease-out);
	}

	.wfd-food__row--on {
		border-color: var(--wfd-color-border);
	}

	button.wfd-food__staple {
		display: flex;
		flex: 1 1 auto;
		gap: var(--wfd-space-stack);
		align-items: center;
		block-size: auto;
		min-block-size: var(--wfd-control-min);
		padding: 0 var(--wfd-space-inset);
		border: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		font-size: var(--wfd-font-size-text);
		text-align: start;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: -2px;
		}
	}

	/* The box of a staple: empty, or ink with a tick. */
	.wfd-food__tick {
		display: grid;
		flex: none;
		place-items: center;
		inline-size: 24px;
		block-size: 24px;
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-sticker);
		color: var(--wfd-color-on-selected);
		font-size: var(--wfd-font-size-small);
		transition: background-color var(--wfd-chip-motion);
	}

	.wfd-food__row--on .wfd-food__tick {
		background: var(--wfd-color-selected);
	}

	.wfd-food__amount {
		flex: 0 1 7.5rem;
		min-inline-size: 0;
	}
</style>
