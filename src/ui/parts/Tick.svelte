<script lang="ts">
	// The round check of a thing that is done: it fills with the accent colour and draws its mark,
	// as a tick in the Shop does. The button around it gives it its name.
	let { on }: { on: boolean } = $props();
</script>

<span class="wfd-tick" class:wfd-tick--on={on} aria-hidden="true">
	<span class="wfd-tick__fill"></span>
	<svg class="wfd-tick__mark" viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9" /></svg>
</span>

<style>
	.wfd-tick {
		position: relative;
		display: grid;
		flex: none;
		place-items: center;
		inline-size: 28px;
		block-size: 28px;
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-pill);
		transition: border-color var(--wfd-chip-motion);
	}

	.wfd-tick__fill {
		position: absolute;
		inset: calc(-1 * var(--wfd-border));
		border-radius: inherit;
		background: var(--wfd-color-primary);
		scale: 0;
		transition: scale var(--wfd-chip-motion);
	}

	/* The mark draws itself, after the fill has started. */
	.wfd-tick__mark {
		position: relative;
		inline-size: 18px;
		block-size: 18px;
		fill: none;
		stroke: var(--wfd-color-on-primary);
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 20;
		stroke-dashoffset: 20;
		transition: stroke-dashoffset var(--wfd-chip-motion);
	}

	.wfd-tick--on {
		border-color: var(--wfd-color-primary);
	}

	.wfd-tick--on .wfd-tick__fill {
		scale: 1;
	}

	.wfd-tick--on .wfd-tick__mark {
		stroke-dashoffset: 0;
		transition-delay: calc(var(--wfd-motion-change) / 2);
	}
</style>
