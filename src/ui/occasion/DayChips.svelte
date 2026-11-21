<script lang="ts">
	import type { Urgency } from '../../occasion/cook-plan';
	import TimerBadge, { type TimerInfo } from './TimerBadge.svelte';

	// The row of "Cook day": the views, and one chip for each dish with a recipe. A dish that you
	// opened is olive, with a line of its progress, and a dish with a running timer shows the timer.
	// A dish that must start soon is amber, and a dish that is late is tomato.
	export type DayKey = 'schedule' | 'timeline' | 'get-out' | number;
	export type DayChip = {
		key: DayKey;
		label: string;
		start: string | null;
		urgency: Urgency;
		cooking: boolean;
		// From 0 to 1: how far the dish is through its pages.
		fraction: number;
		timers: TimerInfo[];
	};
	type Props = { chips: DayChip[]; active: DayKey; onpick: (key: DayKey) => void };
	let { chips, active, onpick }: Props = $props();
</script>

<div class="wfd-chips" role="group" aria-label="Views and dishes">
	{#each chips as chip (chip.key)}
		<button
			class="wfd-chips__chip wfd-chips__chip--{chip.urgency}"
			class:wfd-chips__chip--on={chip.key === active}
			class:wfd-chips__chip--cooking={chip.cooking}
			style:--progress="{chip.fraction * 100}%"
			type="button"
			aria-pressed={chip.key === active}
			onclick={() => onpick(chip.key)}
		>
			<span class="wfd-chips__name">{chip.label}</span>
			{#if chip.timers.length}
				<TimerBadge timers={chip.timers} />
			{:else if chip.start && !chip.cooking}
				<span class="wfd-chips__start wfd-number">{chip.start}</span>
			{/if}
		</button>
	{/each}
</div>

<style>
	.wfd-chips {
		display: flex;
		flex: none;
		gap: var(--wfd-space-group);
		overflow-x: auto;
		padding-block-end: var(--wfd-space-tight);
		scrollbar-width: none;
	}

	button.wfd-chips__chip {
		display: flex;
		flex: none;
		gap: var(--wfd-space-group);
		align-items: center;
		max-inline-size: 80cqi;
		block-size: auto;
		min-block-size: var(--wfd-control-min);
		padding: 0 var(--wfd-space-inset);
		border: var(--wfd-border) solid var(--wfd-color-on-frame);
		border-radius: var(--wfd-radius-pill);
		background: none;
		box-shadow: none;
		color: var(--wfd-color-on-frame);
		font-family: inherit;
		font-size: var(--wfd-font-size-text);
		font-weight: 600;
		cursor: pointer;
		transition:
			background-color var(--wfd-chip-motion),
			color var(--wfd-chip-motion);

		&:focus-visible {
			outline: var(--wfd-border) solid currentcolor;
			outline-offset: var(--wfd-focus-offset);
		}
	}

	button.wfd-chips__chip--on {
		background: var(--wfd-color-on-frame);
		color: var(--wfd-color-frame);
	}

	/* A dish that you opened: an olive edge, and a line at the foot that fills as you go. */
	button.wfd-chips__chip--cooking {
		border-color: var(--wfd-color-primary);
		background-image: linear-gradient(var(--wfd-color-primary), var(--wfd-color-primary));
		background-position: left bottom;
		background-repeat: no-repeat;
		background-size: var(--progress, 0%) 5px;
	}

	button.wfd-chips__chip--soon {
		border-color: var(--wfd-color-warning);
		background: var(--wfd-color-warning);
		color: var(--wfd-color-on-warning);
	}

	button.wfd-chips__chip--due {
		border-color: var(--wfd-color-danger);
		background: var(--wfd-color-danger);
		color: var(--wfd-color-on-danger);
	}

	/* A long name ends in "…", and the start stays in view. */
	.wfd-chips__name {
		min-inline-size: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.wfd-chips__start {
		flex: none;
		font-size: var(--wfd-font-size-small);
	}
</style>
