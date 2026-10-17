<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { crossfade, slide } from 'svelte/transition';
	import { showDate } from '../../dates';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import type { CartItem, Facts } from '../../shop/facts';
	import { readPrice } from '../../shop/price';
	import Button from '../parts/Button.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import PickOne from '../parts/PickOne.svelte';
	import type { PutAwayDraft } from './put-away-draft.svelte';
	import PutAwayLine from './PutAwayLine.svelte';
	import StageFoot from './StageFoot.svelte';

	type Props = {
		kitchen: Kitchen;
		draft: PutAwayDraft;
		// The cart is in the pantry, and the trip is at its end.
		ondone: () => void;
	};
	let { kitchen, draft, ondone }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	const lines = $derived(kitchen.toPutAway.map((item) => ({ item, facts: draft.factsOf(item) })));
	const missing = $derived(lines.filter(({ facts }) => readPrice(facts.price) === null).length);
	// The cost of the trip, from the prices of the lines. A missing price adds nothing.
	const total = $derived(lines.reduce((sum, { facts }) => sum + (readPrice(facts.price) ?? 0), 0));
	type Line = (typeof lines)[number];

	// The line that shows all its facts, and the group that it had when it opened. It stays in that
	// group while you correct it, so that it does not move under your thumb.
	let open = $state<{ key: string; group: string } | null>(null);

	const OUTSIDE = 'Not in the pantry';
	const placeGroup = ({ item, facts }: Line) =>
		facts.intoPantry ? facts.place.trim() || item.start.place : OUTSIDE;
	const groupOf = (line: Line) => (open?.key === line.item.key ? open.group : placeGroup(line));

	// You put the food away one place at a time, so you check the food of the fridge at the
	// fridge. The items that do not go into the pantry come last.
	const groups = $derived.by(() => {
		const titles = [...new Set(lines.map(groupOf))].sort((a, b) =>
			a === OUTSIDE ? 1 : b === OUTSIDE ? -1 : a.localeCompare(b)
		);
		return titles.map((title) => ({
			title,
			lines: lines
				.filter((line) => groupOf(line) === title)
				.sort((a, b) => a.item.name.localeCompare(b.item.name))
		}));
	});

	// A line that gets a new place moves into the group of that place. A line that comes or goes
	// alone, such as an item that you did not buy, slides.
	const [send, receive] = crossfade({ fallback: (node) => slide(node, { duration }) });

	// The pantry does not have the place of a first food yet, so the options get it.
	const placesFor = ({ start }: CartItem) => [...new Set([...kitchen.places, start.place])];

	// A place that you select is yours, so the line does not ask for a look any more.
	const placeIsGuess = ({ key, placeIsGuess }: CartItem) =>
		placeIsGuess && !draft.changed(key, 'place');

	function toggle(line: Line) {
		open = open?.key === line.item.key ? null : { key: line.item.key, group: placeGroup(line) };
	}

	// A line needs a place. With no option and no text, it is the place that the plugin proposes.
	function change({ key, start }: CartItem, changed: Partial<Facts>) {
		draft.change(key, changed.place === '' ? { place: start.place } : changed);
	}

	// A sale has its own price, so the regular price goes out of the field, and the field shows it
	// as a hint. A price that you typed stays. A sale that you put off with no price in the field
	// gives the regular price back.
	function sale(line: Line) {
		const { item, facts } = line;
		if (facts.onSale) {
			const price = facts.price.trim() ? {} : { price: item.start.price };
			draft.change(item.key, { onSale: false, ...price });
			return;
		}
		const price = facts.price === item.start.price ? { price: '' } : {};
		draft.change(item.key, { onSale: true, ...price });
		if (open?.key !== item.key) open = { key: item.key, group: placeGroup(line) };
	}

	function notBought(key: string) {
		if (open?.key === key) open = null;
		kitchen.takeOutOfCart(key);
	}

	// The lines go one by one while the items go into the pantry. The stage does not say that the
	// cart is empty in that time, because the trip is not at its end yet.
	let busy = $state(false);

	async function putAll() {
		const given = new Map(lines.map(({ item, facts }) => [item.key, facts]));
		busy = true;
		try {
			await kitchen.putAway(given, kitchen.tripStore);
			draft.clear();
		} finally {
			busy = false;
		}
		ondone();
	}
</script>

<section class="wfd-away" aria-label="Put away">
	{#if !lines.length && !busy}
		<p class="wfd-away__empty">The cart is empty.</p>
	{:else}
		<!--
			The receipt of the trip, before it is a note: one line for each item of the cart, in groups
			by place.
		-->
		<div class="wfd-away__receipt">
			<div class="wfd-away__trip">
				<p class="wfd-away__day wfd-label">Trip · {showDate(kitchen.today)}</p>
				<!-- The store is a fact of the trip from the stage Shop, and it can stay empty. -->
				<PickOne
					legend="Store"
					options={kitchen.stores}
					value={kitchen.tripStore}
					other="A new store"
					canBeOff
					onchange={(store) => kitchen.setTripStore(store)}
				/>
			</div>
			{#each groups as group (group.title)}
				<section class="wfd-away__group" transition:slide={{ duration }}>
					<GroupHead title={group.title} note={String(group.lines.length)} />
					<ul class="wfd-away__lines">
						{#each group.lines as line (line.item.key)}
							{@const { item, facts } = line}
							<li
								class="wfd-away__line"
								in:receive={{ key: item.key, duration }}
								out:send={{ key: item.key, duration }}
							>
								<PutAwayLine
									{item}
									{facts}
									places={placesFor(item)}
									placeIsGuess={placeIsGuess(item)}
									today={kitchen.today}
									open={open?.key === item.key}
									ontoggle={() => toggle(line)}
									onsale={() => sale(line)}
									onchange={(changed) => change(item, changed)}
									onnotbought={() => notBought(item.key)}
								/>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>

		<StageFoot>
			<div class="wfd-away__sums" aria-live="polite">
				<p class="wfd-away__total">Total <strong class="wfd-number">{total.toFixed(2)}</strong></p>
				{#if missing}
					<p class="wfd-away__missing" transition:slide={{ duration }}>
						{missing === 1 ? '1 price is missing' : `${missing} prices are missing`}
					</p>
				{/if}
			</div>
			<Button kind="olive" disabled={busy} onclick={putAll}>
				Put into the pantry <span aria-hidden="true">→</span>
			</Button>
		</StageFoot>
	{/if}
</section>

<style>
	.wfd-away {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
	}

	.wfd-away__empty {
		margin: 0;
		color: var(--wfd-ink-2);
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

	.wfd-away__group {
		padding-block-end: 6px;
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

	.wfd-away__sums {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 16px;
		align-items: baseline;
		justify-content: space-between;
	}

	.wfd-away__total {
		margin: 0;
		color: var(--wfd-ink-2);
		font-weight: 600;

		& strong {
			color: var(--wfd-ink);
			font-size: 18px;
		}
	}

	.wfd-away__missing {
		margin: 0;
		color: var(--wfd-ink-2);
		font-size: 14px;
		font-weight: 600;
	}
</style>
