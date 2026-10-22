<script lang="ts">
	import { flushSync, untrack } from 'svelte';
	import { prefersReducedMotion, Tween } from 'svelte/motion';
	import { SvelteSet } from 'svelte/reactivity';
	import { fade } from 'svelte/transition';
	import { showDate } from '../../dates';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import { priceOfBrand, type CartItem, type Facts } from '../../shop/facts';
	import { lineKey } from '../../shop/package-lines';
	import {
		putAwayGroups,
		putAwayKnown,
		putAwayPlaceGroup,
		type PutAwayLine as Line
	} from '../../shop/put-away-view';
	import { readPrice } from '../../shop/price';
	import { glide, glideOnNextChange } from '../glide';
	import { timeOf } from '../motion';
	import Button from '../parts/Button.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import HiddenName from '../parts/HiddenName.svelte';
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

	// One line for each package of the cart.
	const lines = $derived(
		kitchen.toPutAway.flatMap((item) =>
			item.lines.map(({ at, start }): Line => {
				const key = lineKey(item.key, at);
				return { key, at, item, start, facts: draft.factsOf(key, item, start) };
			})
		)
	);
	const missing = $derived(lines.filter(({ facts }) => readPrice(facts.price) === null).length);
	// The cost of the trip, from the prices of the lines. A missing price adds nothing.
	const total = $derived(lines.reduce((sum, { facts }) => sum + (readPrice(facts.price) ?? 0), 0));

	// The items that the plugin knows are in one closed group, so the lines that you see are the
	// items that need you.
	const known = $derived(putAwayKnown(lines));
	let knownOpen = $state(false);
	// The count of the known items runs to its new number, so that you see the items go in.
	const knownCount = new Tween(untrack(() => known.length));
	$effect(() => {
		knownCount.set(known.length, { duration: prefersReducedMotion.current ? 0 : 300 });
	});

	// The receipt starts when the stage opens with a cart, and it gets a row for each item that you
	// tick later. The stage does not read its own write, so the call is out of the effect.
	const cartKeys = $derived(kitchen.toPutAway.map(({ key }) => key).join('\n'));
	$effect(() => {
		if (cartKeys) untrack(() => void kitchen.shop.startPutAway());
	});

	// The line that shows all its facts, and the group that it had when it opened. It stays in that
	// group while you correct it, so that it does not move under your thumb.
	let open = $state<{ key: string; group: string } | null>(null);

	const placeGroup = (line: Line) => putAwayPlaceGroup(line, open?.key ?? null, open?.group ?? null);

	// You put the food away one place at a time, so you check the food of the fridge at the
	// fridge. The items that do not go into the pantry come last.
	const groups = $derived(putAwayGroups(lines, open));

	// A line that opens, closes, or goes changes the place of the lines after it. They glide to
	// their new place, so nothing jumps.
	let box = $state<HTMLElement>();
	const LINES = '.wfd-away__group, .wfd-away__line';
	const glideLines = (next: () => void) => glide(box, LINES, () => flushSync(next));

	// A line that goes fades in its place first. The vault takes it out some time after the write,
	// and the lines after it glide up then.
	const fading = new SvelteSet<string>();
	$effect(() => {
		void kitchen.toPutAway;
		untrack(() => fading.clear());
	});
	function fadeThen(keys: string[], action: () => Promise<void>) {
		for (const key of keys) fading.add(key);
		setTimeout(
			() => {
				glideOnNextChange(box, LINES);
				void action().finally(() => keys.forEach((key) => fading.delete(key)));
			},
			box ? timeOf(box, 'move') : 0
		);
	}

	// The pantry does not have the place of a first food yet, so the options get it.
	const placesFor = ({ start }: CartItem) => [...new Set([...kitchen.places, start.place])];

	// A place that you select is yours, so the line does not ask for a look any more.
	const placeIsGuess = ({ key, item }: Line) => item.placeIsGuess && !draft.changed(key, 'place');

	function toggle(line: Line) {
		glideLines(() => (open = open?.key === line.key ? null : { key: line.key, group: placeGroup(line) }));
	}

	// A line needs a place. With no option and no text, it is the place that the plugin proposes.
	function change(line: Line, changed: Partial<Facts>) {
		update(line, changed.place === '' ? { place: line.item.start.place } : changed);
	}

	// The screen shows the change at once, and the receipt gets it when you stop typing. A
	// correction of one line does not change the other lines of the item.
	function update({ key, item, start }: Line, changed: Partial<Facts>) {
		draft.change(key, changed);
		kitchen.shop.changeFacts(key, draft.factsOf(key, item, start));
	}

	// A sale has its own price, so the regular price goes out of the field, and the field shows it
	// as a hint. A price that you typed stays. A sale that you put off with no price in the field
	// gives the regular price back.
	function sale(line: Line) {
		const { key, item, facts } = line;
		const regular = priceOfBrand(item, facts.brand);
		if (facts.onSale) {
			if (!facts.price.trim()) draft.forget(key, 'price');
			update(line, { onSale: false });
			return;
		}
		const price = facts.price === regular ? { price: '' } : {};
		update(line, { onSale: true, ...price });
		if (open?.key !== key) open = { key, group: placeGroup(line) };
	}

	// A photo of the package in your hand is a new brand, and the brand of the line.
	async function takeBrand(line: Line, photo: Blob) {
		const name = await kitchen.brands.addBrandPhoto(line.item.key, photo);
		if (name) update(line, { brand: `[[${name}]]` });
	}

	// A package that the plugin did not expect: a copy of the open line, below it.
	function addPackage(line: Line) {
		return kitchen.shop.addPackageLine(line.key, line.facts);
	}

	// The lines go one by one while the items go into the pantry. The stage does not say that the
	// cart is empty in that time, because the trip is not at its end yet.
	let busy = $state(false);

	// The open line stays open while its item goes into the pantry, so that it fades as you left
	// it. The last item ends the trip.
	function putOne({ key, facts }: Line) {
		fadeThen([key], () => run(() => kitchen.shop.putAway(new Map([[key, facts]]))));
	}

	function putKnown() {
		const keys = known.map(({ key }) => key);
		fadeThen(keys, () => run(() => kitchen.shop.putAway(new Map(known.map(({ key, facts }) => [key, facts])))));
	}

	// The last line of a trip that has food in the pantry already ends it. With no such food, the
	// trip stays open, and the cart is empty.
	function notBought({ key, item }: Line) {
		draft.forgetItem(item.key);
		fadeThen([key], () => {
			if (open?.key === key) open = null;
			return run(() => kitchen.shop.notBought(key));
		});
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

	const uid = $props.id();
</script>

<!-- One item of the cart. A line moves between the groups, so it has the same form in each. -->
{#snippet lineOf(line: Line)}
	{@const { item, facts } = line}
	<li class="wfd-away__line" class:wfd-away__line--fading={fading.has(line.key)}>
		<PutAwayLine
			{item}
			{facts}
			places={placesFor(item)}
			placeIsGuess={placeIsGuess(line)}
			today={kitchen.today}
			open={open?.key === line.key}
			ontoggle={() => toggle(line)}
			onsale={() => sale(line)}
			onchange={(changed) => change(line, changed)}
			regular={priceOfBrand(item, facts.brand)}
			urlOf={(photo) => kitchen.photoUrl(photo, item.key)}
			ontake={(photo) => takeBrand(line, photo)}
			onaddpackage={() => addPackage(line)}
			onnotbought={() => notBought(line)}
			onputaway={() => putOne(line)}
			{busy}
		/>
	</li>
{/snippet}

<section class="wfd-away" aria-labelledby="{uid}-name" bind:this={box}>
	<HiddenName id="{uid}-name" text="Put away" />
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
					onchange={(store) => kitchen.shop.setTripStore(store)}
				/>
			</div>
			{#if known.length}
				<section class="wfd-away__known wfd-away__group">
					<button
						class="wfd-away__known-head"
						type="button"
						aria-expanded={knownOpen}
						aria-controls="wfd-away-known"
						onclick={() => glideLines(() => (knownOpen = !knownOpen))}
					>
						<span class="wfd-away__known-title wfd-display">Known</span>
						<span class="wfd-away__known-count wfd-number">{Math.round(knownCount.current)}</span>
						<svg class="wfd-away__arrow" viewBox="0 0 20 20" aria-hidden="true">
							<path d="M5 8l5 5 5-5" />
						</svg>
					</button>
					{#if knownOpen}
						<ul class="wfd-away__lines" id="wfd-away-known" in:fade={{ duration }}>
							{#each known as line (line.key)}
								{@render lineOf(line)}
							{/each}
						</ul>
					{/if}
				</section>
			{/if}
			{#each groups as group (group.title)}
				<section class="wfd-away__group">
					<GroupHead title={group.title} note={String(group.lines.length)} />
					<ul class="wfd-away__lines">
						{#each group.lines as line (line.key)}
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
					<p class="wfd-away__missing" transition:fade={{ duration }}>
						{missing === 1 ? '1 price is missing' : `${missing} prices are missing`}
					</p>
				{/if}
			</div>
			{#if known.length}
				<Button kind="olive" disabled={busy} onclick={putKnown}>
					Put away {known.length} known
				</Button>
			{/if}
		</StageFoot>
	{/if}
</section>

<style>
	.wfd-away {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-stack);
	}

	.wfd-away__empty {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}

	/* Paper with sharp corners, as the receipt of a store. */
	.wfd-away__receipt {
		padding: var(--wfd-space-tight) var(--wfd-space-inset);
		border-radius: var(--wfd-radius-sticker);
		background: var(--wfd-color-surface);
	}

	.wfd-away__trip {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-stack);
		padding-block: var(--wfd-space-inset);
		border-block-end: var(--wfd-border) dashed var(--wfd-color-text-faint);
	}

	.wfd-away__day {
		margin: 0;
		color: var(--wfd-color-text-muted);
		text-align: center;
	}

	.wfd-away__group,
	.wfd-away__known {
		padding-block-end: var(--wfd-space-tight);
	}

	/* The head of the known items is one button, as the line "In the cart" of the stage Shop. */
	button.wfd-away__known-head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto auto;
		gap: var(--wfd-space-stack);
		align-items: center;
		inline-size: 100%;
		block-size: auto;
		min-block-size: var(--wfd-control);
		margin-block-start: var(--wfd-space-group);
		padding: 0;
		border: 0;
		border-block-end: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		text-align: start;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: -3px;
		}
	}

	.wfd-away__known-title,
	.wfd-away__known-count {
		font-size: var(--wfd-font-size-title);
	}

	.wfd-away__arrow {
		inline-size: 20px;
		block-size: 20px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2.5;
		transition: rotate var(--wfd-motion-change) var(--wfd-ease-out);
	}

	[aria-expanded='true'] .wfd-away__arrow {
		rotate: 180deg;
	}

	/* On a wide tab, the lines are in columns, as the rows of the list. */
	.wfd-away__lines {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 24rem), 1fr));
		gap: 0 var(--wfd-space-section);
		align-items: start;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-away__line {
		border-block-end: var(--wfd-border-thin) dotted var(--wfd-color-text-faint);
		transition: opacity var(--wfd-row-motion);
	}

	.wfd-away__line--fading {
		opacity: 0;
	}

	.wfd-away__sums {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-tight) var(--wfd-space-section);
		align-items: baseline;
		justify-content: space-between;
	}

	.wfd-away__total {
		margin: 0;
		color: var(--wfd-color-text-muted);
		font-weight: 600;

		& strong {
			color: var(--wfd-color-text);
			font-size: var(--wfd-font-size-name);
		}
	}

	.wfd-away__missing {
		margin: 0;
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
		font-weight: 600;
	}
</style>
