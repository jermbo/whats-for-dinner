<script>
	import { tick } from 'svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import {
		endWithEmptyStep,
		newStep,
		pasteAtCursor,
		splitAtCursor,
		splitLines
	} from '$lib/domain/step-list';
	import { dragSort, isDropping } from '$lib/input/drag-sort';
	import { fitHeight } from '$lib/input/fit-height';
	import { appear, reorder, shrink } from '$lib/motion/transitions';
	import { useUndo } from '$lib/state/undo.svelte';

	/**
	 * The steps of the recipe form, as a list that you type like a note. The list ends with an
	 * empty row with a plus sign: the place for the next step. Enter also makes the next step.
	 * A paste of more than one line makes one step from each line. Backspace in an empty step
	 * removes it.
	 * The list is a panel with a largest height. A long list scrolls in the panel, so that the
	 * rest of the form stays on the screen. The empty row stays at the lower edge of the panel.
	 * Each step has its own remove button at the right of its text. A step with no photos goes at
	 * once, and "Undo" brings it back for a few seconds. The step that has the cursor also has
	 * the buttons that move it up and down. You can also hold the number of a step and drag it to a
	 * new place: the other steps move away to make room.
	 * @type {{ steps: import('$lib/types').RecipeStep[] }}
	 */
	let { steps = $bindable() } = $props();

	const uid = $props.id();

	/** @type {HTMLElement | undefined} */
	let list = $state();

	/** Shows the end of the list: the last step, and the empty row below it. */
	function showEnd() {
		list?.scrollTo({ top: list.scrollHeight });
	}

	// When the owner types in the last row, a new empty row comes below it. The list then
	// scrolls to its end, so that the row with the cursor stays in view above the new row.
	$effect(() => {
		const before = steps.length;
		endWithEmptyStep(steps);
		if (steps.length > before) tick().then(showEnd);
	});

	/** The place of the empty row at the end of the list. It is not a step yet. */
	const end = $derived(steps.length - 1);

	/**
	 * A row that the owner dropped is at its place already: the list does not animate that move.
	 * @param {Element} node
	 * @param {{ from: DOMRect, to: DOMRect }} rects
	 */
	const settle = (node, rects) => (isDropping() ? { duration: 0 } : reorder(node, rects));

	/**
	 * The owner dragged a step to a new place.
	 * @param {number} from
	 * @param {number} to
	 */
	function sort(from, to) {
		const [step] = steps.splice(from, 1);
		steps.splice(to, 0, step);
		currentId = step.id;
	}

	/** The ID of the step that has the cursor, or that had it last. */
	let currentId = $state('');

	/**
	 * The last step that the owner removed, and its place. It is only for a step with no photos:
	 * the save deletes the photos of a step that is gone.
	 * @type {import('$lib/state/undo.svelte').Undo<{
	 *   step: import('$lib/types').RecipeStep,
	 *   index: number
	 * }>}
	 */
	const removed = useUndo();

	/** @param {string} stepId */
	const fieldId = (stepId) => `${uid}-${stepId}`;

	/**
	 * Puts the cursor in a step, after the page shows the new list.
	 * @param {number} index
	 * @param {number} [at] The place of the cursor. With no place: the end of the text.
	 */
	export async function focus(index, at) {
		const step = steps[index];
		if (!step) return;
		await tick();
		// A step that lost a part of its text, or that moved, gets its new height.
		list?.querySelectorAll('textarea').forEach(fitHeight);
		const field = document.getElementById(fieldId(step.id));
		if (!(field instanceof HTMLTextAreaElement)) return;
		field.focus();
		const place = at ?? field.value.length;
		field.setSelectionRange(place, place);
	}

	/**
	 * Puts new steps after a step.
	 * @param {number} index
	 * @param {string[]} texts
	 */
	function insertAfter(index, texts) {
		steps.splice(index + 1, 0, ...texts.map((text) => newStep(text)));
	}

	/** @param {number} index */
	function remove(index) {
		const step = steps[index];
		if (!step) return;
		if (
			step.photoIds.length > 0 &&
			!confirm('This step has photos. Delete the step and its photos?')
		) {
			return;
		}

		steps.splice(index, 1);
		// The list always has one row to type in.
		if (steps.length === 0) steps.push(newStep());

		removed.keep(step.photoIds.length === 0 ? { step: $state.snapshot(step), index } : null);

		focus(Math.max(0, index - 1));
	}

	/** Puts the step that was removed back in its place. */
	function restore() {
		const kept = removed.take();
		if (!kept) return;
		const { step, index } = kept;
		// The empty row at the end stays the last row.
		steps.splice(Math.min(index, steps.length - 1), 0, step);
		focus(Math.min(index, steps.length - 2));
	}

	/**
	 * @param {number} index
	 * @param {-1 | 1} direction
	 */
	function move(index, direction) {
		const target = index + direction;
		if (index < 0 || target < 0 || target >= steps.length) return;
		[steps[index], steps[target]] = [steps[target], steps[index]];
		focus(target);
	}

	/**
	 * Enter: the text after the cursor becomes the next step.
	 * @param {KeyboardEvent & { currentTarget: HTMLTextAreaElement }} event
	 * @param {number} index
	 */
	function keydown(event, index) {
		// A keyboard that builds a letter from more than one key uses Enter to confirm it.
		if (event.isComposing) return;
		const field = event.currentTarget;
		const text = steps[index].text;

		if (event.key === 'Enter') {
			event.preventDefault();
			// Enter in an empty step does not make a second empty step.
			if (!text.trim()) return;
			const { before, after } = splitAtCursor(text, field.selectionStart, field.selectionEnd);
			steps[index].text = before;
			// At the end of a step, an empty step below is the next step: Enter goes to it.
			if (after || steps[index + 1]?.text !== '') insertAfter(index, [after]);
			focus(index + 1, 0);
		} else if (event.key === 'Backspace' && text === '' && steps.length > 1) {
			event.preventDefault();
			remove(index);
		}
	}

	/**
	 * A paste of more than one line: each line becomes a step. The numbers at the start of
	 * the lines go, because the list has its own numbers.
	 * @param {ClipboardEvent & { currentTarget: HTMLTextAreaElement }} event
	 * @param {number} index
	 */
	function paste(event, index) {
		const pasted = event.clipboardData?.getData('text/plain') ?? '';
		if (!pasted.includes('\n')) return;
		const pastedLines = splitLines(pasted);
		if (pastedLines.length === 0) return;
		event.preventDefault();

		const field = event.currentTarget;
		const lines = pasteAtCursor(
			steps[index].text,
			field.selectionStart,
			field.selectionEnd,
			pastedLines
		);

		steps[index].text = lines[0];
		insertAfter(index, lines.slice(1));
		focus(index + lines.length - 1);
	}

	/**
	 * The owner typed in a step. Some phone keyboards put a line break in the text and give no
	 * Enter key. Then the line break divides the step here.
	 * @param {HTMLTextAreaElement} field
	 * @param {number} index
	 */
	function input(field, index) {
		const [first, ...rest] = field.value.split(/\r?\n/);
		steps[index].text = first;
		if (rest.length === 0) {
			fitHeight(field);
			return;
		}
		insertAfter(index, rest);
		focus(index + rest.length, 0);
	}
</script>

{#snippet moves(/** @type {number} */ index, /** @type {string} */ place)}
	<span class={['step-fields__move', `step-fields__move--${place}`]}>
		<span class="step-fields__move-inner">
			<button
				class="step-fields__icon"
				type="button"
				disabled={index === 0}
				onclick={() => move(index, -1)}
			>
				<Icon name="up" />
				<span class="visually-hidden">Move step {index + 1} up</span>
			</button>
			<button
				class="step-fields__icon"
				type="button"
				disabled={index >= end - 1}
				onclick={() => move(index, 1)}
			>
				<Icon name="down" />
				<span class="visually-hidden">Move step {index + 1} down</span>
			</button>
		</span>
	</span>
{/snippet}

<fieldset class="fieldset step-fields">
	<legend class="fieldset__legend">Steps</legend>

	<ol class="step-fields__list" bind:this={list}>
		{#each steps as step, index (step.id)}
			<!-- The empty row at the end has a plus sign in the place of a number. -->
			{@const next = index === end && step.text === ''}
			<li
				in:appear
				out:shrink
				animate:settle
				{@attach next ? null : dragSort({ count: () => end, onsort: sort })}
				class={[
					'step-fields__row',
					step.id === currentId && 'step-fields__row--current',
					next && 'step-fields__row--next'
				]}
			>
				<label
					class="step-fields__number"
					for={fieldId(step.id)}
					data-handle={next ? undefined : ''}
				>
					{#if next}
						<Icon name="plus" />
						<span class="visually-hidden">Next step</span>
					{:else}
						<span class="visually-hidden">Step</span>
						{index + 1}
						{#if step.photoIds.length > 0}
							<!-- The photos of the step: a small tag on the corner of its number. -->
							<span class="step-fields__photos">
								<Icon name="camera" />
								{step.photoIds.length}
								<span class="visually-hidden">photos</span>
							</span>
						{/if}
					{/if}
				</label>
				<div class="step-fields__field">
					<textarea
						class="step-fields__text"
						id={fieldId(step.id)}
						rows="1"
						enterkeyhint="enter"
						placeholder={next ? 'Type a step. Enter makes the next step.' : ''}
						value={step.text}
						onfocus={() => {
							currentId = step.id;
							// The row for the next step shows below the last step, where its text goes.
							if (next) showEnd();
						}}
						onkeydown={(event) => keydown(event, index)}
						onpaste={(event) => paste(event, index)}
						oninput={(event) => input(event.currentTarget, index)}
						{@attach fitHeight}></textarea>

					<span class="step-fields__aside">
						{#if !next}
							{@render moves(index, 'inline')}
							<button
								class="step-fields__icon step-fields__remove"
								type="button"
								onclick={() => remove(index)}
							>
								<Icon name="close" />
								<span class="visually-hidden">Remove step {index + 1}</span>
							</button>
						{/if}
					</span>
				</div>
				{#if !next}
					{@render moves(index, 'below')}
				{/if}
			</li>
		{/each}
	</ol>

	{#if removed.current}
		<p class="step-fields__undo" role="status">
			<span>Step {removed.current.index + 1} is removed.</span>
			<button class="button button--link" type="button" onclick={restore}>Undo</button>
		</p>
	{/if}
</fieldset>

<style>
	/*
	 * A white panel with a largest height. A long list scrolls in the panel, and the name, the
	 * buttons, and the ingredients stay on the screen.
	 */
	.step-fields__list {
		/* The places of the rows for a drag are counted from this box. */
		position: relative;
		display: flex;
		flex-direction: column;
		max-block-size: clamp(14rem, 45dvh, 36rem);
		margin: 0;
		padding: 0;
		overflow-y: auto;
		list-style: none;
		background: var(--card);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		scrollbar-width: thin;
		/* A row that gets the cursor stops above the row for the next step, and not behind it. */
		scroll-padding-block-end: 4.5rem;
	}

	/* A wide main area: the list uses the height of the screen that the rest of the page leaves. */
	@container main (min-width: 50rem) {
		.step-fields__list {
			max-block-size: max(14rem, calc(100dvh - 24rem));
		}
	}

	.step-fields__row {
		display: grid;
		flex: none;
		grid-template-columns: 2rem minmax(0, 1fr);
		align-items: start;
		column-gap: var(--space-2);
		padding: 0.4rem var(--space-3);

		&:first-child {
			padding-block-start: var(--space-3);
		}
	}

	/* The number of the step in Anton, as on the back of a meal card. */
	.step-fields__number {
		position: relative;
		display: grid;
		place-items: center;
		inline-size: 2rem;
		block-size: 2rem;
		margin-block-start: 0.5rem;
		font-family: var(--font-display);
		font-size: 1.25rem;
		background: var(--olive);
		border-radius: var(--radius-sticker);
		transition:
			color 0.2s,
			background-color 0.2s;
	}

	.step-fields__row--current .step-fields__number {
		color: var(--paper);
		background: var(--ink);
	}

	/* The number of a step is its handle: hold it, and drag the step to a new place. */
	.step-fields__number[data-handle] {
		cursor: grab;
		user-select: none;
		-webkit-user-select: none;

		@media (hover: hover) {
			.step-fields__row:hover & {
				box-shadow: 0 0 0 2px var(--ink);
			}
		}
	}

	/* The step that you drag lifts above the list: white, with a shadow, a little larger. */
	.step-fields__row:global(.is-dragging) {
		z-index: 2;
		background: var(--card);
		border-radius: var(--radius-control);
		box-shadow: var(--shadow);

		& .step-fields__number {
			cursor: grabbing;
			color: var(--paper);
			background: var(--ink);
		}
	}

	/*
	 * The row for the next step stays at the lower edge of the panel while the list scrolls,
	 * so the place for a new step is always in view.
	 */
	.step-fields__row--next {
		position: sticky;
		inset-block-end: 0;
		padding-block: var(--space-3);
		background: var(--card);
		border-block-start: 1px solid var(--hairline);

		&:first-child {
			border-block-start: 0;
		}
	}

	/* A plus sign and a line of dashes: a place that is free. */
	.step-fields__row--next:not(.step-fields__row--current) {
		& .step-fields__number {
			color: var(--ink-soft);
			background: none;
			box-shadow: inset 0 0 0 2px var(--hairline);
		}

		& .step-fields__field {
			background: none;
			border-color: var(--ink);
			border-style: dashed;
		}
	}

	.step-fields__number :global(.icon) {
		inline-size: 1.15rem;
		block-size: 1.15rem;
	}

	/*
	 * The field is one grey bar. The text is at its left, and the buttons of the step are at its
	 * right, inside the bar: so there is no empty space between the text and the buttons.
	 */
	.step-fields__field {
		display: flex;
		align-items: center;
		min-inline-size: 0;
		min-block-size: var(--tap);
		background: var(--paper-deep);
		border: 2px solid transparent;
		border-radius: var(--radius-control);

		/* The bar shows the focus, and not the text field in it. */
		&:focus-within {
			outline: var(--focus-ring);
			outline-offset: 2px;
		}
	}

	/* The field is as tall as its text, so a long step is in view in full. */
	.step-fields__text {
		flex: 1;
		min-inline-size: 0;
		min-block-size: calc(var(--tap) - 4px);
		padding: var(--space-3) var(--space-4);
		overflow: hidden;
		line-height: 1.4;
		background: none;
		border: 0;
		border-radius: var(--radius-control);
		resize: none;
		field-sizing: content;

		&::placeholder {
			color: var(--ink-soft);
		}

		&:focus-visible {
			outline: none;
			box-shadow: none;
		}
	}

	/*
	 * The buttons of one step, at the right end of its bar: the moves, and "Remove". The moves
	 * have their place in every bar, so that the lines of the text do not change when they come in.
	 */
	.step-fields__aside {
		display: flex;
		flex: none;
		align-items: center;
		justify-content: flex-end;
		gap: var(--space-1);
		padding-inline-end: 0.125rem;
	}

	/* The photos of the step: a small ink tag on the lower corner of the number. */
	.step-fields__photos {
		position: absolute;
		inset-block-end: -0.4rem;
		inset-inline-end: -0.55rem;
		display: inline-flex;
		align-items: center;
		gap: 0.125rem;
		padding: 0.0625rem 0.3rem;
		font-family: var(--font-body);
		font-size: 0.6875rem;
		font-weight: 800;
		line-height: 1.25;
		color: var(--paper);
		background: var(--ink);
		border-radius: var(--radius-sticker);

		& :global(.icon) {
			inline-size: 0.75rem;
			block-size: 0.75rem;
			stroke-width: 2.5;
		}
	}

	/*
	 * A button of a step is a small white square with an ink rule, and an ink symbol. A button
	 * that cannot be used has no square and a pale symbol, so that you see at once which ones
	 * work. The square is a part of the button, and the button is larger: a finger hits 40 px.
	 */
	.step-fields__icon {
		display: grid;
		flex: none;
		place-items: center;
		inline-size: 2.5rem;
		block-size: 2.5rem;
		padding: 0;
		color: var(--ink);
		background: none;
		border: 0;
		cursor: pointer;

		&::before,
		& :global(.icon) {
			grid-area: 1 / 1;
		}

		&::before {
			inline-size: 2rem;
			block-size: 2rem;
			content: '';
			background: var(--card);
			border: 2px solid var(--ink);
			border-radius: var(--radius-sticker);
			transition:
				background-color 0.15s,
				border-color 0.15s,
				scale 0.15s var(--ease-out);
		}

		& :global(.icon) {
			inline-size: 1.125rem;
			block-size: 1.125rem;
			transition: color 0.15s;
		}

		&:active:not(:disabled)::before {
			scale: 0.9;
		}

		&:disabled {
			color: var(--hairline);
			cursor: not-allowed;

			&::before {
				background: none;
				border-color: var(--hairline);
				border-style: dashed;
			}
		}

		@media (hover: hover) {
			&:hover:not(:disabled) {
				color: var(--paper);

				&::before {
					background: var(--ink);
				}
			}
		}
	}

	/* "Remove" turns tomato on a hover. */
	@media (hover: hover) {
		.step-fields__remove:hover:not(:disabled) {
			color: var(--paper);

			&::before {
				background: var(--tomato-text);
				border-color: var(--tomato-text);
			}
		}
	}

	/*
	 * The moves belong to the step that has the cursor, or the step under the mouse. They slide in
	 * from the right and fade in, one button after the other, and they leave the same way.
	 * They are hidden after they leave, so that the keyboard does not stop on them.
	 * The first kind is at the right of the text, in a wide list. The second kind is under the
	 * text, in a narrow list: the row opens, and the text keeps its width.
	 */
	.step-fields__move-inner {
		display: flex;
		align-items: center;
	}

	.step-fields__move--inline {
		display: none;
	}

	.step-fields__move--below {
		grid-column: 2 / -1;
		display: grid;
		grid-template-rows: 0fr;
		visibility: hidden;
		opacity: 0;
		transition:
			grid-template-rows 0.28s var(--ease-out),
			opacity 0.2s,
			visibility 0s 0.28s;

		& .step-fields__move-inner {
			min-block-size: 0;
			overflow: hidden;
		}
	}

	.step-fields__row--current .step-fields__move--below {
		grid-template-rows: 1fr;
		visibility: visible;
		opacity: 1;
		transition-delay: 0s;
	}

	@container main ((min-width: 34rem) and (max-width: 49.99rem)) or (min-width: 56rem) {
		.step-fields__move--below {
			display: none;
		}

		.step-fields__move--inline {
			display: block;
			visibility: hidden;
			transition: visibility 0s 0.25s;

			& .step-fields__icon {
				opacity: 0;
				translate: 0.75rem 0;
				transition:
					opacity 0.18s,
					translate 0.25s var(--ease-out),
					background-color 0.15s,
					color 0.15s,
					scale 0.15s var(--ease-out);
			}
		}

		.step-fields__row--current .step-fields__move--inline,
		.step-fields__row:focus-within .step-fields__move--inline {
			visibility: visible;
			transition-delay: 0s;

			& .step-fields__icon {
				opacity: 1;
				translate: 0;

				&:nth-child(2) {
					transition-delay: 0.04s, 0.04s, 0s, 0s, 0s;
				}
			}
		}

		@media (hover: hover) {
			.step-fields__row:hover .step-fields__move--inline {
				visibility: visible;
				transition-delay: 0s;

				& .step-fields__icon {
					opacity: 1;
					translate: 0;

					&:nth-child(2) {
						transition-delay: 0.04s, 0.04s, 0s, 0s, 0s;
					}
				}
			}
		}
	}

	.step-fields__undo {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		margin-block-start: var(--space-2);
		padding-inline: var(--space-3);
		font-size: 0.875rem;
		font-weight: 700;
		background: var(--ink);
		color: var(--paper);
		border-radius: var(--radius-control);
		animation: rise 0.3s var(--ease-out);

		& .button {
			color: var(--paper);
		}
	}
</style>
