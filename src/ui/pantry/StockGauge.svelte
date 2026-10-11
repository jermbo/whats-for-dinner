<script lang="ts">
	import { makeStock } from '../../pantry/food-item';
	import { partOf, type Level } from '../../pantry/level';
	import type { Stock } from '../../pantry/types';
	import { isCount, showMeasure } from '../../units';
	import Button from '../parts/Button.svelte';

	type Props = {
		name: string;
		// All rows of the food item, and the row that you opened.
		stocks: Stock[];
		at: number;
		level: Level;
		// The rows of the food item after your changes. A row with no food left is not in them.
		onsave: (stocks: Stock[]) => void;
		// Opens the form of one row, with the place, the date, and the low line.
		ondetails: (at: number) => void;
		oncancel: () => void;
	};
	let { name, stocks, at, level, onsave, ondetails, oncancel }: Props = $props();

	const uid = $props.id();

	// The gauge keeps the rows and the level as they are when it opens. After that, they are yours.
	const first = () => ({ stocks, at, level });
	const start = first();
	const { kind, full, low } = start.level;

	// A piece of the bar: one row with an amount that the level counts.
	type Piece = { at: number; place: string; unit: string; factor: number; per: number };
	const pieces: Piece[] = start.stocks.flatMap((stock, index) => {
		const size = partOf(stock, start.level);
		const factor = stock.amount?.factor ?? 0;
		if (size <= 0 || factor <= 0) return [];
		// `per` is the size of one unit of the row, in the measure of the level: 1000 for "kg".
		return [{ at: index, place: stock.place, unit: stock.amount?.unit ?? '', factor, per: size / factor }];
	});

	// The amount of each piece, in the unit of its row.
	let values = $state(pieces.map((piece) => piece.factor));
	// The piece that you update. It starts as the row that you opened.
	let chosen = $state(Math.max(0, pieces.findIndex((piece) => piece.at === start.at)));
	const piece = $derived(pieces[chosen]);

	const sizes = $derived(pieces.map((one, index) => values[index] * one.per));
	const total = $derived(sizes.reduce((sum, size) => sum + size, 0));
	// The food in the other places does not move. The bar is full when all places together have
	// the full amount, so the others limit how far this place can go.
	const others = $derived(total - sizes[chosen]);
	const most = $derived((full - others) / piece.per);
	const step = $derived(stepFor(full / piece.per, isCount(kind)));
	const isLow = $derived(total < low);

	// The amount snaps to a round step, with about 20 steps from empty to full: 50 g for 1 kg.
	function stepFor(scale: number, counted: boolean): number {
		const raw = scale / 20;
		const power = 10 ** Math.floor(Math.log10(raw));
		const round = power * ([1, 2, 2.5, 5, 10].find((size) => size * power >= raw) ?? 10);
		// A part of a can or of an egg is not smaller than a half.
		return counted ? Math.max(round, scale >= 4 ? 1 : 0.5) : round;
	}

	const clean = (amount: number) => Number(amount.toFixed(2));
	const percent = (part: number) => `${Math.min(100, Math.max(0, part * 100))}%`;
	const textOf = (index: number) => `${clean(values[index])} ${pieces[index].unit}`.trim();
	const show = (index: number) => (values[index] > 0 ? textOf(index) : 'None');

	// The line below the name: the place, or the total when the food is in more than one place.
	const placeCount = new Set(pieces.map((one) => one.place)).size;
	const note = $derived(
		placeCount > 1 ? `${showMeasure({ kind, value: total })} in ${placeCount} places` : piece.place
	);

	// The end of the scale is a stop also, when it is between two steps.
	function snap(amount: number): number {
		const limited = Math.max(0, Math.min(most, amount));
		return most - limited < step / 2 ? clean(most) : clean(Math.round(limited / step) * step);
	}

	let track = $state<HTMLElement>();

	// The green line is the end of all the food. The piece next to it is the place that you update.
	function setAt(clientX: number) {
		if (!track) return;
		const box = track.getBoundingClientRect();
		const point = ((clientX - box.left) / box.width) * full;
		values[chosen] = snap((point - others) / piece.per);
	}

	// A press at a point of the bar puts the level there. The drag continues from that point.
	function press(event: PointerEvent) {
		if (event.button !== 0) return;
		track?.setPointerCapture(event.pointerId);
		setAt(event.clientX);
	}

	function drag(event: PointerEvent) {
		if (track?.hasPointerCapture(event.pointerId)) setAt(event.clientX);
	}

	function key(event: KeyboardEvent) {
		const value = values[chosen];
		const moves: Record<string, number> = {
			ArrowLeft: value - step,
			ArrowDown: value - step,
			ArrowRight: value + step,
			ArrowUp: value + step,
			Home: 0,
			End: most
		};
		if (!(event.key in moves)) return;
		event.preventDefault();
		values[chosen] = snap(moves[event.key]);
	}

	// One "Done" writes each place that you changed.
	function done() {
		if (pieces.every((one, index) => values[index] === one.factor)) return oncancel();

		const index = new Map(pieces.map((one, at) => [one.at, at]));
		onsave(
			start.stocks.flatMap((stock, row) => {
				const at = index.get(row);
				if (at === undefined || values[at] === pieces[at].factor) return [stock];
				return values[at] > 0 ? [makeStock(stock.place, textOf(at), stock.useBy ?? '')] : [];
			})
		);
	}

	function usedUp() {
		values[chosen] = 0;
		done();
	}
</script>

<!--
	An open row: the ink panel of the first Larder design. The bar shows all places of the food
	item, with one piece for each place. You select a place, and you drag the bar to the amount that
	is really there.
-->
<div class="wfd-gauge" class:wfd-gauge--low={isLow}>
	<div class="wfd-gauge__top">
		<div class="wfd-gauge__text">
			<h3 class="wfd-gauge__name">{name}</h3>
			<p class="wfd-gauge__note">{note}</p>
		</div>
		<output class="wfd-gauge__amount wfd-number">{show(chosen)}</output>
	</div>

	{#if pieces.length > 1}
		<fieldset class="wfd-gauge__places">
			<legend class="wfd-gauge__legend">Place to update</legend>
			{#each pieces as one, index}
				<label class="wfd-gauge__place">
					<input
						class="wfd-gauge__radio"
						type="radio"
						name={uid}
						checked={index === chosen}
						onchange={() => (chosen = index)}
					/>
					{one.place}
					<span class="wfd-number">{show(index)}</span>
				</label>
			{/each}
		</fieldset>
	{/if}

	<!-- A drag to the side on a phone must not open the side panel of Obsidian. -->
	<div
		class="wfd-gauge__track"
		role="slider"
		tabindex="0"
		aria-label="Amount of {name} in {piece.place}"
		aria-valuemin={0}
		aria-valuemax={clean(most)}
		aria-valuenow={values[chosen]}
		aria-valuetext={show(chosen)}
		style:--level={percent(total / full)}
		style:--low={percent(low / full)}
		bind:this={track}
		onpointerdown={press}
		onpointermove={drag}
		onkeydown={key}
		ontouchstart={(event) => event.stopPropagation()}
		ontouchmove={(event) => event.stopPropagation()}
	>
		{#each pieces as _, index}
			<span
				class="wfd-gauge__piece"
				class:wfd-gauge__piece--chosen={index === chosen}
				style:--size={percent(sizes[index] / full)}
			></span>
		{/each}
		<span class="wfd-gauge__tick"></span>
		<span class="wfd-gauge__handle"></span>
	</div>

	<div class="wfd-gauge__scale wfd-label" aria-hidden="true">
		<span>0</span>
		<span>Low at {showMeasure({ kind, value: low })}</span>
		<span>{showMeasure({ kind, value: full })}</span>
	</div>

	<div class="wfd-gauge__actions">
		<Button onclick={usedUp}>Used up</Button>
		<Button kind="olive" onclick={done}>Done</Button>
	</div>
	<Button kind="link" onclick={() => ondetails(piece.at)}>Place, date, and low line</Button>
</div>

<style>
	.wfd-gauge {
		--gauge-track: color-mix(in oklab, var(--wfd-on-ink) 22%, var(--wfd-ink));
		--gauge-others: color-mix(in oklab, var(--wfd-on-ink) 55%, var(--wfd-ink));
		--gauge-fill: var(--wfd-on-ink);

		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
		padding: 16px 16px 6px;
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-ink);
		color: var(--wfd-on-ink);
	}

	.wfd-gauge--low {
		--gauge-others: color-mix(in oklab, var(--wfd-amber) 50%, var(--wfd-ink));
		--gauge-fill: var(--wfd-amber);
	}

	.wfd-gauge__top {
		display: flex;
		gap: 12px;
		align-items: end;
		justify-content: space-between;
	}

	.wfd-gauge__text {
		display: grid;
		gap: 2px;
		min-inline-size: 0;
	}

	.wfd-gauge__name {
		margin: 0;
		color: inherit;
		font-size: 18px;
		font-weight: 600;
		line-height: 1.25;
	}

	.wfd-gauge__note {
		margin: 0;
		font-size: 14px;
		opacity: 0.75;
	}

	.wfd-gauge__amount {
		font-size: 40px;
		line-height: 1;
		white-space: nowrap;
	}

	/* One option for each place, with its amount. The option that is on has the colour of its piece. */
	.wfd-gauge__places {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.wfd-gauge__legend,
	.wfd-gauge__radio {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.wfd-gauge__place {
		display: flex;
		gap: 10px;
		align-items: baseline;
		min-block-size: 44px;
		padding: 9px 12px;
		border: 2px solid var(--gauge-others);
		border-radius: var(--wfd-radius-button);
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		transition:
			background-color 0.15s ease-out,
			color 0.15s ease-out;

		&:has(:checked) {
			border-color: var(--wfd-on-ink);
			background: var(--wfd-on-ink);
			color: var(--wfd-ink);
		}

		&:has(:focus-visible) {
			outline: 2px solid var(--wfd-on-ink);
			outline-offset: 2px;
		}
	}

	/* The bar is 44 px high, so that a thumb can take it at each point. Up and down still scroll. */
	.wfd-gauge__track {
		position: relative;
		display: flex;
		block-size: 44px;
		margin-block: 5px;
		background: var(--gauge-track);
		cursor: ew-resize;
		touch-action: pan-y;
		-webkit-user-select: none;
		user-select: none;

		&:focus-visible {
			outline: 2px solid var(--wfd-on-ink);
			outline-offset: 7px;
		}
	}

	/* A thin line of ink at the end of a piece shows where one place stops and the next starts. */
	.wfd-gauge__piece {
		flex: none;
		inline-size: var(--size);
		background: var(--gauge-others);
		box-shadow: inset -2px 0 0 var(--wfd-ink);
	}

	/* The piece that you update is last, next to the green line, and it has the full colour. */
	.wfd-gauge__piece--chosen {
		order: 1;
		background: var(--gauge-fill);
		box-shadow: none;
		animation: chosen 0.25s ease-out;
	}

	.wfd-gauge__tick {
		position: absolute;
		inset-block: -5px;
		inset-inline-start: var(--low);
		inline-size: 2px;
		background: var(--wfd-on-ink);
		box-shadow: 0 0 0 1px var(--wfd-ink);
		pointer-events: none;
	}

	.wfd-gauge__handle {
		position: absolute;
		inset-block: -5px;
		inset-inline-start: var(--level);
		inline-size: 12px;
		margin-inline-start: -6px;
		border: 2px solid var(--wfd-ink);
		border-radius: var(--wfd-radius-sticker);
		background: var(--wfd-olive);
		pointer-events: none;
		transition: scale 0.1s ease-out;
	}

	.wfd-gauge__track:active .wfd-gauge__handle {
		scale: 1.3 1.1;
	}

	.wfd-gauge__scale {
		display: flex;
		gap: 12px;
		justify-content: space-between;
		opacity: 0.8;
	}

	.wfd-gauge__actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin-block-start: 4px;
	}

	/* On ink, a quiet button and a link have the colour of the text. */
	.wfd-gauge :global(button.wfd-button--quiet) {
		border-color: var(--wfd-on-ink);
		background: none;
		color: var(--wfd-on-ink);
	}

	.wfd-gauge :global(button.wfd-button--link) {
		justify-self: start;
		color: var(--wfd-on-ink);
	}

	.wfd-gauge :global(button.wfd-button:focus-visible) {
		outline-color: var(--wfd-on-ink);
	}

	/* A piece that becomes the place to update comes in from the colour of the other pieces. */
	@keyframes chosen {
		from {
			background: var(--gauge-others);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-gauge__place,
		.wfd-gauge__handle {
			transition: none;
		}

		.wfd-gauge__piece--chosen {
			animation: none;
		}
	}
</style>
