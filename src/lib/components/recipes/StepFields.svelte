<script>
	import { tick } from 'svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { newStep, splitLines } from '$lib/data/step-list';

	/** @typedef {Event & { currentTarget: HTMLTextAreaElement }} FieldEvent */

	/**
	 * The steps of the recipe form, as a list that you type like a note. Enter makes the next
	 * step. A paste of more than one line makes one step from each line. Backspace in an empty
	 * step removes it.
	 * The buttons below the list move or remove the step that has the cursor.
	 * @type {{ steps: import('$lib/types').RecipeStep[] }}
	 */
	let { steps = $bindable() } = $props();

	const uid = $props.id();

	/** @type {HTMLElement | undefined} */
	let list = $state();

	/** The ID of the step that has the cursor, or that had it last. */
	let currentId = $state('');
	const current = $derived(steps.findIndex((step) => step.id === currentId));

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
		focus(Math.max(0, index - 1));
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
			steps[index].text = text.slice(0, field.selectionStart).trimEnd();
			insertAfter(index, [text.slice(field.selectionEnd).trimStart()]);
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
		const lines = splitLines(pasted);
		if (lines.length === 0) return;
		event.preventDefault();

		const field = event.currentTarget;
		const text = steps[index].text;
		// The first line goes at the cursor. The text after the cursor goes after the last line.
		lines[0] = text.slice(0, field.selectionStart) + lines[0];
		lines[lines.length - 1] += text.slice(field.selectionEnd);

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

	/**
	 * Makes a text field as tall as its text, in a browser that cannot do this with CSS.
	 * @param {HTMLTextAreaElement} node
	 */
	function fitHeight(node) {
		if (CSS.supports('field-sizing', 'content')) return;
		node.style.blockSize = 'auto';
		node.style.blockSize = `${node.scrollHeight + 2}px`;
	}
</script>

<fieldset class="fieldset step-fields">
	<legend class="fieldset__legend">Steps</legend>

	<ol class="step-fields__list" bind:this={list}>
		{#each steps as step, index (step.id)}
			<li class={['step-fields__row', step.id === currentId && 'step-fields__row--current']}>
				<label class="step-fields__number" for={fieldId(step.id)}>
					<span class="visually-hidden">Step</span>
					{index + 1}
				</label>
				<textarea
					class="step-fields__text"
					id={fieldId(step.id)}
					rows="1"
					enterkeyhint="enter"
					placeholder={index === steps.length - 1 ? 'Type a step. Enter makes the next step.' : ''}
					value={step.text}
					onfocus={() => (currentId = step.id)}
					onkeydown={(event) => keydown(event, index)}
					onpaste={(event) => paste(event, index)}
					oninput={(event) => input(event.currentTarget, index)}
					{@attach fitHeight}></textarea>
				{#if step.photoIds.length > 0}
					<span class="badge step-fields__photos">
						<Icon name="camera" />
						{step.photoIds.length}
						<span class="visually-hidden">photos</span>
					</span>
				{/if}
			</li>
		{/each}
	</ol>

	<div class="step-fields__tools" role="group" aria-label="The step that has the cursor">
		<button
			class="button button--round"
			type="button"
			disabled={current <= 0}
			onclick={() => move(current, -1)}
		>
			<Icon name="up" />
			<span class="visually-hidden">Move step {current + 1} up</span>
		</button>
		<button
			class="button button--round"
			type="button"
			disabled={current < 0 || current >= steps.length - 1}
			onclick={() => move(current, 1)}
		>
			<Icon name="down" />
			<span class="visually-hidden">Move step {current + 1} down</span>
		</button>
		<button class="button" type="button" disabled={current < 0} onclick={() => remove(current)}>
			{current < 0 ? 'Remove step' : `Remove step ${current + 1}`}
		</button>
	</div>
</fieldset>

<style>
	.step-fields__list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.step-fields__row {
		display: grid;
		grid-template-columns: 2rem minmax(0, 1fr) auto;
		align-items: start;
		gap: var(--space-2);
	}

	/* The number of the step in a circle, as on the back of a meal card. */
	.step-fields__number {
		display: grid;
		place-items: center;
		inline-size: 2rem;
		block-size: 2rem;
		margin-block-start: 0.5rem;
		font-weight: 600;
		color: var(--color-accent-strong);
		background: var(--color-accent-soft);
		border-radius: 50%;
		transition:
			color 0.2s,
			background-color 0.2s;
	}

	.step-fields__row--current .step-fields__number {
		color: var(--color-on-accent);
		background: var(--color-accent-strong);
	}

	/* The field is as tall as its text, so a long step is in view in full. */
	.step-fields__text {
		inline-size: 100%;
		min-block-size: var(--tap);
		padding: var(--space-3) var(--space-4);
		overflow: hidden;
		line-height: 1.4;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 1rem;
		resize: none;
		field-sizing: content;

		&::placeholder {
			color: var(--color-muted);
		}
	}

	.step-fields__photos {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		margin-block-start: 0.6rem;

		& :global(.icon) {
			inline-size: 1rem;
			block-size: 1rem;
		}
	}

	.step-fields__tools {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-block-start: var(--space-3);
	}
</style>
