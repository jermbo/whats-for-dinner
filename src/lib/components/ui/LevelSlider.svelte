<script>
	import { levelDrag } from '$lib/input/level-drag';
	import { vibrate } from '$lib/input/vibrate';

	/**
	 * A large level control with a handle, for a card where the amount is the main question.
	 * A slide or a tap on the track sets the value. A hidden range input gives the same control
	 * to the keyboard and to screen readers. A tick shows the low line of the scale.
	 * @type {{
	 *   label: string,
	 *   scale: import('$lib/types').LevelScale,
	 *   value: number,
	 *   note?: string
	 * }}
	 *   note: the text below the middle of the track, such as "Low at 500 ml".
	 */
	let { label, scale, value = $bindable(), note = '' } = $props();

	const uid = $props.id();

	let sliding = $state(false);

	const text = $derived(scale.text(value));

	/** @param {number} fraction */
	function set(fraction) {
		const next = scale.fromFraction(fraction);
		if (next === value) return;
		value = next;
		// A small tick for each stop, on the devices that can do it.
		vibrate(5);
	}

	/** @type {import('$lib/input/level-drag').LevelDragHandlers} */
	const drag = {
		onlevel(fraction) {
			sliding = true;
			set(fraction);
		},
		onend(fraction) {
			sliding = false;
			set(fraction);
		},
		oncancel: () => (sliding = false)
	};
</script>

<div
	class={['level-slider', sliding && 'level-slider--sliding']}
	style:--level={scale.toFraction(value)}
	style:--low={scale.toFraction(scale.low)}
>
	<div class="level-slider__head">
		<label class="label" for="{uid}-level">{label}</label>
		<!-- The range input gives the value to screen readers, so this text is only for the eye. -->
		<span class="level-slider__value" aria-hidden="true">{text}</span>
	</div>

	<div class="level-slider__touch" use:levelDrag={drag}>
		<span class="level-slider__track">
			<span class="level-slider__fill"></span>
			<span class="level-slider__tick"></span>
			<span class="level-slider__handle"></span>
		</span>
	</div>

	<div class="level-slider__scale" aria-hidden="true">
		<span>0</span>
		<span>{note}</span>
		<span>{scale.text(scale.max)}</span>
	</div>

	<input
		class="visually-hidden"
		id="{uid}-level"
		type="range"
		min="0"
		max={scale.max}
		step={scale.step}
		aria-valuetext={note ? `${text}. ${note}` : text}
		bind:value
	/>
</div>

<style>
	.level-slider {
		/* The zone at each end where a finger gives 0 or 1: see input/level-drag.js. */
		--edge: 12px;

		display: grid;
		gap: var(--space-1);

		&:has(:focus-visible) {
			outline: var(--focus-ring);
			outline-offset: 4px;
		}
	}

	.level-slider__head {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.level-slider__value {
		font-family: var(--font-display);
		font-size: 3rem;
		line-height: 0.9;
		font-variant-numeric: tabular-nums;
		transform-origin: right bottom;
		transition: scale 0.25s var(--ease-spring);
	}

	/* The area for the finger: as high as a button, and wider than the track by the two edges. */
	.level-slider__touch {
		display: grid;
		align-items: center;
		min-block-size: var(--tap);
		margin-inline: calc(-1 * var(--edge));
		padding-inline: var(--edge);
		cursor: ew-resize;
		/* A vertical move scrolls the page. A horizontal move comes to the track. */
		touch-action: pan-y;
		user-select: none;
		-webkit-user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	.level-slider__track {
		position: relative;
		block-size: 1.25rem;
		background: var(--paper-deep);
	}

	.level-slider__fill {
		position: absolute;
		inset-block: 0;
		inset-inline-start: 0;
		inline-size: calc(var(--level) * 100%);
		background: var(--ink);
		transition: inline-size 0.35s var(--ease-out);
	}

	/* The low line. It is longer than the track is high, so that it shows on the ink fill also. */
	.level-slider__tick {
		position: absolute;
		inset-block: -4px;
		inset-inline-start: calc(var(--low) * 100%);
		inline-size: 2px;
		margin-inline-start: -1px;
		background: var(--ink);
	}

	/* The handle: an olive block with an ink rule, at the end of the fill. */
	.level-slider__handle {
		position: absolute;
		inset-block: -7px;
		inset-inline-start: calc(var(--level) * 100%);
		inline-size: 1rem;
		margin-inline-start: -0.5rem;
		background: var(--olive);
		border: 2px solid var(--ink);
		border-radius: var(--radius-sticker);
		transition:
			inset-inline-start 0.35s var(--ease-out),
			scale 0.25s var(--ease-spring);
	}

	.level-slider__scale {
		display: flex;
		justify-content: space-between;
		gap: var(--space-3);
		font-size: 0.875rem;
		font-weight: 600;
	}

	/* Under the finger: the handle and the value grow, and both follow the finger with no delay. */
	.level-slider--sliding {
		& .level-slider__value {
			scale: 1.12;
		}

		& .level-slider__handle {
			scale: 1.15 1.2;
			transition-duration: 0.08s, 0.25s;
			transition-timing-function: linear, var(--ease-spring);
		}

		& .level-slider__fill {
			transition-duration: 0.08s;
			transition-timing-function: linear;
		}
	}
</style>
