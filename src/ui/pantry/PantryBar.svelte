<script lang="ts">
	import type { BarPart } from '../../pantry/pantry-bar';

	// With no part, the track is dashed: the pantry has none of this food.
	let { parts, low }: { parts: BarPart[]; low: boolean } = $props();
</script>

<!--
	One part for each package of the food item. The packages of this place are first and dark, the
	packages of other places are grey. A food item that is low is amber. The line tells the total
	and "low" in text, so the bar is only a picture.
-->
<span class="wfd-pbar" class:wfd-pbar--low={low} class:wfd-pbar--none={!parts.length} aria-hidden="true">
	{#each parts as part (part.key)}
		<span
			class="wfd-pbar__part"
			class:wfd-pbar__part--here={part.here}
			style:flex-grow={part.weight}
		>
			<span class="wfd-pbar__fill" style:inline-size="{part.fill * 100}%"></span>
		</span>
	{/each}
</span>

<style>
	.wfd-pbar {
		--fill: var(--wfd-ink);
		--fill-away: var(--wfd-ink-3);

		display: flex;
		gap: 3px;
		/* A bin makes the bar thin. */
		block-size: var(--wfd-pbar-size, 8px);
	}

	.wfd-pbar--low {
		--fill: var(--wfd-amber);
		--fill-away: color-mix(in oklab, var(--wfd-amber) 45%, var(--wfd-track));
	}

	/* A dashed track is an empty place. */
	.wfd-pbar--none {
		background: repeating-linear-gradient(90deg, var(--wfd-track) 0 4px, transparent 4px 8px);
	}

	.wfd-pbar__part {
		display: flex;
		flex-basis: 0;
		min-inline-size: 6px;
		background: var(--wfd-track);
		transition: flex-grow 0.3s ease-out;
	}

	.wfd-pbar__fill {
		background: var(--fill-away);
		transition: inline-size 0.3s ease-out;
	}

	.wfd-pbar__part--here .wfd-pbar__fill {
		background: var(--fill);
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-pbar__part,
		.wfd-pbar__fill {
			transition: none;
		}
	}
</style>
