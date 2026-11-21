<script lang="ts">
	import { cookFraction, cookWhere, type CookProgress } from '../../cook/cook-pages';
	import { showLength } from '../../occasion/clock';
	import type { PlanDish, Urgency } from '../../occasion/cook-plan';
	import Button from '../parts/Button.svelte';
	import Struck from '../parts/Struck.svelte';
	import Tick from '../parts/Tick.svelte';
	import TimerBadge, { type TimerInfo } from './TimerBadge.svelte';

	// The schedule: your dishes in the sequence of their starts. A dish that you opened has an olive
	// edge, the place where you are, and a line of progress. A running timer shows on its dish. A
	// check marks a dish, and "Cook" opens it. A dish with no recipe has the check and no "Cook".
	type Props = {
		plan: PlanDish[];
		started: number[];
		progressOf: (index: number) => CookProgress | undefined;
		timersOf: (index: number) => TimerInfo[];
		urgencyOf: (one: PlanDish) => Urgency;
		onopen: (index: number) => void;
		onready: (index: number, ready: boolean) => void;
	};
	let { plan, started, progressOf, timersOf, urgencyOf, onopen, onready }: Props = $props();

	function detail(one: PlanDish) {
		if (one.dish.ready) return 'Done';
		if (one.minutes === null) return one.entry ? 'Set time' : 'No recipe';
		return `${one.guessed ? '~' : ''}${showLength(one.minutes)}${one.entry ? '' : ' · No recipe'}`;
	}
</script>

<ul class="wfd-schedule">
	{#each plan as one (one.index)}
		{@const cooking = started.includes(one.index) && !one.dish.ready}
		{@const progress = progressOf(one.index)}
		<li
			class="wfd-schedule__row wfd-schedule__row--{urgencyOf(one)}"
			class:wfd-schedule__row--cooking={cooking}
		>
			<button
				class="wfd-schedule__check"
				type="button"
				aria-pressed={one.dish.ready}
				aria-label="{one.name} is ready"
				onclick={() => onready(one.index, !one.dish.ready)}
			>
				<Tick on={one.dish.ready} />
			</button>
			<span class="wfd-schedule__start wfd-number">
				{one.dish.ready ? (one.doneAt ?? '–') : (one.start ?? '–')}
			</span>
			<span class="wfd-schedule__what">
				<span class="wfd-schedule__name"><Struck on={one.dish.ready}>{one.name}</Struck></span>
				<span class="wfd-schedule__detail wfd-label">
					{cooking && progress ? `Cooking · ${cookWhere(progress)}` : detail(one)}
				</span>
				{#if cooking}
					<TimerBadge timers={timersOf(one.index)} />
				{/if}
				{#if cooking && progress}
					<span class="wfd-schedule__bar" aria-hidden="true">
						<span class="wfd-schedule__fill" style:inline-size="{cookFraction(progress) * 100}%"></span>
					</span>
				{/if}
			</span>
			{#if one.entry && !one.dish.ready}
				<Button onclick={() => onopen(one.index)}>{cooking ? 'Continue' : 'Cook'}</Button>
			{/if}
		</li>
	{:else}
		<li class="wfd-schedule__none">You cook no dish on this day.</li>
	{/each}
</ul>

<style>
	.wfd-schedule {
		display: grid;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-schedule__row {
		display: flex;
		gap: var(--wfd-space-group);
		align-items: center;
		padding-block: var(--wfd-space-group);
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-track);
	}

	/* The olive edge is the place where you are: this dish is on the stove. */
	.wfd-schedule__row--cooking {
		margin-inline: calc(-1 * var(--wfd-space-inset));
		padding-inline: calc(var(--wfd-space-inset) - var(--wfd-space-group)) var(--wfd-space-inset);
		border-inline-start: var(--wfd-space-group) solid var(--wfd-color-primary);
		background: color-mix(in srgb, var(--wfd-color-primary) 14%, transparent);
	}

	button.wfd-schedule__check {
		display: grid;
		flex: none;
		place-items: center;
		inline-size: var(--wfd-control-min);
		block-size: var(--wfd-control-min);
		padding: 0;
		border: 0;
		background: none;
		box-shadow: none;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: var(--wfd-focus-inset);
		}
	}

	.wfd-schedule__start {
		flex: none;
		min-inline-size: 3.5ch;
		font-size: var(--wfd-font-size-name);
	}

	.wfd-schedule__row--soon .wfd-schedule__start {
		color: var(--wfd-color-warning);
	}

	.wfd-schedule__row--due .wfd-schedule__start {
		color: var(--wfd-color-danger);
	}

	.wfd-schedule__what {
		display: grid;
		flex: 1;
		gap: var(--wfd-space-tight);
		justify-items: start;
		min-inline-size: 0;
	}

	.wfd-schedule__name {
		max-inline-size: 100%;
		overflow: hidden;
		font-size: var(--wfd-font-size-name);
		font-weight: 600;
		line-height: var(--wfd-line-height-display);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.wfd-schedule__detail {
		color: var(--wfd-color-text-muted);
	}

	.wfd-schedule__bar {
		inline-size: 100%;
		max-inline-size: 14rem;
		block-size: 5px;
		border-radius: var(--wfd-radius-pill);
		background: var(--wfd-color-track);
		overflow: hidden;
	}

	.wfd-schedule__fill {
		display: block;
		block-size: 100%;
		background: var(--wfd-color-primary);
		transition: inline-size var(--wfd-motion-change) var(--wfd-ease-out);
	}

	.wfd-schedule__none {
		padding-block: var(--wfd-space-inset);
		color: var(--wfd-color-text-muted);
	}
</style>
