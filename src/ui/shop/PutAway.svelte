<script lang="ts">
	import { untrack } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { crossfade, slide } from 'svelte/transition';
	import { showDate } from '../../dates';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import type { CartItem, Facts } from '../../shop/facts';
	import { putAwayGroups, putAwayKnown, putAwayPlaceGroup } from '../../shop/put-away-view';
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

	// The items that the plugin knows are in one closed group, so the lines that you see are the
	// items that need you.
	const known = $derived(putAwayKnown(lines));
	let knownOpen = $state(false);

	// The receipt starts when the stage opens with a cart, and it gets a row for each item that you
	// tick later. The stage does not read its own write, so the call is out of the effect.
	const cartKeys = $derived(kitchen.toPutAway.map(({ key }) => key).join('\n'));
	$effect(() => {
		if (cartKeys) untrack(() => void kitchen.startPutAway());
	});

	// The line that shows all its facts, and the group that it had when it opened. It stays in that
	// group while you correct it, so that it does not move under your thumb.
	let open = $state<{ key: string; group: string } | null>(null);

	const placeGroup = (line: Line) => putAwayPlaceGroup(line, open?.key ?? null, open?.group ?? null);

	// You put the food away one place at a time, so you check the food of the fridge at the
	// fridge. The items that do not go into the pantry come last.
	const groups = $derived(putAwayGroups(lines, open));

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
	function change(item: CartItem, changed: Partial<Facts>) {
		update(item, changed.place === '' ? { place: item.start.place } : changed);
	}

	// The screen shows the change at once, and the receipt gets it when you stop typing.
	function update(item: CartItem, changed: Partial<Facts>) {
		draft.change(item.key, changed);
		kitchen.changeFacts(item.key, draft.factsOf(item));
	}

	// A sale has its own price, so the regular price goes out of the field, and the field shows it
	// as a hint. A price that you typed stays. A sale that you put off with no price in the field
	// gives the regular price back.
	function sale(line: Line) {
		const { item, facts } = line;
		if (facts.onSale) {
			const price = facts.price.trim() ? {} : { price: item.start.price };
			update(item, { onSale: false, ...price });
			return;
		}
		const price = facts.price === item.start.price ? { price: '' } : {};
		update(item, { onSale: true, ...price });
		if (open?.key !== item.key) open = { key: item.key, group: placeGroup(line) };
	}

	// The lines go one by one while the items go into the pantry. The stage does not say that the
	// cart is empty in that time, because the trip is not at its end yet.
	let busy = $state(false);

	// The open line stays open while its item goes into the pantry, so that it slides out as you
	// left it. The last item ends the trip.
	function putOne({ item, facts }: Line) {
		return run(() => kitchen.putAway(new Map([[item.key, facts]])));
	}

	function putKnown() {
		return run(() => kitchen.putAway(new Map(known.map(({ item, facts }) => [item.key, facts]))));
	}

	// The last line of a trip that has food in the pantry already ends it. With no such food, the
	// trip stays open, and the cart is empty.
	function notBought(key: string) {
		if (open?.key === key) open = null;
		return run(() => kitchen.notBought(key));
	}

	async function run(action: () => Promise<boolean>) {
		busy = true;
		try {
			if (!(await action())) return;
			draft.clear();
			ondone();
		} finally {
			busy = false;
		}
	}
</script>

<!-- One item of the cart. A line moves between the groups, so it has the same form in each. -->
{#snippet lineOf(line: Line)}
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
			onputaway={() => putOne(line)}
			{busy}
		/>
	</li>
{/snippet}

<section class="wfd-away" aria-label="Put away">
	{#if !lines.length && !busy}
		<p class="wfd-away__empty">The cart is empty.</p>
	{:else}
		<!--
			The receipt of the trip, as the receipt note has it: the known items in one closed group,
			and each other item in the group of its place.
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
			{#if known.length}
				<section class="wfd-away__known" transition:slide={{ duration }}>
					<button
						class="wfd-away__known-head"
						type="button"
						aria-expanded={knownOpen}
						aria-controls="wfd-away-known"
						onclick={() => (knownOpen = !knownOpen)}
					>
						<span class="wfd-away__known-title wfd-display">Known</span>
						{#key known.length}
							<span class="wfd-away__known-count wfd-number">{known.length}</span>
						{/key}
						<svg class="wfd-away__arrow" viewBox="0 0 20 20" aria-hidden="true">
							<path d="M5 8l5 5 5-5" />
						</svg>
					</button>
					{#if knownOpen}
						<ul class="wfd-away__lines" id="wfd-away-known" transition:slide={{ duration }}>
							{#each known as line (line.item.key)}
								{@render lineOf(line)}
							{/each}
						</ul>
					{/if}
				</section>
			{/if}
			{#each groups as group (group.title)}
				<section class="wfd-away__group" transition:slide={{ duration }}>
					<GroupHead title={group.title} note={String(group.lines.length)} />
					<ul class="wfd-away__lines">
						{#each group.lines as line (line.item.key)}
							{@render lineOf(line)}
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
			{#if known.length}
				<Button kind="olive" disabled={busy} onclick={putKnown}>
					Put away {known.length} known <span aria-hidden="true">→</span>
				</Button>
			{/if}
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

	.wfd-away__group,
	.wfd-away__known {
		padding-block-end: 6px;
	}

	/* The head of the known items is one button, as the line "In the cart" of the stage Shop. */
	button.wfd-away__known-head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto auto;
		gap: 12px;
		align-items: center;
		inline-size: 100%;
		block-size: auto;
		min-block-size: 52px;
		margin-block-start: 6px;
		padding: 0;
		border: 0;
		border-block-end: 2px solid var(--wfd-ink);
		border-radius: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-ink);
		font-family: inherit;
		text-align: start;
		cursor: pointer;

		&:focus-visible {
			outline: 2px solid var(--wfd-ink);
			outline-offset: -3px;
		}
	}

	.wfd-away__known-title,
	.wfd-away__known-count {
		font-size: 19px;
	}

	/* A count that changes makes a small jump, so that you see that the items went in. */
	.wfd-away__known-count {
		animation: jump 0.3s ease-out;
	}

	.wfd-away__arrow {
		inline-size: 20px;
		block-size: 20px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2.5;
		transition: rotate 0.2s ease-out;
	}

	[aria-expanded='true'] .wfd-away__arrow {
		rotate: 180deg;
	}

	@keyframes jump {
		40% {
			translate: 0 -5px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-away__known-count {
			animation: none;
		}

		.wfd-away__arrow {
			transition: none;
		}
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
