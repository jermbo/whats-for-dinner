<script>
	import { onMount, untrack } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import { stockLevel } from '$lib/domain/pantry-scale';
	import { levelDrag } from '$lib/input/level-drag';
	import { vibrate } from '$lib/input/vibrate';
	import { lessMotion } from '$lib/motion/less-motion.svelte';
	import { pop } from '$lib/motion/transitions';
	import Icon from './Icon.svelte';

	/** The time of the move from the "from" value to the saved value, in milliseconds. */
	const POUR_MS = 900;

	/**
	 * A row that is also a level control. The fill of the row shows the level, and a tick shows
	 * the low line. A tap or a slide on the row changes the level. A hidden range input gives the same control to the keyboard and to
	 * screen readers.
	 *
	 * With "from", the row starts at that value and moves to the saved value after "delay"
	 * milliseconds, so that the eye sees a change that occurred a moment ago.
	 * @type {{
	 *   label: string,
	 *   scale: import('$lib/types').LevelScale,
	 *   note?: string,
	 *   done?: boolean,
	 *   from?: number,
	 *   delay?: number,
	 *   onchange: (value: number) => unknown
	 * }}
	 */
	let { label, scale, note = '', done = false, from, delay = 0, onchange } = $props();

	const uid = $props.id();

	/** @type {number | null} The value under the finger, or the value that the database saves now. */
	let draft = $state(null);
	let sliding = $state(false);

	const pour = new Tween(untrack(() => from ?? scale.value));
	let pouring = $state(untrack(() => from !== undefined && !lessMotion.current));

	const shown = $derived(draft ?? (pouring ? pour.current : scale.value));
	const level = $derived(scale.toFraction(shown));
	const stock = $derived(stockLevel(scale, shown));
	// The number counts in full units during the move.
	const text = $derived(scale.text(pouring && draft === null ? Math.round(shown) : shown));

	onMount(() => {
		if (!pouring) return;
		pour
			.set(scale.value, { delay, duration: POUR_MS, easing: cubicInOut })
			.then(() => (pouring = false));
	});

	// A new saved value replaces the draft.
	$effect(() => {
		void scale.value;
		untrack(() => {
			if (!sliding) draft = null;
		});
	});

	/** @param {number} value */
	function show(value) {
		if (value === shown) return;
		draft = value;
		// A small tick for each stop, on the devices that can do it.
		vibrate(5);
	}

	/** @param {number} value */
	async function save(value) {
		sliding = false;
		if (value === scale.value) {
			draft = null;
			return;
		}
		draft = value;
		try {
			await onchange(value);
		} catch (error) {
			draft = null;
			throw error;
		}
	}

	/** @type {import('$lib/input/level-drag').LevelDragHandlers} */
	const drag = {
		onlevel(fraction) {
			sliding = true;
			show(scale.fromFraction(fraction));
		},
		onend: (fraction) => save(scale.fromFraction(fraction)),
		oncancel() {
			sliding = false;
			draft = null;
		}
	};
</script>

<div
	class={[
		'gauge',
		sliding && 'gauge--sliding',
		pouring && 'gauge--pouring',
		scale.blocks > 0 && 'gauge--blocks',
		stock === 'out' && 'gauge--empty',
		stock === 'low' && 'gauge--low'
	]}
	style:--level={level}
	style:--low={scale.toFraction(scale.low)}
	style:--blocks={scale.blocks}
	use:levelDrag={drag}
>
	<span class="gauge__text">
		<label class="gauge__label" for="{uid}-level">{label}</label>
		{#if note}
			<span class="gauge__note" id="{uid}-note">{note}</span>
		{/if}
	</span>

	{#if done}
		<span class="gauge__done" in:pop>
			<Icon name="check" />
			<span class="visually-hidden">Changed.</span>
		</span>
	{/if}

	<!-- The range input gives the value to screen readers, so this text is only for the eye. -->
	<span class="gauge__value" aria-hidden="true">{text}</span>

	<span class="gauge__track" aria-hidden="true">
		<span class="gauge__fill"></span>
		{#if scale.low > 0}
			<span class="gauge__tick"></span>
		{/if}
	</span>

	<input
		class="visually-hidden"
		id="{uid}-level"
		type="range"
		min="0"
		max={scale.max}
		step={scale.step}
		value={shown}
		aria-valuetext={text}
		aria-describedby={note ? `${uid}-note` : undefined}
		oninput={(event) => (draft = event.currentTarget.valueAsNumber)}
		onchange={(event) => save(event.currentTarget.valueAsNumber)}
	/>
</div>

<style>
	/*
	 * A row on paper: the label and the value on one line, and a track of 14 high under them.
	 * The track is paper-deep and the fill is ink. A tick marks the low line: a level at or below
	 * it is amber. An empty level has a ticked track, as "none" in the design.
	 */
	.gauge {
		--gauge-fill: var(--ink);

		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: baseline;
		gap: var(--space-1) var(--space-3);
		padding: var(--space-3) 0;
		border-block-end: var(--rule-1) solid var(--hairline);
		cursor: ew-resize;
		/* A vertical move scrolls the page. A horizontal move comes to the row. */
		touch-action: pan-y;
		user-select: none;
		-webkit-user-select: none;
		-webkit-tap-highlight-color: transparent;
		transition: background-color 0.2s;

		&:has(:focus-visible) {
			outline: 3px solid var(--ink);
			outline-offset: 2px;
		}
	}

	.gauge__text {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 var(--space-3);
		min-inline-size: 0;
	}

	.gauge__label {
		font-weight: 700;
		cursor: inherit;
	}

	.gauge__note {
		color: var(--ink-soft);
		font-size: 0.85rem;
	}

	.gauge__done {
		position: absolute;
		inset-block-start: var(--space-3);
		inset-inline-end: 4.5rem;
		display: grid;
	}

	.gauge__value {
		min-inline-size: 3.5rem;
		font-weight: 800;
		font-variant-numeric: tabular-nums;
		text-align: end;
		transform-origin: right center;
		transition: scale 0.2s var(--ease-out);
	}

	/* The track. */
	.gauge__track {
		position: relative;
		grid-column: 1 / -1;
		block-size: var(--gauge-height);
		background: var(--paper-deep);
	}

	/* The low line. It is longer than the track is high, so that it shows on an ink fill also. */
	.gauge__tick {
		position: absolute;
		z-index: 1;
		inset-block: -3px;
		inset-inline-start: calc(var(--low) * 100%);
		inline-size: 2px;
		margin-inline-start: -1px;
		background: var(--ink);
	}

	.gauge__fill {
		position: absolute;
		inset-block: 0;
		inset-inline-start: 0;
		inline-size: calc(var(--level) * 100%);
		background: var(--gauge-fill);
		transition:
			inline-size 0.35s var(--ease-out),
			background-color 0.3s;
	}

	/* A count shows as blocks: lines divide the track into one block for each unit. */
	.gauge--blocks .gauge__track::after {
		position: absolute;
		inset: 0;
		content: '';
		background: repeating-linear-gradient(
			to right,
			transparent 0 calc(100% / var(--blocks) - 2px),
			var(--paper) calc(100% / var(--blocks) - 2px) calc(100% / var(--blocks))
		);
	}

	.gauge--low {
		--gauge-fill: var(--amber);
	}

	/* Empty: a track with ticks and no fill, so that the row reads as "not there". */
	.gauge--empty {
		& .gauge__track {
			background: repeating-linear-gradient(to right, var(--hairline) 0 2px, transparent 2px 5px);
		}

		& .gauge__value {
			color: var(--ink-soft);
		}
	}

	/* Under the finger: the value grows, and the fill follows the finger with no delay. */
	.gauge--sliding {
		background: var(--card);

		& .gauge__value {
			scale: 1.2;
		}

		&:not(.gauge--blocks) .gauge__fill {
			transition-duration: 0.08s;
			transition-timing-function: linear;
		}
	}

	/* The move from "from": the script sets each frame, so the fill must not add a delay. */
	.gauge--pouring .gauge__fill {
		transition-property: background-color;
	}
</style>
