<script lang="ts">
	import { clockToMinutes, minutesToClock, showLength } from '../../occasion/clock';
	import type { PlanDish, Urgency } from '../../occasion/cook-plan';
	import { marksOf, percentOf, timelineOf, type Bar } from '../../occasion/timeline';

	// The whole day on one axis of hours: a bar for each dish, with a line for the serve time and a
	// line for now. The axis does not change when a dish is done. A done dish keeps its bar, muted,
	// with a check, and it ends at the hour in which you finished it. You see at one look what is
	// done, what runs, what comes, and what is late.
	//
	// The chart measures its own width. A wide chart has the names in a column at the left, as a
	// Gantt chart. A narrow chart has each name above its bar. The hour marks follow the width, so
	// that their labels never touch.
	type Props = {
		plan: PlanDish[];
		serve: string | null;
		now: number;
		// The day of the occasion is today. Before it, there is no line for now.
		live: boolean;
		started: number[];
		urgencyOf: (one: PlanDish) => Urgency;
		onopen: (index: number) => void;
	};
	let { plan, serve, now, live, started, urgencyOf, onopen }: Props = $props();

	// From 640 px on, the names go in a column. Before the first measure, the chart is narrow.
	const WIDE_PX = 640;
	const NAMES_PX = 176;
	const EDGE_PX = 16;
	// Two tags that are nearer than this are one tag.
	const TAG_PX = 96;
	let width = $state(0);
	const wide = $derived(width >= WIDE_PX);
	// The width of the axis: the chart without its names and its two edges.
	const plotPx = $derived(Math.max(1, width - 2 * EDGE_PX - (wide ? NAMES_PX : 0)));

	const view = $derived(timelineOf(plan, serve, live ? now : null));
	const marks = $derived(marksOf(view.span, plotPx));
	const serveAt = $derived(serve === null ? null : clockToMinutes(serve));
	const at = (minutes: number) => `${percentOf(minutes, view.span)}%`;
	const length = (bar: Bar) => `calc(${at(bar.to)} - ${at(bar.from)})`;

	// A tag near an edge grows toward the inside, so that it stays in the card.
	function shift(minutes: number) {
		const share = percentOf(minutes, view.span);
		return share > 80 ? '-100% 0' : share < 20 ? '0 0' : '-50% 0';
	}
	const merged = $derived(
		live &&
			serveAt !== null &&
			(Math.abs(percentOf(now, view.span) - percentOf(serveAt, view.span)) / 100) * plotPx < TAG_PX
	);

	// How much of an open bar is behind you: the share between its start and now.
	function elapsed(bar: Bar) {
		if (!live || bar.done || bar.to <= bar.from) return 0;
		return Math.min(100, Math.max(0, ((now - bar.from) / (bar.to - bar.from)) * 100));
	}

	const doneCount = $derived(view.bars.filter((bar) => bar.done).length);
</script>

{#snippet who(bar: Bar)}
	<span class="wfd-line__name">
		{#if bar.done}<span class="wfd-line__check" aria-hidden="true">✓</span>{/if}
		{bar.dish.name}
	</span>
	<span class="wfd-line__when wfd-label">
		{#if bar.done && bar.dish.doneAt}
			Done {bar.dish.doneAt}
		{:else if bar.done}
			Done
		{:else}
			{minutesToClock(bar.from)}–{minutesToClock(bar.to)}
		{/if}
		· {bar.dish.guessed ? '~' : ''}{showLength(bar.dish.minutes ?? 0)}
	</span>
{/snippet}

<div
	class="wfd-line"
	class:wfd-line--wide={wide}
	style:--names={wide ? `${NAMES_PX}px` : '0px'}
	style:--edge="{EDGE_PX}px"
	bind:clientWidth={width}
>
	<div class="wfd-line__plot">
		<div class="wfd-line__axis" aria-hidden="true">
			{#each marks.marks as mark (mark)}
				<span class="wfd-line__tick wfd-label" style:inset-inline-start={at(mark)}>
					{minutesToClock(mark)}
				</span>
			{/each}
		</div>

		<!-- The rules of the hours, the serve time, and now run across all the bars. The tags are in
		two rows below the bars, so that they never lie on each other. -->
		<div class="wfd-line__rules" aria-hidden="true">
			{#each marks.rules as rule (rule)}
				<span class="wfd-line__rule" style:inset-inline-start={at(rule)}></span>
			{/each}
			{#if serveAt !== null}
				<span class="wfd-line__serve" style:inset-inline-start={at(serveAt)}>
					{#if !merged}
						<span class="wfd-line__tag wfd-line__tag--serve wfd-label" style:translate={shift(serveAt)}>
							Serve
						</span>
					{/if}
				</span>
			{/if}
			{#if live}
				<span class="wfd-line__now" style:inset-inline-start={at(now)}>
					<span class="wfd-line__tag wfd-line__tag--now wfd-label" style:translate={shift(now)}>
						{merged ? 'Now · Serve' : 'Now'}
					</span>
				</span>
			{/if}
		</div>

		<ul class="wfd-line__rows">
			{#each view.bars as bar (bar.dish.index)}
				{@const urgency = urgencyOf(bar.dish)}
				{@const cooking = started.includes(bar.dish.index)}
				{@const opens = !bar.done && bar.dish.entry !== null}
				<li class="wfd-line__row" class:wfd-line__row--done={bar.done}>
					<!-- The name opens the dish too: it is a larger target than a short bar. -->
					{#if opens}
						<button class="wfd-line__who" type="button" onclick={() => onopen(bar.dish.index)}>
							{@render who(bar)}
						</button>
					{:else}
						<span class="wfd-line__who">{@render who(bar)}</span>
					{/if}
					<span class="wfd-line__track">
						{#if bar.done}
							<span
								class="wfd-line__bar wfd-line__bar--done"
								style:inset-inline-start={at(bar.from)}
								style:inline-size={length(bar)}
							></span>
						{:else if opens}
							<button
								class="wfd-line__bar wfd-line__bar--{urgency}"
								class:wfd-line__bar--cooking={cooking}
								type="button"
								style:inset-inline-start={at(bar.from)}
								style:inline-size={length(bar)}
								style:--elapsed="{elapsed(bar)}%"
								aria-label="Open {bar.dish.name}"
								onclick={() => onopen(bar.dish.index)}
							></button>
						{:else}
							<span
								class="wfd-line__bar wfd-line__bar--{urgency} wfd-line__bar--task"
								style:inset-inline-start={at(bar.from)}
								style:inline-size={length(bar)}
							></span>
						{/if}
					</span>
				</li>
			{/each}
		</ul>
	</div>

	{#if doneCount}
		<p class="wfd-line__legend wfd-label">{doneCount} of {plan.length} done</p>
	{/if}
	{#if view.unplaced.length}
		<p class="wfd-line__legend wfd-label">
			No time yet: {view.unplaced.map((one) => one.name).join(', ')}
		</p>
	{/if}
	{#if !view.bars.length}
		<p class="wfd-line__legend">Set a time for a dish, and its bar shows here.</p>
	{/if}
</div>

<style>
	.wfd-line {
		display: grid;
		gap: var(--wfd-space-stack);
		min-inline-size: 0;
	}

	/* The plot has room at both sides, so that the first and the last hour mark do not clip. The
	 * two rows at the foot are for the tags of now and of the serve time. */
	.wfd-line__plot {
		position: relative;
		display: grid;
		gap: var(--wfd-space-group);
		margin-inline: var(--edge, 16px);
		padding-block-end: 3.5rem;
		min-inline-size: 0;
	}

	.wfd-line__axis {
		position: relative;
		block-size: 1.25rem;
		margin-inline-start: var(--names);
	}

	.wfd-line__tick {
		position: absolute;
		translate: -50% 0;
		color: var(--wfd-color-text-muted);
	}

	/* The rules sit behind the bars, from the axis to the foot of the plot. */
	.wfd-line__rules {
		position: absolute;
		inset-block: 1.5rem 0;
		inset-inline: var(--names) 0;
		pointer-events: none;
	}

	.wfd-line__rule {
		position: absolute;
		inset-block: 0;
		border-inline-start: var(--wfd-border-thin) solid var(--wfd-color-track);
	}

	.wfd-line__serve,
	.wfd-line__now {
		position: absolute;
		inset-block: 0;
		z-index: 1;
		border-inline-start: var(--wfd-border) solid var(--wfd-color-text);
	}

	.wfd-line__serve {
		border-inline-start-style: dashed;
	}

	.wfd-line__now {
		border-color: var(--wfd-color-danger);
	}

	/* "Now" is in the lower row, and "Serve" is above it, so that two lines near each other have
	 * two tags in two rows. A tag is on the line, and it grows toward the inside of the card. */
	.wfd-line__tag {
		position: absolute;
		padding: 1px var(--wfd-space-group);
		border-radius: var(--wfd-radius-sticker);
		background: var(--wfd-color-text);
		color: var(--wfd-color-surface);
		white-space: nowrap;
	}

	.wfd-line__tag--now {
		inset-block-end: 0;
		background: var(--wfd-color-danger);
		color: var(--wfd-color-on-danger);
	}

	.wfd-line__tag--serve {
		inset-block-end: 1.75rem;
	}

	.wfd-line__rows {
		position: relative;
		display: grid;
		gap: var(--wfd-space-stack);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* Narrow: the name is above its bar. Wide: the name is in a column, and the bar is at its side. */
	.wfd-line__row {
		display: grid;
		gap: var(--wfd-space-tight);
		min-inline-size: 0;
	}

	.wfd-line--wide .wfd-line__row {
		grid-template-columns: var(--names) minmax(0, 1fr);
		align-items: center;
		gap: 0;
	}

	.wfd-line__who {
		display: grid;
		gap: 0;
		justify-items: start;
		min-inline-size: 0;
		margin-inline-start: calc(-1 * var(--edge, 16px));
		padding-inline-end: var(--wfd-space-group);
		text-align: start;
	}

	.wfd-line--wide .wfd-line__who {
		margin-inline-start: 0;
	}

	button.wfd-line__who {
		inline-size: 100%;
		block-size: auto;
		min-block-size: var(--wfd-control-min);
		padding-block: 0;
		padding-inline-start: 0;
		border: 0;
		border-radius: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: var(--wfd-focus-offset);
		}
	}

	/* A long name ends in "…" on one line. The label has its own line, in one piece. */
	.wfd-line__name {
		max-inline-size: 100%;
		overflow: hidden;
		font-size: var(--wfd-font-size-name);
		font-weight: 600;
		line-height: var(--wfd-line-height-display);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.wfd-line__check {
		color: var(--wfd-color-primary);
	}

	.wfd-line__when {
		max-inline-size: 100%;
		overflow: hidden;
		color: var(--wfd-color-text-muted);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* A done dish is quiet: its name is struck, and its bar is the colour of a track. */
	.wfd-line__row--done .wfd-line__name {
		color: var(--wfd-color-text-muted);
		text-decoration: line-through;
	}

	.wfd-line__row--done .wfd-line__check {
		display: inline-block;
		text-decoration: none;
	}

	.wfd-line__track {
		position: relative;
		block-size: 28px;
		min-inline-size: 0;
	}

	/* A short dish still has a bar that you can see: 12 px at the least. */
	.wfd-line__bar {
		position: absolute;
		inset-block: 0;
		min-inline-size: 12px;
		padding: 0;
		border: 0;
		border-radius: var(--wfd-radius-sticker);
		background: var(--wfd-color-selected);
		box-shadow: none;
	}

	button.wfd-line__bar {
		block-size: auto;
		cursor: pointer;

		/* The share of the bar that is behind you is darker, so a dish that runs shows how far it is. */
		background-image: linear-gradient(
			to right,
			color-mix(in srgb, var(--wfd-color-frame) 45%, transparent) var(--elapsed, 0%),
			transparent var(--elapsed, 0%)
		);

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: var(--wfd-focus-offset);
		}
	}

	/* A dish with no recipe is a hatched bar: a task, with nothing to open. */
	.wfd-line__bar--task {
		background: repeating-linear-gradient(
			135deg,
			var(--wfd-color-selected) 0 6px,
			transparent 6px 10px
		);
	}

	.wfd-line__bar--cooking {
		background-color: var(--wfd-color-primary);
	}

	.wfd-line__bar--soon {
		background-color: var(--wfd-color-warning);
	}

	.wfd-line__bar--due {
		background-color: var(--wfd-color-danger);
	}

	.wfd-line__bar--done {
		background: var(--wfd-color-track);
	}

	.wfd-line__legend {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}
</style>
