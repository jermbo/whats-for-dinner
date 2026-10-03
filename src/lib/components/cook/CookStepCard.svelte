<script>
	import StepPhotoPicker from '$lib/components/recipes/StepPhotoPicker.svelte';
	import CameraButton from '$lib/components/ui/CameraButton.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import StoredPhoto from '$lib/components/ui/StoredPhoto.svelte';
	import { addStepPhoto } from '$lib/data/step-photos';
	import { ingredientsIn } from '$lib/data/step-text';
	import { startTimer, stopTimer } from '$lib/data/timers';
	import { unlockSound } from '$lib/sound/chime';
	import { status } from '$lib/status.svelte';
	import { formatDay, formatQuantity } from '$lib/util/format';
	import StepNoteDialog from './StepNoteDialog.svelte';
	import StepText from './StepText.svelte';

	/** @typedef {import('$lib/types').StepNote} StepNote */

	/**
	 * One step in Cook mode: its photo, its text with a button for each time, the ingredients
	 * that the text names, and the notes from each cook. The camera button and the note button
	 * are in the card, because they are actions of this step.
	 * @type {{
	 *   recipe: import('$lib/types').Recipe,
	 *   step: import('$lib/types').RecipeStep,
	 *   number: number,
	 *   session: import('$lib/types').CookSession,
	 *   notes: { note: StepNote, sessionId: string }[],
	 *   ingredientsById: Map<string, import('$lib/types').Ingredient>,
	 *   now: number
	 * }}
	 *   notes: the notes of this step, newest first.
	 */
	let { recipe, step, number, session, notes, ingredientsById, now } = $props();

	/** @type {StepNoteDialog | undefined} */
	let noteDialog = $state();
	/** @type {StepPhotoPicker | undefined} */
	let picker = $state();

	const used = $derived(ingredientsIn(step.text, recipe.ingredients, ingredientsById));

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

	/** @param {{ stepId: string, index: number, seconds: number }} time */
	function start(time) {
		// The tap lets the page make the sound when the timer ends.
		unlockSound();
		startTimer(session.id, time);
	}
</script>

<article class="step-card">
	{#if step.selectedPhotoId}
		<button class="step-card__photo" type="button" onclick={() => picker?.open()}>
			<StoredPhoto id={step.selectedPhotoId} />
			{#if step.photoIds.length > 1}
				<span class="step-card__count" aria-hidden="true">{step.photoIds.length} photos</span>
			{/if}
			<span class="visually-hidden">The photos of step {number}: select the photo to show</span>
		</button>
	{/if}

	<p class="step-card__text">
		<StepText
			{step}
			timers={session.timers}
			{now}
			onstart={start}
			onstop={(timer) => stopTimer(session.id, timer.id)}
		/>
	</p>

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

	{#if notes.length > 0}
		<ul class="step-card__notes" aria-label="Notes on this step">
			{#each notes as entry (entry.note.id)}
				<li>
					<button class="step-card__note" type="button" onclick={() => noteDialog?.open(entry)}>
						<span class="step-card__date">{formatDay(entry.note.at)}</span>
						{entry.note.text}
						<span class="visually-hidden">Change this note</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	<div class="step-card__actions">
		<CameraButton
			class="button"
			label={step.photoIds.length > 0 ? 'New photo' : 'Photo'}
			onphoto={photo}
		/>
		<button class="button step-card__action" type="button" onclick={() => noteDialog?.open()}>
			<Icon name="note" />
			Note
		</button>
	</div>
</article>

<StepNoteDialog bind:this={noteDialog} sessionId={session.id} stepId={step.id} {number} />
<StepPhotoPicker bind:this={picker} recipeId={recipe.id} {step} {number} />

<style>
	.step-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
		container-type: inline-size;
	}

	.step-card__photo {
		position: relative;
		display: block;
		inline-size: 100%;
		aspect-ratio: 4 / 3;
		max-block-size: 38dvh;
		padding: 0;
		overflow: hidden;
		background: none;
		border: 0;
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		cursor: pointer;
	}

	/* A dark label on the photo, as on the photo of a recipe card. */
	.step-card__count {
		position: absolute;
		inset-block-end: var(--space-3);
		inset-inline-end: var(--space-3);
		padding: var(--space-1) var(--space-3);
		font-size: 0.8rem;
		font-weight: 600;
		color: #ffffff;
		background: rgb(0 0 0 / 0.6);
		border-radius: var(--radius-pill);
	}

	/* Large text: the owner reads it from the counter, with the phone at arm's length. */
	.step-card__text {
		font-family: var(--font-heading);
		font-size: clamp(1.4rem, 6.2cqi, 2.1rem);
		font-weight: 500;
		line-height: 1.4;
		text-wrap: pretty;
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
		background: var(--color-accent-soft);
		border-radius: var(--radius-pill);
	}

	.step-card__notes {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* A note looks like the note of the last time on the back of a meal card. */
	.step-card__note {
		display: block;
		inline-size: 100%;
		padding: var(--space-3) var(--space-4);
		font: inherit;
		font-size: 1.05rem;
		text-align: start;
		background: var(--color-notice);
		border: 0;
		border-radius: calc(var(--radius) / 2);
		cursor: pointer;
	}

	.step-card__date {
		display: block;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-muted);
	}

	.step-card__actions {
		display: flex;
		gap: var(--space-3);
	}

	.step-card__action {
		gap: var(--space-2);
	}
</style>
