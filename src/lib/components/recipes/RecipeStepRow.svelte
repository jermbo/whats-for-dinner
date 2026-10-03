<script>
	import StoredPhoto from '$lib/components/ui/StoredPhoto.svelte';
	import { splitByTimes } from '$lib/data/step-text';
	import { formatDay } from '$lib/util/format';
	import StepPhotoPicker from './StepPhotoPicker.svelte';

	/**
	 * One step on the page of a recipe: its number, its text with the times in bold, its notes
	 * from each cook, and its selected photo. A tap on the photo opens the photos of the step.
	 * @type {{
	 *   recipeId: string,
	 *   step: import('$lib/types').RecipeStep,
	 *   number: number,
	 *   notes: { note: import('$lib/types').StepNote, sessionId: string }[]
	 * }}
	 */
	let { recipeId, step, number, notes } = $props();

	/** @type {StepPhotoPicker | undefined} */
	let picker = $state();

	const parts = $derived(splitByTimes(step.text));
</script>

<li class="step-row">
	<span class="step-row__number" aria-hidden="true">{number}</span>

	<div class="step-row__body">
		<p>
			{#each parts as part, index (index)}
				{#if part.seconds}<strong>{part.text}</strong>{:else}{part.text}{/if}
			{/each}
		</p>

		{#each notes as entry (entry.note.id)}
			<p class="step-row__note">
				<span class="step-row__date">{formatDay(entry.note.at)}</span>
				{entry.note.text}
			</p>
		{/each}
	</div>

	{#if step.selectedPhotoId}
		<button class="step-row__photo" type="button" onclick={() => picker?.open()}>
			<StoredPhoto id={step.selectedPhotoId} />
			<span class="visually-hidden">
				The photos of step {number}: {step.photoIds.length}. Select the photo to show.
			</span>
		</button>
	{/if}
</li>

<StepPhotoPicker bind:this={picker} {recipeId} {step} {number} />

<style>
	.step-row {
		display: grid;
		grid-template-columns: 2rem minmax(0, 1fr) auto;
		gap: var(--space-3);
		align-items: start;
	}

	/* The number of the step in a teal circle, as on the back of a meal card. */
	.step-row__number {
		display: grid;
		place-items: center;
		inline-size: 2rem;
		block-size: 2rem;
		font-weight: 600;
		color: var(--color-accent-strong);
		background: var(--color-accent-soft);
		border-radius: 50%;
	}

	.step-row__body {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding-block-start: 0.2rem;
	}

	.step-row__note {
		padding: var(--space-2) var(--space-3);
		font-size: 0.925rem;
		background: var(--color-notice);
		border-radius: calc(var(--radius) / 2);
	}

	.step-row__date {
		font-weight: 600;
		color: var(--color-muted);
	}

	.step-row__photo {
		inline-size: 4.5rem;
		aspect-ratio: 1;
		padding: 0;
		overflow: hidden;
		background: none;
		border: 0;
		border-radius: 1rem;
		cursor: pointer;
		transition: scale 0.25s var(--ease-spring);

		&:active {
			scale: 0.95;
		}
	}
</style>
