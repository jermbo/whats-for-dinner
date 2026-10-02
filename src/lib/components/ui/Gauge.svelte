<script>
	import { onMount, untrack } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { prefersReducedMotion, Tween } from 'svelte/motion';
	import { levelDrag } from '$lib/input/level-drag';
	import { pop } from '$lib/motion/transitions';
	import Icon from './Icon.svelte';

	/** A fill at or below this fraction shows as low. */
	const LOW = 0.25;
	/** The time of the move from the "from" value to the saved value, in milliseconds. */
	const POUR_MS = 900;

	/**
	 * A row that is also a level control. The fill of the row shows the level. A tap or a slide
	 * on the row changes it. A hidden range input gives the same control to the keyboard and to
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
	let pouring = $state(untrack(() => from !== undefined && !prefersReducedMotion.current));

	const shown = $derived(draft ?? (pouring ? pour.current : scale.value));
	const level = $derived(scale.toFraction(shown));
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
		navigator.vibrate?.(5);
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
		level === 0 && 'gauge--empty',
		level > 0 && level <= LOW && 'gauge--low'
	]}
	style:--level={level}
	style:--blocks={scale.blocks}
	use:levelDrag={drag}
>
	<span class="gauge__fill"></span>

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
	.gauge {
		--gauge-fill: color-mix(in srgb, var(--color-accent) 28%, var(--color-surface));
		--gauge-edge: var(--color-accent);

		position: relative;
		isolation: isolate;
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-block-size: 3.5rem;
		padding: var(--space-2) var(--space-5);
		overflow: hidden;
		background: var(--color-surface);
		border: 1.5px solid transparent;
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		cursor: ew-resize;
		/* A vertical move scrolls the page. A horizontal move comes to the row. */
		touch-action: pan-y;
		user-select: none;
		-webkit-user-select: none;
		-webkit-tap-highlight-color: transparent;
		transition:
			scale 0.3s var(--ease-spring),
			box-shadow 0.3s,
			background-color 0.3s,
			border-color 0.3s;

		&:has(:focus-visible) {
			outline: 3px solid var(--color-accent-strong);
			outline-offset: 2px;
		}
	}

	.gauge__fill {
		position: absolute;
		z-index: -1;
		inset-block: 0;
		inset-inline-start: 0;
		inline-size: calc(var(--level) * 100%);
		background: var(--gauge-fill);
		border-inline-end: 3px solid var(--gauge-edge);
		transition:
			inline-size 0.45s var(--ease-spring),
			background-color 0.3s,
			border-color 0.3s;
	}

	.gauge__text {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-inline-size: 0;
	}

	.gauge__label {
		font-weight: 600;
		cursor: inherit;
	}

	.gauge__note {
		color: var(--color-muted);
		font-size: 0.85rem;
	}

	.gauge__done {
		display: grid;
		color: var(--color-accent-strong);
	}

	.gauge__value {
		min-inline-size: 3.5rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		text-align: end;
		transform-origin: right center;
		transition: scale 0.3s var(--ease-spring);
	}

	/* A count shows as blocks: lines divide the row into one block for each unit. */
	.gauge--blocks::after {
		position: absolute;
		z-index: -1;
		inset: 0;
		content: '';
		background: repeating-linear-gradient(
			to right,
			transparent 0 calc(100% / var(--blocks) - 2px),
			var(--color-border) calc(100% / var(--blocks) - 2px) calc(100% / var(--blocks))
		);
	}

	.gauge--low {
		--gauge-fill: var(--color-low);
		--gauge-edge: var(--color-low-strong);
	}

	/* Empty: an outline only, so that the row reads as "not there". */
	.gauge--empty {
		background: transparent;
		border-color: var(--color-border);
		border-style: dashed;
		box-shadow: none;

		& .gauge__fill {
			border-color: transparent;
		}

		& .gauge__value {
			color: var(--color-muted);
		}
	}

	/* Under the finger: the row comes up, and the fill follows the finger with no delay. */
	.gauge--sliding {
		scale: 1.02;
		box-shadow: 0 0.75rem 2rem rgb(20 70 75 / 0.16);

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
		transition-property: background-color, border-color;
	}
</style>
