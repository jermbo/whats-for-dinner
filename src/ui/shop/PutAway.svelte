<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly, slide } from 'svelte/transition';
	import { showDate } from '../../dates';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import type { CartItem, Facts } from '../../shop/facts';
	import { readPrice } from '../../shop/price';
	import Button from '../parts/Button.svelte';
	import Count from '../parts/Count.svelte';
	import PartHead from '../parts/PartHead.svelte';
	import PickOne from '../parts/PickOne.svelte';
	import type { PutAwayDraft } from './put-away-draft.svelte';
	import PutAwayLine from './PutAwayLine.svelte';

	type Props = { kitchen: Kitchen; draft: PutAwayDraft; onclose: () => void };
	let { kitchen, draft, onclose }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	const lines = $derived(kitchen.toPutAway.map((item) => ({ item, facts: draft.factsOf(item) })));
	const missing = $derived(lines.filter(({ facts }) => readPrice(facts.price) === null).length);

	// The key of the line that shows all its facts.
	let open = $state<string | null>(null);

	// The pantry does not have the place of a first food yet, so the options get it.
	const placesFor = ({ start }: CartItem) => [...new Set([...kitchen.places, start.place])];

	// A line needs a place. With no option and no text, it is the place that the plugin proposes.
	// A new food item needs its amount and its place, so its line opens.
	function change({ key, start }: CartItem, changed: Partial<Facts>) {
		draft.change(key, changed.place === '' ? { place: start.place } : changed);
		if (changed.intoPantry) open = key;
	}

	// The screen closes at once, and the Shop part shows the cart while it goes into the pantry.
	async function putAll() {
		const given = new Map(lines.map(({ item, facts }) => [item.key, facts]));
		onclose();
		await kitchen.putAway(given, draft.store);
		draft.clear();
	}
</script>

<section class="wfd-away" aria-label="Put away" in:fly={{ y: 24, duration }}>
	<div class="wfd-away__page">
		<PartHead title="Put away">
			{#snippet side()}
				<Count have={lines.length - missing} of={lines.length} label="with a price" />
			{/snippet}
		</PartHead>

		<!-- The receipt of the trip, before it is a note: one line for each item of the cart. -->
		<div class="wfd-away__receipt">
			<div class="wfd-away__trip">
				<p class="wfd-away__day wfd-label">Trip · {showDate(kitchen.today)}</p>
				<!-- The store is a fact of the trip, and it can stay empty. -->
				<PickOne
					legend="Store"
					options={kitchen.stores}
					value={draft.store}
					other="A new store"
					canBeOff
					onchange={(store) => (draft.store = store)}
				/>
			</div>
			<ul class="wfd-away__lines">
				{#each lines as { item, facts } (item.key)}
					<li class="wfd-away__line" transition:slide={{ duration }}>
						<PutAwayLine
							name={item.name}
							own={!item.start.intoPantry}
							{facts}
							places={placesFor(item)}
							open={open === item.key}
							ontoggle={() => (open = open === item.key ? null : item.key)}
							onchange={(changed) => change(item, changed)}
							onnotbought={() => kitchen.takeOutOfCart(item.key)}
						/>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<footer class="wfd-away__foot">
		<div aria-live="polite">
			{#if missing}
				<p class="wfd-away__missing" transition:slide={{ duration }}>
					{missing === 1 ? '1 price is missing' : `${missing} prices are missing`}
				</p>
			{/if}
		</div>
		<div class="wfd-away__actions">
			<Button onclick={onclose}>Back</Button>
			<Button kind="olive" onclick={putAll}>
				Put into the pantry <span aria-hidden="true">→</span>
			</Button>
		</div>
	</footer>
</section>

<style>
	/*
	 * The screen has the height of the tab. The receipt scrolls, and the two buttons keep their
	 * place below it, also with 20 items in the cart.
	 */
	.wfd-away {
		display: flex;
		flex-direction: column;
		block-size: 100%;
	}

	.wfd-away__page {
		display: grid;
		flex: 1;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
		align-content: start;
		min-block-size: 0;
		padding: 12px 14px 16px;
		overflow-y: auto;
	}

	/* Paper with sharp corners, as the receipt of a store. */
	.wfd-away__receipt {
		padding: 4px 14px;
		border-radius: var(--wfd-radius-sticker);
		background: var(--wfd-card);
	}

	.wfd-away__trip {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 10px;
		padding-block: 12px;
		border-block-end: 2px dashed var(--wfd-ink-3);
	}

	.wfd-away__day {
		margin: 0;
		color: var(--wfd-ink-2);
		text-align: center;
	}

	/* On a wide tab, the lines are in columns, as the rows of the list. */
	.wfd-away__lines {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 24rem), 1fr));
		gap: 0 32px;
		align-items: start;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-away__line {
		border-block-end: 1px dotted var(--wfd-ink-3);
	}

	.wfd-away__foot {
		display: grid;
		flex: none;
		grid-template-columns: minmax(0, 1fr);
		gap: 8px;
		padding: 10px 14px max(var(--safe-area-inset-bottom, 0px), 12px);
		border-block-start: 2px solid var(--wfd-ink);
		background: var(--wfd-paper);
	}

	.wfd-away__missing {
		margin: 0;
		color: var(--wfd-ink-2);
		font-size: 14px;
		font-weight: 600;
	}

	.wfd-away__actions {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 12px;
	}
</style>
