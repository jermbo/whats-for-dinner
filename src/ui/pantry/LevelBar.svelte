<script lang="ts">
	import type { Bar } from '../../pantry/level';

	// With no bar, the track is dashed: the pantry has none of this food.
	let { bar }: { bar: Bar | null } = $props();

	const percent = (part: number) => `${Math.min(100, Math.max(0, part * 100))}%`;
</script>

<!--
	The level of a food item, with all its places. The light part is the food in the other places.
	The dark part is the food in this place: it is last, as in the open row. The tick is the low
	line. Below the line, the bar is amber.
-->
<span
	class="wfd-level"
	class:wfd-level--low={bar?.isLow}
	class:wfd-level--none={!bar}
	style:--here={percent(bar?.here ?? 0)}
	style:--others={percent(bar?.others ?? 0)}
	style:--low={percent(bar?.low ?? 0)}
	aria-hidden="true"
>
	{#if bar}
		<span class="wfd-level__others"></span>
		<span class="wfd-level__here"></span>
		<span class="wfd-level__tick"></span>
	{/if}
</span>

<style>
	.wfd-level {
		--fill: var(--wfd-ink);
		--fill-others: var(--wfd-ink-3);

		position: relative;
		display: flex;
		block-size: 8px;
		background: var(--wfd-track);
	}

	.wfd-level--low {
		--fill: var(--wfd-amber);
		--fill-others: color-mix(in oklab, var(--wfd-amber) 45%, var(--wfd-track));
	}

	/* A dashed track is an empty place. */
	.wfd-level--none {
		background: repeating-linear-gradient(90deg, var(--wfd-track) 0 4px, transparent 4px 8px);
	}

	.wfd-level__here,
	.wfd-level__others {
		flex: none;
		transition: inline-size 0.3s ease-out;
	}

	.wfd-level__here {
		inline-size: var(--here);
		background: var(--fill);
	}

	.wfd-level__others {
		inline-size: var(--others);
		background: var(--fill-others);
	}

	.wfd-level__tick {
		position: absolute;
		inset-block: -4px;
		inset-inline-start: var(--low);
		inline-size: 2px;
		background: var(--wfd-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-level__here,
		.wfd-level__others {
			transition: none;
		}
	}
</style>
