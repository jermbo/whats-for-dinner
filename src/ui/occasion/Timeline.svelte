<script lang="ts">
	import { clockToMinutes, minutesToClock, showLength } from '../../occasion/clock';
	import type { PlanDish, Urgency } from '../../occasion/cook-plan';
	import { percentOf, timelineOf } from '../../occasion/timeline';

	// The day on one axis of hours: a bar for each dish, from its start to the end of its time, with a
	// line for the serve time and a line for now. You see at one look what overlaps and what is late.
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

	const view = $derived(timelineOf(plan, serve));
	const serveAt = $derived(serve === null ? null : clockToMinutes(serve));
	const nowAt = $derived(live && now >= view.span.from && now <= view.span.to ? now : null);
	const at = (minutes: number) => `${percentOf(minutes, view.span)}%`;
</script>

<div class="wfd-line">
	<div class="wfd-line__plot">
		<div class="wfd-line__axis" aria-hidden="true">
			{#each view.span.ticks as tick (tick)}
				<span class="wfd-line__tick wfd-label" style:inset-inline-start={at(tick)}>
					{minutesToClock(tick)}
				</span>
			{/each}
		</div>

		<!-- The rules of the hours, the serve time, and now run across all the bars. -->
		<div class="wfd-line__rules" aria-hidden="true">
			{#each view.span.ticks as tick (tick)}
				<span class="wfd-line__rule" style:inset-inline-start={at(tick)}></span>
			{/each}
			{#if serveAt !== null}
				<span class="wfd-line__serve" style:inset-inline-start={at(serveAt)}>
					<span class="wfd-line__tag wfd-label">Serve</span>
				</span>
			{/if}
			{#if nowAt !== null}
				<span class="wfd-line__now" style:inset-inline-start={at(nowAt)}>
					<span class="wfd-line__tag wfd-label">Now</span>
				</span>
			{/if}
		</div>

		<ul class="wfd-line__rows">
			{#each view.bars as bar (bar.dish.index)}
				{@const urgency = urgencyOf(bar.dish)}
				{@const cooking = started.includes(bar.dish.index)}
				<li class="wfd-line__row">
					<span class="wfd-line__who">
						<span class="wfd-line__name">{bar.dish.name}</span>
						<span class="wfd-line__when wfd-label">
							{minutesToClock(bar.from)}–{minutesToClock(bar.to)} · {bar.dish.guessed ? '~' : ''}{showLength(
								bar.dish.minutes ?? 0
							)}
						</span>
					</span>
					<span class="wfd-line__track">
						{#if bar.dish.entry}
							<button
								class="wfd-line__bar wfd-line__bar--{urgency}"
								class:wfd-line__bar--cooking={cooking}
								type="button"
								style:inset-inline-start={at(bar.from)}
								style:inline-size="calc({at(bar.to)} - {at(bar.from)})"
								aria-label="Open {bar.dish.name}"
								onclick={() => onopen(bar.dish.index)}
							></button>
						{:else}
							<span
								class="wfd-line__bar wfd-line__bar--{urgency} wfd-line__bar--task"
								style:inset-inline-start={at(bar.from)}
								style:inline-size="calc({at(bar.to)} - {at(bar.from)})"
							></span>
						{/if}
					</span>
				</li>
			{/each}
		</ul>
	</div>

	{#if view.unplaced.length}
		<p class="wfd-line__unplaced wfd-label">
			No time yet: {view.unplaced.map((one) => one.name).join(', ')}
		</p>
	{/if}
	{#if !view.bars.length}
		<p class="wfd-line__unplaced">Set a time for a dish, and its bar shows here.</p>
	{/if}
</div>

<style>
	.wfd-line {
		display: grid;
		gap: var(--wfd-space-stack);
	}

	/* The plot has room at both sides, so that the first and the last hour mark do not clip. */
	.wfd-line__plot {
		position: relative;
		display: grid;
		gap: var(--wfd-space-group);
		margin-inline: var(--wfd-space-section);
		padding-block-end: var(--wfd-space-section);
	}

	.wfd-line__axis {
		position: relative;
		block-size: 1.25rem;
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
		inset-inline: 0;
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

	.wfd-line__tag {
		position: absolute;
		inset-block-end: 0;
		translate: -50% 100%;
		padding: 1px var(--wfd-space-group);
		border-radius: var(--wfd-radius-sticker);
		background: var(--wfd-color-text);
		color: var(--wfd-color-surface);
	}

	.wfd-line__now .wfd-line__tag {
		background: var(--wfd-color-danger);
		color: var(--wfd-color-on-danger);
	}

	.wfd-line__rows {
		position: relative;
		display: grid;
		gap: var(--wfd-space-stack);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-line__row {
		display: grid;
		gap: var(--wfd-space-tight);
	}

	.wfd-line__who {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--wfd-space-group);
		align-items: baseline;
		margin-inline-start: calc(-1 * var(--wfd-space-section));
	}

	.wfd-line__name {
		font-size: var(--wfd-font-size-name);
		font-weight: 600;
		line-height: var(--wfd-line-height-display);
	}

	.wfd-line__when {
		color: var(--wfd-color-text-muted);
	}

	.wfd-line__track {
		position: relative;
		block-size: 28px;
	}

	.wfd-line__bar {
		position: absolute;
		inset-block: 0;
		min-inline-size: 6px;
		padding: 0;
		border: 0;
		border-radius: var(--wfd-radius-sticker);
		background: var(--wfd-color-selected);
		box-shadow: none;
	}

	button.wfd-line__bar {
		block-size: auto;
		cursor: pointer;

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
		background: var(--wfd-color-primary);
	}

	.wfd-line__bar--soon {
		background: var(--wfd-color-warning);
	}

	.wfd-line__bar--due {
		background: var(--wfd-color-danger);
	}

	.wfd-line__unplaced {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}
</style>
