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
	import Field from '../parts/Field.svelte';
	import Panel from '../parts/Panel.svelte';

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
	const leftText = (stock: Stock) => {
		if (!filledOf(stock)) return `Empty · ${stock.sizeText}`;
		return `${isCounted(stock) ? filledOf(stock) : stock.left} of ${stock.sizeText}`;
	};
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

	// A drag goes down to empty. The part stays until the card closes, and "Done" takes its row out.
	function setStop(key: string, stop: number) {
		const one = packages.find((each) => each.key === key);
		if (!one) return;
		const clamped = Math.min(stopsOf(one.stock), Math.max(0, stop));
		if (clamped !== filledOf(one.stock)) change(key, (stock) => withStop(stock, clamped));
	}

	type Part = (typeof layout)[number];
	const xOf = (event: PointerEvent) => {
		const box = (event.currentTarget as HTMLElement).getBoundingClientRect();
		return (event.clientX - box.left) / box.width;
	};
	// The nearest stop, so that the first eighth of a jug is empty.
	const stopAt = (part: Part, x: number) =>
		Math.round(((x - part.start) / part.width) * stopsOf(part.stock));

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

<Panel kind="ink">
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
				aria-valuemin={0}
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
				<Button kind="link" onclick={empty}>Empty</Button>
				<Button kind="link" aria-expanded={details} onclick={() => (details = !details)}>
					Place and date
				</Button>
			{/if}
			<Button kind="link" onclick={onfood}>Size, names, and brands</Button>
			<Button kind="link" onclick={oncancel}>Cancel</Button>
		</div>
		{#if !canAdd}
			<p class="wfd-card__hint">Give the food item a size, and you can add a package.</p>
		{/if}

		{#if details && on}
			<div class="wfd-card__details" transition:slide={{ duration }}>
				<Panel>
					<div class="wfd-card__detail-list">
						<div class="wfd-card__chips" role="group" aria-label="Place">
							{#each places as option (option)}
								<Chip
									label={option}
									on={on.stock.place === option}
									onclick={() => change(on.key, (stock) => withPlace(stock, option))}
								/>
							{/each}
						</div>
						<Field label="Use by">
							<input
								type="date"
								value={on.stock.useBy ?? ''}
								onchange={(event) => change(on.key, (stock) => withUseBy(stock, event.currentTarget.value))}
							/>
						</Field>
					</div>
				</Panel>
			</div>
		{/if}
	</div>
</Panel>

<style>
	.wfd-card {
		--card-track: color-mix(in oklab, var(--wfd-color-on-selected) 14%, var(--wfd-color-selected));
		--card-away: color-mix(in oklab, var(--wfd-color-on-selected) 50%, var(--wfd-color-selected));
		--card-fill: var(--wfd-color-on-selected);

		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-stack);
	}

	.wfd-card--low {
		--card-fill: var(--wfd-color-warning);
	}

	.wfd-card__top {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: start;
		justify-content: space-between;
	}

	.wfd-card__head {
		min-inline-size: 0;
	}

	.wfd-card__name {
		margin: 0;
		color: inherit;
		font-size: var(--wfd-font-size-name);
		font-weight: 600;
		overflow-wrap: anywhere;
	}

	.wfd-card__note {
		margin: var(--wfd-space-tight) 0 0;
		font-size: var(--wfd-font-size-small);
		opacity: 0.75;
	}

	.wfd-card__total {
		font-size: var(--wfd-font-size-head);
		line-height: var(--wfd-line-height-single);
		white-space: nowrap;
	}

	/* 44 px high, so that a thumb can take it at each point. Up and down still scroll. */
	.wfd-card__track {
		position: relative;
		display: flex;
		block-size: var(--wfd-control-min);
		margin-block: var(--wfd-space-tight);
		cursor: ew-resize;
		touch-action: pan-y;
		-webkit-user-select: none;
		user-select: none;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-on-selected);
			outline-offset: 7px;
		}
	}

	/* A thin line of the card between two packages. */
	.wfd-card__part {
		box-sizing: border-box;
		display: flex;
		flex: none;
		background: var(--card-track);
		border-inline-start: var(--wfd-border-rule) solid var(--wfd-color-selected);
		transition: inline-size var(--wfd-card-motion);

		&:first-of-type {
			border-inline-start: 0;
		}
	}

	.wfd-card__fill {
		background: var(--card-away);
		transition: inline-size var(--wfd-card-motion);
	}

	.wfd-card__part--here .wfd-card__fill {
		background: var(--card-fill);
	}

	.wfd-card__handle {
		position: absolute;
		inset-block: -5px;
		inline-size: 12px;
		translate: -50% 0;
		border: var(--wfd-border) solid var(--wfd-color-selected);
		border-radius: var(--wfd-radius-sticker);
		background: var(--wfd-color-primary);
		pointer-events: none;
		transition:
			inset-inline-start var(--wfd-card-motion),
			scale var(--wfd-motion-press) var(--wfd-ease-out);
	}

	/* While you drag, the bar follows the thumb with no delay, and the handle grows a little. */
	.wfd-card__track--drag .wfd-card__fill,
	.wfd-card__track--drag .wfd-card__handle {
		transition: scale var(--wfd-button-motion);
	}

	.wfd-card__track--drag .wfd-card__handle {
		scale: 1.3 1.1;
	}

	.wfd-card__scale {
		display: flex;
		gap: var(--wfd-space-group);
		justify-content: space-between;
	}

	/* Two buttons side by side, each on one line. A narrow column puts them one below the other. */
	.wfd-card__actions {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 8.5rem), 1fr));
		gap: var(--wfd-space-stack);
	}

	.wfd-card__actions :global(button.wfd-button) {
		white-space: nowrap;
	}

	.wfd-card__links {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--wfd-space-section);
	}

	.wfd-card__hint {
		margin: 0;
		font-size: var(--wfd-font-size-small);
		opacity: 0.75;
	}

	/* The place and the date are in the colours of the page, on a panel inside the card. */
	.wfd-card__detail-list {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-group);
	}

	.wfd-card__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--wfd-space-group);
	}


	.wfd-card__hidden {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
