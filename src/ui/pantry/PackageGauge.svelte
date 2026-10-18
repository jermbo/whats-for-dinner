<script lang="ts">
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { Level } from '../../pantry/level';
	import {
		barOf,
		openLineOf,
		sealedLike,
		snap,
		stockAt,
		type Package,
		type PackageBar
	} from '../../pantry/open-line';
	import type { Stock } from '../../pantry/types';
	import { measure, showAmount } from '../../units';
	import Button from '../parts/Button.svelte';

	type Props = {
		name: string;
		place: string;
		// The rows of the line: the packages of the food item in this place that are not empty.
		packages: Package[];
		loose: boolean;
		// The level of the food item, for the amber bar. Null when the plugin cannot count it.
		level: Level | null;
		// Writes the changed rows, by their number in the table, and the new sealed packages. `close`
		// closes the line, as "Done" does.
		onwrite: (changes: { at: number; stock: Stock }[], added: Stock[], close: boolean) => void;
		// The package that "Add package" copies: the row of this place with the newest date.
		last: Stock | null;
		// Opens the form of one package, with its place, its date, and its size.
		ondetails: (at: number) => void;
		oncancel: () => void;
	};
	let { name, place, packages, loose, level, onwrite, last, ondetails, oncancel }: Props =
		$props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 250);

	// What you dragged, by the number of the row, and the sealed packages that you opened. A write
	// takes them along, and the line starts again from the note.
	const dragged = new SvelteMap<number, number>();
	const opened = new SvelteSet<number>();
	function forget() {
		dragged.clear();
		opened.clear();
	}

	const line = $derived(openLineOf(packages, loose));
	const rowAt = (at: number) => packages.find((one) => one.at === at);
	// A count that you opened is 1 less, and its package is a bar, full.
	const sealed = $derived(
		line.sealed
			.map((count) => ({ ...count, ats: count.ats.filter((at) => !opened.has(at)) }))
			.filter((count) => count.ats.length)
	);
	const bars = $derived(
		[
			...line.bars,
			...[...opened].flatMap((at) => {
				const one = rowAt(at);
				return one ? [barOf(one)] : [];
			})
		].sort((a, b) => (a.useBy ?? '9999').localeCompare(b.useBy ?? '9999') || a.at - b.at)
	);

	const leftOf = (bar: PackageBar) => dragged.get(bar.at) ?? bar.left;
	const show = (bar: PackageBar) => {
		const left = leftOf(bar);
		return left > 0 ? showAmount(left, bar.unit) : 'None';
	};

	// All rows of the food item together, with your drags, against the low line.
	const perUnit = (bar: PackageBar) => measure({ factor: 1, unit: bar.unit, text: '' }).value;
	const has = $derived(
		(level?.has ?? 0) +
			bars.reduce((sum, bar) => sum + (leftOf(bar) - bar.left) * perUnit(bar), 0)
	);
	const isLow = $derived(level !== null && has <= level.low);

	const showDate = (useBy: string | null) => useBy ?? 'No date';
	const percent = (bar: PackageBar) => `${(leftOf(bar) / bar.size) * 100}%`;

	// The rows that your drags change, in the sequence of the bars.
	function changes() {
		return bars.flatMap((bar) => {
			const left = dragged.get(bar.at);
			const one = rowAt(bar.at);
			if (left === undefined || left === bar.left || !one) return [];
			return [{ at: bar.at, stock: stockAt(one.stock, bar, left) }];
		});
	}

	// One "Done" writes each package that you dragged. With no change, it writes nothing.
	function done() {
		const changed = changes();
		if (!changed.length) return oncancel();
		onwrite(changed, [], true);
		forget();
	}

	// The buttons that write at once take your drags along.
	function write(more: { at: number; stock: Stock }[], added: Stock[] = []) {
		const changed = changes().filter((one) => !more.some((other) => other.at === one.at));
		onwrite([...changed, ...more], added, false);
		forget();
	}

	// "−" makes one package of the count an empty row, and "+" adds one with its size and date.
	function less(ats: number[]) {
		const one = rowAt(ats.at(-1) ?? -1);
		if (one) write([{ at: one.at, stock: stockAt(one.stock, barOf(one), 0) }]);
	}

	function more(ats: number[]) {
		const one = rowAt(ats[0]);
		if (one) write([], [sealedLike(one.stock)]);
	}

	// A package that you found has no date yet.
	function addPackage() {
		if (last) write([], [sealedLike({ ...last, place }, null)]);
	}

	// The bar slides to 0, and then the empty package goes out of the line.
	async function usedUp(bar: PackageBar) {
		dragged.set(bar.at, 0);
		if (duration) await new Promise((done) => setTimeout(done, duration));
		const one = rowAt(bar.at);
		if (one) write([{ at: bar.at, stock: stockAt(one.stock, bar, 0) }]);
	}

	// A press at a point of a bar puts the package there. The drag continues from that point.
	function setAt(bar: PackageBar, track: HTMLElement, clientX: number) {
		const box = track.getBoundingClientRect();
		dragged.set(bar.at, snap(((clientX - box.left) / box.width) * bar.size, bar));
	}

	function press(bar: PackageBar, event: PointerEvent) {
		if (event.button !== 0) return;
		const track = event.currentTarget as HTMLElement;
		track.setPointerCapture(event.pointerId);
		setAt(bar, track, event.clientX);
	}

	function drag(bar: PackageBar, event: PointerEvent) {
		const track = event.currentTarget as HTMLElement;
		if (track.hasPointerCapture(event.pointerId)) setAt(bar, track, event.clientX);
	}

	function key(bar: PackageBar, event: KeyboardEvent) {
		const left = leftOf(bar);
		const moves: Record<string, number> = {
			ArrowLeft: left - bar.step,
			ArrowDown: left - bar.step,
			ArrowRight: left + bar.step,
			ArrowUp: left + bar.step,
			Home: 0,
			End: bar.size
		};
		if (!(event.key in moves)) return;
		event.preventDefault();
		dragged.set(bar.at, snap(moves[event.key], bar));
	}
</script>

<!--
	An open line: the ink panel of the first Larder design. The sealed packages are counts, and each
	open package has its own bar, as long as the package.
-->
<div class="wfd-gauge" class:wfd-gauge--low={isLow}>
	<div class="wfd-gauge__top">
		<h3 class="wfd-gauge__name">{name}</h3>
		<p class="wfd-gauge__note">{place}</p>
	</div>

	{#if sealed.length}
		<ul class="wfd-gauge__list" aria-label="Sealed packages">
			{#each sealed as count (`${count.useBy}|${count.sizeText}`)}
				<li class="wfd-gauge__count" transition:slide={{ duration }}>
					<button
						class="wfd-gauge__open"
						type="button"
						aria-label="Open one of {count.ats.length} sealed, {showDate(count.useBy)}"
						onclick={() => opened.add(count.ats[0])}
					>
						{#key count.ats.length}
							<span class="wfd-gauge__number wfd-number">{count.ats.length}</span>
						{/key}
						<span>sealed · {showDate(count.useBy)}</span>
					</button>
					<button
						class="wfd-gauge__step"
						type="button"
						aria-label="One package less, {showDate(count.useBy)}"
						onclick={() => less(count.ats)}>−</button
					>
					<button
						class="wfd-gauge__step"
						type="button"
						aria-label="One package more, {showDate(count.useBy)}"
						onclick={() => more(count.ats)}>+</button
					>
					<button
						class="wfd-gauge__edit"
						type="button"
						aria-label="Place, date, and low line, {showDate(count.useBy)}"
						onclick={() => ondetails(count.ats[0])}>Edit</button
					>
				</li>
			{/each}
		</ul>
	{/if}

	{#each bars as bar (bar.at)}
		<div class="wfd-gauge__package" transition:slide={{ duration }}>
			<div class="wfd-gauge__head">
				<span class="wfd-gauge__date wfd-label">{showDate(bar.useBy)}</span>
				<output class="wfd-gauge__amount wfd-number">{show(bar)}</output>
			</div>
			<!-- A drag to the side on a phone must not open the side panel of Obsidian. -->
			<div
				class="wfd-gauge__track"
				role="slider"
				tabindex="0"
				aria-label="Left in the package of {name}, {showDate(bar.useBy)}"
				aria-valuemin={0}
				aria-valuemax={bar.size}
				aria-valuenow={leftOf(bar)}
				aria-valuetext={show(bar)}
				style:--level={percent(bar)}
				onpointerdown={(event) => press(bar, event)}
				onpointermove={(event) => drag(bar, event)}
				onkeydown={(event) => key(bar, event)}
				ontouchstart={(event) => event.stopPropagation()}
				ontouchmove={(event) => event.stopPropagation()}
			>
				<span class="wfd-gauge__fill"></span>
				<span class="wfd-gauge__handle"></span>
			</div>
			<div class="wfd-gauge__scale wfd-label">
				<span aria-hidden="true">0</span>
				<button class="wfd-gauge__edit" type="button" onclick={() => usedUp(bar)}>Used up</button>
				<button
					class="wfd-gauge__edit"
					type="button"
					aria-label="Place, date, and low line, {showDate(bar.useBy)}"
					onclick={() => ondetails(bar.at)}>Edit</button
				>
				<span aria-hidden="true">{showAmount(bar.size, bar.unit)}</span>
			</div>
		</div>
	{/each}

	<div class="wfd-gauge__actions">
		<Button onclick={addPackage}>Add package</Button>
		<Button kind="olive" onclick={done}>Done</Button>
	</div>
</div>

<style>
	.wfd-gauge {
		--gauge-track: color-mix(in oklab, var(--wfd-on-ink) 22%, var(--wfd-ink));
		--gauge-line: color-mix(in oklab, var(--wfd-on-ink) 40%, var(--wfd-ink));
		--gauge-fill: var(--wfd-on-ink);

		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
		padding: 16px;
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-ink);
		color: var(--wfd-on-ink);
	}

	.wfd-gauge--low {
		--gauge-fill: var(--wfd-amber);
	}

	.wfd-gauge__top {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 12px;
		align-items: baseline;
		justify-content: space-between;
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

	.wfd-gauge__list {
		display: grid;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* A count: a tap on the text opens one package, and "−" and "+" change the number. */
	.wfd-gauge__count {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto auto auto;
		gap: 6px;
		align-items: center;
		padding-block-end: 8px;
		border-block-end: 1px solid var(--gauge-line);
	}

	button.wfd-gauge__open,
	button.wfd-gauge__step,
	button.wfd-gauge__edit {
		block-size: auto;
		min-block-size: 44px;
		border: 0;
		border-radius: var(--wfd-radius-button);
		background: none;
		box-shadow: none;
		color: var(--wfd-on-ink);
		font-family: inherit;
		cursor: pointer;

		&:focus-visible {
			outline: 2px solid var(--wfd-on-ink);
			outline-offset: 2px;
		}
	}

	button.wfd-gauge__open {
		display: flex;
		gap: 8px;
		align-items: baseline;
		justify-content: start;
		min-inline-size: 0;
		padding: 0;
		font-size: 15px;
		font-weight: 600;
		text-align: start;
	}

	.wfd-gauge__number {
		display: inline-block;
		font-size: 24px;
		animation: pop 0.25s ease-out;
	}

	button.wfd-gauge__step {
		inline-size: 44px;
		border: 2px solid var(--gauge-line);
		font-size: 22px;
		font-weight: 700;
	}

	button.wfd-gauge__edit {
		padding: 0 6px;
		font-size: 14px;
		font-weight: 600;
		text-decoration: underline;
	}

	.wfd-gauge__package {
		display: grid;
		gap: 6px;
	}

	.wfd-gauge__head {
		display: flex;
		gap: 12px;
		align-items: baseline;
		justify-content: space-between;
	}

	.wfd-gauge__date {
		opacity: 0.8;
	}

	.wfd-gauge__amount {
		font-size: 32px;
		line-height: 1;
		white-space: nowrap;
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

	.wfd-gauge__fill {
		inline-size: var(--level);
		background: var(--gauge-fill);
		transition: inline-size 0.25s ease-out;
	}

	/* While you drag, the bar follows the thumb with no delay. */
	.wfd-gauge__track:active .wfd-gauge__fill {
		transition: none;
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
		transition:
			inset-inline-start 0.25s ease-out,
			scale 0.1s ease-out;
	}

	.wfd-gauge__track:active .wfd-gauge__handle {
		scale: 1.3 1.1;
		transition: scale 0.1s ease-out;
	}

	.wfd-gauge__scale {
		display: flex;
		gap: 8px;
		align-items: center;
		justify-content: space-between;
	}

	.wfd-gauge__actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin-block-start: 4px;
	}

	/* On ink, a quiet button has the colour of the text. */
	.wfd-gauge :global(button.wfd-button--quiet) {
		border-color: var(--wfd-on-ink);
		background: none;
		color: var(--wfd-on-ink);
	}

	.wfd-gauge :global(button.wfd-button:focus-visible) {
		outline-color: var(--wfd-on-ink);
	}

	/* A count that changes makes a small pop, so that you see that the tap counted. */
	@keyframes pop {
		40% {
			scale: 1.35;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-gauge__number {
			animation: none;
		}

		.wfd-gauge__fill,
		.wfd-gauge__handle {
			transition: none;
		}
	}
</style>
