<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import type { BrandDraft } from '../../kitchen/brand-actions';
	import type { Stock } from '../../pantry/types';
	import { STAPLES } from '../../setup/starts';
	import Button from '../parts/Button.svelte';
	import StockEditor from '../pantry/StockEditor.svelte';
	import StepFrame from './StepFrame.svelte';

	let { kitchen }: { kitchen: Kitchen } = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	// The staples that you tapped, each with the amount that you typed.
	const picked = new SvelteMap<string, string>();
	let adding = $state(false);

	const names = $derived(kitchen.foods.map(({ item }) => item.name).sort());
	const given = $derived([...picked.values()].some((amount) => amount.trim()));
	const ready = $derived(given || kitchen.foods.length > 0);

	function toggle(name: string) {
		if (picked.has(name)) picked.delete(name);
		else picked.set(name, '');
	}

	// The note of the food item comes from the row, so its brands go after it.
	async function add(name: string, stock: Stock, brands: BrandDraft[]) {
		adding = false;
		await kitchen.addStock(name, stock);
		if (brands.length) await kitchen.saveBrands(name, brands);
	}
</script>

<StepFrame
	title="First food"
	at={4}
	{ready}
	action="Finish setup"
	oncontinue={() => kitchen.finishSetup(picked)}
>
	<p class="wfd-food__note">
		Tap what you have, and type how much. Staples go to "{kitchen.settings.newPlace}".
	</p>

	<ul class="wfd-food" aria-label="Staples">
		{#each STAPLES as name (name)}
			{@const on = picked.has(name)}
			<li class="wfd-food__row" class:wfd-food__row--on={on}>
				<button class="wfd-food__staple" type="button" aria-pressed={on} onclick={() => toggle(name)}>
					<span class="wfd-food__tick" aria-hidden="true">{on ? '✓' : ''}</span>
					<span class="wfd-display">{name}</span>
				</button>
				{#if on}
					<input
						class="wfd-food__amount"
						type="text"
						aria-label="How much {name}"
						placeholder="No amount"
						value={picked.get(name)}
						oninput={(event) => picked.set(name, event.currentTarget.value)}
						transition:slide={{ axis: 'x', duration }}
					/>
				{/if}
			</li>
		{/each}
	</ul>

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
	.wfd-food__note {
		margin: 0;
		color: var(--wfd-ink-2);
		font-size: 14px;
	}

	.wfd-food {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-food__row {
		display: flex;
		gap: 8px;
		align-items: center;
		min-block-size: 50px;
		padding-inline-end: 6px;
		border: 2px solid var(--wfd-line);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-card);
		transition: border-color 0.15s ease-out;
	}

	.wfd-food__row--on {
		border-color: var(--wfd-ink);
	}

	button.wfd-food__staple {
		display: flex;
		flex: 1 1 auto;
		gap: 10px;
		align-items: center;
		block-size: auto;
		min-block-size: 46px;
		padding: 0 10px;
		border: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-ink);
		font-family: inherit;
		font-size: 17px;
		text-align: start;
		cursor: pointer;

		&:focus-visible {
			outline: 2px solid var(--wfd-ink);
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
		border: 2px solid var(--wfd-ink);
		border-radius: var(--wfd-radius-sticker);
		color: var(--wfd-on-ink);
		font-size: 14px;
		transition: background-color 0.15s ease-out;
	}

	.wfd-food__row--on .wfd-food__tick {
		background: var(--wfd-ink);
	}

	.wfd-food__row :global(input.wfd-food__amount) {
		flex: 0 1 7.5rem;
		min-inline-size: 0;
		min-block-size: 40px;
		padding: 0 10px;
		font-size: 16px;
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-food__row,
		.wfd-food__tick {
			transition: none;
		}
	}
</style>
