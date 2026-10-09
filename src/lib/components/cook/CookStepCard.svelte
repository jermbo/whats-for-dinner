<script>
	import StepPhotoPicker from '$lib/components/recipes/StepPhotoPicker.svelte';
	import CameraButton from '$lib/components/ui/CameraButton.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import StoredPhoto from '$lib/components/ui/StoredPhoto.svelte';
	import { addStepPhoto } from '$lib/data/step-photos';
	import { startTimer, stopTimer } from '$lib/data/timers';
	import { ingredientsIn, timesIn } from '$lib/domain/step-text';
	import { pop, rise } from '$lib/motion/transitions';
	import { unlockSound } from '$lib/sound/chime';
	import { status } from '$lib/state/status.svelte';
	import { formatQuantity } from '$lib/util/format';
	import StepNoteDialog from './StepNoteDialog.svelte';
	import StepTimer from './StepTimer.svelte';

	/** @typedef {import('$lib/types').StepNote} StepNote */

	/**
	 * One step in Cook mode. The owner reads it from the other side of the kitchen: the number
	 * of the step and the clock of each time are large. The place of the photo is always there,
	 * at the top. The note of the last cook is an olive band at the lower edge.
	 * On a wide card, the photo is the left half and the text is the right half.
	 * @type {{
	 *   recipe: import('$lib/types').Recipe,
	 *   step: import('$lib/types').RecipeStep,
	 *   number: number,
	 *   total: number,
	 *   session: import('$lib/types').CookSession,
	 *   notes: { note: StepNote, sessionId: string }[],
	 *   ingredientsById: Map<string, import('$lib/types').Ingredient>,
	 *   now: number
	 * }}
	 *   total: the number of steps. notes: the notes of this step, newest first.
	 */
	let { recipe, step, number, total, session, notes, ingredientsById, now } = $props();

	/** @type {StepNoteDialog | undefined} */
	let noteDialog = $state();
	/** @type {StepPhotoPicker | undefined} */
	let picker = $state();

	const used = $derived(ingredientsIn(step.text, recipe.ingredients, ingredientsById));
	const times = $derived(timesIn(step.text));
	/** The band shows the newest note. */
	const last = $derived(notes[0]);

	/**
	 * The first photo of a step shows at once. A later photo does not change the photo that
	 * the step shows, so a message tells where it is.
	 * @param {Blob} blob
	 */
	async function photo(blob) {
		const first = step.photoIds.length === 0;
		await addStepPhoto(recipe.id, step.id, blob);
		status.say(first ? 'The photo is saved.' : 'The photo is saved. Tap the photo to select it.');
	}

	/** @param {{ index: number, seconds: number }} time */
	function start(time) {
		// The tap lets the page make the sound when the timer ends.
		unlockSound();
		startTimer(session.id, { stepId: step.id, ...time });
	}
</script>

<article class="step-card">
	<div class="step-card__top">
		{#if step.selectedPhotoId}
			<button class="step-card__photo" type="button" onclick={() => picker?.open()}>
				<StoredPhoto id={step.selectedPhotoId} />
				{#if step.photoIds.length > 1}
					<span class="step-card__count" aria-hidden="true">{step.photoIds.length} photos</span>
				{/if}
				<span class="visually-hidden">The photos of step {number}: select the photo to show</span>
			</button>
		{:else}
			<!-- The place of the photo is there before the photo: a tap takes it. -->
			<CameraButton
				class="step-card__photo step-card__photo--none"
				label="Your photo of this step"
				onphoto={photo}
			/>
		{/if}

		<p class="step-card__number" in:pop>
			<span class="visually-hidden">Step</span>
			{number}<span class="step-card__total"
				><span aria-hidden="true">/</span><span class="visually-hidden">of</span>{total}</span
			>
		</p>
	</div>

	<div class="step-card__body">
		<p class="step-card__text">{step.text}</p>

		{#if times.length > 0}
			<div class="step-card__timers">
				{#each times as time (time.index)}
					<StepTimer
						label={time.text}
						seconds={time.seconds}
						timer={session.timers.find(
							(timer) => timer.stepId === step.id && timer.index === time.index
						)}
						{now}
						onstart={() => start(time)}
						onstop={(timer) => stopTimer(session.id, timer.id)}
					/>
				{/each}
			</div>
		{/if}

		{#if used.length > 0}
			<ul class="step-card__ingredients" aria-label="Ingredients of this step">
				{#each used as row, index (index)}
					<li class="step-card__ingredient">
						{row.ingredient.name}
						{#if row.ingredient.tracking === 'quantity'}
							<strong>{formatQuantity(row.quantity, row.ingredient.unit)}</strong>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}

		<div class="step-card__actions">
			{#if step.selectedPhotoId}
				<CameraButton class="button" label="New photo" onphoto={photo} />
			{/if}
			{#if !last}
				<button class="button step-card__action" type="button" onclick={() => noteDialog?.open()}>
					<Icon name="note" />
					Note
				</button>
			{/if}
		</div>

		{#if last}
			{#key last.note.id}
				<button
					class="step-card__note"
					type="button"
					onclick={() => noteDialog?.open(last)}
					in:rise
				>
					<span class="label">Your note</span>
					<span class="step-card__words">{last.note.text}</span>
					<span class="visually-hidden">Change this note</span>
				</button>
			{/key}
		{/if}
	</div>
</article>

<StepNoteDialog bind:this={noteDialog} sessionId={session.id} stepId={step.id} {number} />
<StepPhotoPicker bind:this={picker} recipeId={recipe.id} {step} {number} />

<style>
	/* The card fills the height that is there, so that the note band is at the lower edge. */
	.step-card {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	/* The photo goes to the edges of the card. The number sits on its lower edge. */
	.step-card__top {
		position: relative;
		flex: none;
		margin: calc(-1 * var(--space-5)) calc(-1 * var(--space-5)) 0;
	}

	.step-card :global(.step-card__photo) {
		position: relative;
		display: flex;
		inline-size: 100%;
		block-size: clamp(7rem, 24dvh, 15rem);
		padding: 0;
		overflow: hidden;
		background: none;
		border: 0;
		border-radius: 0;
		cursor: pointer;
	}

	/* No photo yet: striped paper, and small words in the letters of a receipt. */
	.step-card :global(.step-card__photo--none) {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--ink-soft);
		background: repeating-linear-gradient(
			135deg,
			var(--paper) 0 0.75rem,
			var(--paper-deep) 0.75rem 1.5rem
		);
	}

	/* An ink sticker on the photo. */
	.step-card__count {
		position: absolute;
		inset-block-end: var(--space-3);
		inset-inline-end: var(--space-3);
		padding: var(--space-1) var(--space-2);
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--paper);
		background: var(--ink);
		border-radius: var(--radius-sticker);
	}

	/* The number of the step: Anton, on a white tab that comes up from the card. */
	.step-card__number {
		position: absolute;
		inset-block-end: 0;
		inset-inline-start: var(--space-5);
		padding: var(--space-2) var(--space-3) 0;
		font-family: var(--font-display);
		font-size: 3.5rem;
		line-height: 0.9;
		background: var(--card);
		transform-origin: bottom left;
		pointer-events: none;
	}

	.step-card__total {
		font-size: 0.5em;
		color: var(--hairline);
	}

	.step-card__body {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--space-4);
		padding-block-start: var(--space-4);
		container-type: inline-size;
	}

	/* Large text: the owner reads it from the counter, with the phone at arm's length. */
	.step-card__text {
		font-size: clamp(1.75rem, 8cqi, 2.75rem);
		font-weight: 600;
		line-height: 1.12;
		letter-spacing: -0.01em;
		text-wrap: pretty;
	}

	/* Two timers share the rule between them. */
	.step-card__timers :global(.step-timer + .step-timer) {
		border-block-start: 0;
	}

	.step-card__ingredients {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.step-card__ingredient {
		display: inline-flex;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		font-size: 1.05rem;
		font-weight: 600;
		background: var(--card);
		border: var(--rule-1) solid var(--ink);
		border-radius: var(--radius-sticker);
	}

	.step-card__actions {
		display: flex;
		gap: var(--space-3);

		&:empty {
			display: none;
		}
	}

	.step-card__action {
		gap: var(--space-2);
	}

	/* The note of the last cook: one olive band at the lower edge of the card, edge to edge. */
	.step-card__note {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-1) var(--space-3);
		margin: auto calc(-1 * var(--space-5)) 0;
		padding: var(--space-4) var(--space-5);
		text-align: start;
		background: var(--olive);
		border: 0;
		border-radius: 0;
		cursor: pointer;
	}

	.step-card__words {
		font-size: 1.25rem;
		font-weight: 700;
		line-height: 1.2;
	}

	/* A wide card has two halves: the photo at the left, and the step at the right. */
	@container cook-card (min-width: 48rem) {
		.step-card {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: var(--space-8);
		}

		.step-card__top {
			margin: calc(-1 * var(--space-5)) 0 calc(-1 * var(--space-5)) calc(-1 * var(--space-5));
		}

		.step-card :global(.step-card__photo) {
			block-size: 100%;
		}

		/* The number is at the top of the right half. */
		.step-card__number {
			inset-block: var(--space-5) auto;
			inset-inline-start: calc(100% + var(--space-8));
			padding: 0;
			font-size: 6rem;
		}

		.step-card__body {
			padding-block-start: 7rem;
		}

		.step-card__note {
			margin-inline-start: calc(-1 * var(--space-8));
			padding-inline-start: var(--space-8);
		}
	}
</style>
