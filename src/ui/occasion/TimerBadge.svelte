<script lang="ts">
	import { cookTimerClock } from '../../cook/cook-pages';

	// The sign that a dish has a running timer: a pulsing dot and the time that is left. With more
	// than one timer, the count. The badge fills from the left as the time goes, like a pill that
	// charges: with many timers, it shows the one that ends first. A timer that rang shows "Time is up" in the colour of danger. The
	// badge only tells. You stop a timer inside the dish, in Cook Mode.
	export type TimerInfo = { rung: boolean; left: number; total: number };
	type Props = { timers: TimerInfo[] };
	let { timers }: Props = $props();

	const rung = $derived(timers.some((timer) => timer.rung));
	const soonest = $derived([...timers].sort((a, b) => a.left - b.left)[0]);
	const fill = $derived(rung ? 100 : soonest?.total ? (1 - soonest.left / soonest.total) * 100 : 0);
	const text = $derived.by(() => {
		if (rung) return 'Time is up';
		if (timers.length > 1) return `${timers.length} timers`;
		return cookTimerClock(timers[0]?.left ?? 0);
	});
</script>

{#if timers.length}
	<span class="wfd-badge wfd-label" class:wfd-badge--rung={rung} style:--fill="{fill}%" role="timer">
		<span class="wfd-badge__dot" aria-hidden="true"></span>
		<span class="wfd-number">{text}</span>
	</span>
{/if}

<style>
	.wfd-badge {
		display: inline-flex;
		gap: var(--wfd-space-group);
		align-items: center;
		padding: 2px var(--wfd-space-group);
		border: var(--wfd-border-thin) solid currentcolor;
		border-radius: var(--wfd-radius-pill);
		background-image: linear-gradient(
			to right,
			color-mix(in srgb, currentcolor 35%, transparent) var(--fill, 0%),
			transparent var(--fill, 0%)
		);
		white-space: nowrap;
		transition: background-image var(--wfd-motion-change) linear;
	}

	.wfd-badge__dot {
		inline-size: 8px;
		block-size: 8px;
		border-radius: var(--wfd-radius-pill);
		background: currentcolor;
		animation: wfd-badge-pulse calc(4 * var(--wfd-motion-change)) ease-in-out infinite;
	}

	.wfd-badge--rung {
		border-color: var(--wfd-color-danger);
		background: var(--wfd-color-danger);
		color: var(--wfd-color-on-danger);
	}

	@keyframes wfd-badge-pulse {
		50% {
			opacity: 0.25;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-badge__dot {
			animation: none;
		}
	}
</style>
