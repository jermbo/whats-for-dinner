<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { SvelteSet } from 'svelte/reactivity';
	import { slide } from 'svelte/transition';
	import {
		cardPackages,
		cardRows,
		filledOf,
		fullPackage,
		nextSize,
		stopsOf,
		withPlace,
		withStop,
		withUseBy,
		type CardPackage
	} from '../../pantry/card';
	import { levelOf } from '../../pantry/level';
	import { totalOf } from '../../pantry/total';
	import type { FoodItem, Stock } from '../../pantry/types';
	import { isCount, measure, sameUnit } from '../../units';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';

	type Props = {
		item: FoodItem;
		// The place of the group that the card opened in. Its packages are dark.
		place: string;
		places: string[];
		// The card opens with one new package, as after "+ Add package".
		addFirst?: boolean;
		// The rows to write, or null when nothing changed.
		ondone: (rows: Stock[] | null) => void;
		oncancel: () => void;
		// Opens the form of the food item: its size, its other names, its staple, and its brands.
		onfood: () => void;
	};
	let { item, place, places, addFirst = false, ondone, oncancel, onfood }: Props = $props();

	const uid = $props.id();
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	// The packages as the card opened, in a sequence that stays until it closes.
	const first = () => cardPackages(item.stocks, place);
	let packages = $state<CardPackage[]>(first());
	const emptied = new SvelteSet<string>();
	const shown = $derived(packages.filter(({ key }) => !emptied.has(key)));

	let selected = $state<string | null>(first()[0]?.key ?? null);
	let details = $state(false);
	let dragging = $state(false);
	let added = 0;

	const size = () => nextSize(item, place);
	const canAdd = $derived(Boolean(size()));

	function add() {
		const text = size();
		if (!text) return;
		const key = `new ${added++}`;
		packages = [...packages, { key, at: null, stock: fullPackage(place, text) }];
		selected = key;
	}
	// The card opens with a new package after "Add to pantry". This runs one time, as the card opens.
	const startWithNew = () => addFirst;
	if (startWithNew()) add();

	const on = $derived(shown.find(({ key }) => key === selected));
	const stocks = $derived(shown.map(({ stock }) => stock));
	const low = $derived(levelOf({ ...item, stocks })?.isLow ?? false);

	const isCounted = (stock: Stock) => stock.size !== null && isCount(measure(stock.size).kind);
	const leftText = (stock: Stock) =>
		isCounted(stock) ? `${filledOf(stock)} of ${stock.sizeText}` : `${stock.left} of ${stock.sizeText}`;
	const sizes = $derived(totalOf(stocks.map((stock) => fullPackage(stock.place, stock.sizeText))));
	const here = $derived(stocks.filter((stock) => stock.place === place).length);
	const placeCount = $derived(new Set(stocks.map((stock) => stock.place)).size);

	// A part is as long as its size. With different units, the parts are the same length.
	const layout = $derived.by(() => {
		const unit = stocks[0]?.size?.unit ?? null;
		const oneUnit = stocks.every((stock) => sameUnit(stock.size?.unit ?? null, unit));
		const weights = shown.map(({ stock }) => (oneUnit && stock.size ? measure(stock.size).value : 1));
		const sum = weights.reduce((all, weight) => all + weight, 0) || 1;
		let start = 0;
		return shown.map((one, index) => {
			const width = weights[index] / sum;
			const part = { ...one, start, width };
			start += width;
			return part;
		});
	});
	const fillOf = (stock: Stock) => filledOf(stock) / stopsOf(stock);
	const handle = $derived(layout.find(({ key }) => key === selected));

	function change(key: string, next: (stock: Stock) => Stock) {
		packages = packages.map((one) => (one.key === key ? { ...one, stock: next(one.stock) } : one));
	}

	// A drag stops at the first stop. "Empty" takes a package away, so a drag cannot do it by error.
	function setStop(key: string, stop: number) {
		const one = packages.find((each) => each.key === key);
		if (!one) return;
		const clamped = Math.min(stopsOf(one.stock), Math.max(1, stop));
		if (clamped !== filledOf(one.stock)) change(key, (stock) => withStop(stock, clamped));
	}

	type Part = (typeof layout)[number];
	const xOf = (event: PointerEvent) => {
		const box = (event.currentTarget as HTMLElement).getBoundingClientRect();
		return (event.clientX - box.left) / box.width;
	};
	const stopAt = (part: Part, x: number) =>
		Math.ceil(((x - part.start) / part.width) * stopsOf(part.stock));

	function down(event: PointerEvent) {
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
		const x = xOf(event);
		const part = layout.find((one) => x < one.start + one.width) ?? layout.at(-1);
		if (!part) return;
		selected = part.key;
		dragging = true;
		setStop(part.key, stopAt(part, x));
	}

	function move(event: PointerEvent) {
		if (dragging && handle) setStop(handle.key, stopAt(handle, xOf(event)));
	}

	function key(event: KeyboardEvent) {
		const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[event.key];
		if (!step || !on) return;
		event.preventDefault();
		setStop(on.key, filledOf(on.stock) + step);
	}

	function empty() {
		if (!on) return;
		const at = shown.indexOf(on);
		emptied.add(on.key);
		selected = (shown[at + 1] ?? shown[at - 1])?.key ?? null;
	}

	const done = () => ondone(cardRows(item.stocks, packages, emptied));
</script>

<div class="wfd-card" class:wfd-card--low={low}>
	<div class="wfd-card__top">
		<div class="wfd-card__head">
			<h3 class="wfd-card__name">{item.name}</h3>
			<p class="wfd-card__note">
				{place} · {here} here{placeCount > 1 ? ` · ${placeCount} places` : ''}
			</p>
		</div>
		<output class="wfd-card__total wfd-number">{stocks.length ? totalOf(stocks) : 'Out'}</output>
	</div>

	{#if layout.length}
		<div
			class="wfd-card__track"
			class:wfd-card__track--drag={dragging}
			role="slider"
			tabindex="0"
			aria-labelledby="{uid}-name"
			aria-valuemin={1}
			aria-valuemax={on ? stopsOf(on.stock) : 1}
			aria-valuenow={on ? filledOf(on.stock) : 0}
			aria-valuetext={on ? `${leftText(on.stock)}, ${on.stock.place}` : ''}
			onpointerdown={down}
			onpointermove={move}
			onpointerup={() => (dragging = false)}
			onpointercancel={() => (dragging = false)}
			onkeydown={key}
		>
			<span class="wfd-card__hidden" id="{uid}-name">{item.name}</span>
			{#each layout as part (part.key)}
				<span
					class="wfd-card__part"
					class:wfd-card__part--here={part.stock.place === place}
					style:inline-size="{part.width * 100}%"
					in:slide={{ axis: 'x', duration }}
					out:slide={{ axis: 'x', duration }}
				>
					<span class="wfd-card__fill" style:inline-size="{fillOf(part.stock) * 100}%"></span>
				</span>
			{/each}
			{#if handle}
				<span
					class="wfd-card__handle"
					style:inset-inline-start="{(handle.start + fillOf(handle.stock) * handle.width) * 100}%"
				></span>
			{/if}
		</div>

		<div class="wfd-card__scale wfd-label">
			<span>0</span>
			{#if on}
				<span>{on.stock.place === place ? '' : `${on.stock.place} · `}{leftText(on.stock)}</span>
			{/if}
			<span>{sizes}</span>
		</div>
	{/if}

	<div class="wfd-card__actions">
		<Button disabled={!canAdd} onclick={add}>+ Add package</Button>
		<Button kind="olive" onclick={done}>Done</Button>
	</div>

	<div class="wfd-card__links">
		{#if on}
			<button type="button" onclick={empty}>Empty</button>
			<button type="button" aria-expanded={details} onclick={() => (details = !details)}>
				Place and date
			</button>
		{/if}
		<button type="button" onclick={onfood}>Size, names, and brands</button>
		<button type="button" onclick={oncancel}>Cancel</button>
	</div>
	{#if !canAdd}
		<p class="wfd-card__hint">Give the food item a size, and you can add a package.</p>
	{/if}

	{#if details && on}
		<div class="wfd-card__details" transition:slide={{ duration }}>
			<div class="wfd-card__chips" role="group" aria-label="Place">
				{#each places as option (option)}
					<Chip
						label={option}
						on={on.stock.place === option}
						onclick={() => change(on.key, (stock) => withPlace(stock, option))}
					/>
				{/each}
			</div>
			<label class="wfd-card__date">
				<span class="wfd-label">Use by</span>
				<input
					type="date"
					value={on.stock.useBy ?? ''}
					onchange={(event) => change(on.key, (stock) => withUseBy(stock, event.currentTarget.value))}
				/>
			</label>
		</div>
	{/if}
</div>

<style>
	.wfd-card {
		--card-track: color-mix(in oklab, var(--wfd-on-ink) 14%, var(--wfd-ink));
		--card-away: color-mix(in oklab, var(--wfd-on-ink) 50%, var(--wfd-ink));
		--card-fill: var(--wfd-on-ink);

		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
		padding: 16px;
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-ink);
		color: var(--wfd-on-ink);
	}

	.wfd-card--low {
		--card-fill: var(--wfd-amber);
	}

	.wfd-card__top {
		display: flex;
		gap: 12px;
		align-items: start;
		justify-content: space-between;
	}

	.wfd-card__head {
		min-inline-size: 0;
	}

	.wfd-card__name {
		margin: 0;
		color: inherit;
		font-size: 18px;
		font-weight: 600;
		overflow-wrap: anywhere;
	}

	.wfd-card__note {
		margin: 2px 0 0;
		font-size: 14px;
		opacity: 0.75;
	}

	.wfd-card__total {
		font-size: 34px;
		line-height: 1;
		white-space: nowrap;
	}

	/* 44 px high, so that a thumb can take it at each point. Up and down still scroll. */
	.wfd-card__track {
		position: relative;
		display: flex;
		block-size: 44px;
		margin-block: 5px;
		cursor: ew-resize;
		touch-action: pan-y;
		-webkit-user-select: none;
		user-select: none;

		&:focus-visible {
			outline: 2px solid var(--wfd-on-ink);
			outline-offset: 7px;
		}
	}

	/* A thin line of the card between two packages. */
	.wfd-card__part {
		box-sizing: border-box;
		display: flex;
		flex: none;
		background: var(--card-track);
		border-inline-start: 3px solid var(--wfd-ink);
		transition: inline-size 0.25s ease-out;

		&:first-of-type {
			border-inline-start: 0;
		}
	}

	.wfd-card__fill {
		background: var(--card-away);
		transition: inline-size 0.2s ease-out;
	}

	.wfd-card__part--here .wfd-card__fill {
		background: var(--card-fill);
	}

	.wfd-card__handle {
		position: absolute;
		inset-block: -5px;
		inline-size: 12px;
		margin-inline-start: -6px;
		border: 2px solid var(--wfd-ink);
		border-radius: var(--wfd-radius-sticker);
		background: var(--wfd-olive);
		pointer-events: none;
		transition:
			inset-inline-start 0.2s ease-out,
			scale 0.1s ease-out;
	}

	/* While you drag, the bar follows the thumb with no delay, and the handle grows a little. */
	.wfd-card__track--drag .wfd-card__fill,
	.wfd-card__track--drag .wfd-card__handle {
		transition: scale 0.1s ease-out;
	}

	.wfd-card__track--drag .wfd-card__handle {
		scale: 1.3 1.1;
	}

	.wfd-card__scale {
		display: flex;
		gap: 8px;
		justify-content: space-between;
	}

	/* Two buttons side by side, each on one line. A narrow column puts them one below the other. */
	.wfd-card__actions {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 8.5rem), 1fr));
		gap: 12px;
	}

	.wfd-card__actions :global(button.wfd-button) {
		padding-inline: 12px;
		white-space: nowrap;
	}

	.wfd-card :global(button.wfd-button--quiet) {
		border-color: var(--wfd-on-ink);
		background: none;
		color: var(--wfd-on-ink);
	}

	.wfd-card__links {
		display: flex;
		flex-wrap: wrap;
		gap: 0 20px;

		& button {
			block-size: 44px;
			padding: 0;
			border: 0;
			background: none;
			box-shadow: none;
			color: var(--wfd-on-ink);
			font-family: inherit;
			font-size: 15px;
			font-weight: 600;
			text-decoration: underline;
			cursor: pointer;
		}
	}

	.wfd-card__hint {
		margin: 0;
		font-size: 14px;
		opacity: 0.75;
	}

	/* The place and the date are in the colours of the page, on a panel inside the card. */
	.wfd-card__details {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 8px;
		padding: 8px 12px 12px;
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-card);
		color: var(--wfd-ink);
	}

	.wfd-card__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0 6px;
	}

	.wfd-card__date {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 12px;
		align-items: center;

		& input {
			box-sizing: border-box;
			inline-size: 100%;
			min-inline-size: 0;
			block-size: 44px;
		}
	}

	.wfd-card__hidden {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-card__part,
		.wfd-card__fill,
		.wfd-card__handle {
			transition: none;
		}
	}
</style>
