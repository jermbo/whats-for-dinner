<script>
	import Icon from '$lib/components/ui/Icon.svelte';
	import StoredPhoto from '$lib/components/ui/StoredPhoto.svelte';
	import { STEP_PHOTO_LIMIT, deleteStepPhoto, selectStepPhoto } from '$lib/data/step-photos';

	/**
	 * The photos of one step, side by side. A tap on a photo makes it the selected photo: the
	 * photo that the step shows. Each photo can be deleted here.
	 * @type {{ recipeId: string, step: import('$lib/types').RecipeStep, number: number }}
	 */
	let { recipeId, step, number } = $props();

	const uid = $props.id();

	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state();

	export function open() {
		dialog?.showModal();
	}

	/** @param {string} photoId */
	async function remove(photoId) {
		if (!confirm('Delete this photo?')) return;
		// With no photo left, the dialog has nothing to show.
		const last = step.photoIds.length <= 1;
		await deleteStepPhoto(recipeId, step.id, photoId);
		if (last) dialog?.close();
	}
</script>

<!-- "data-controls": a tap in this dialog is not a tap on the card of Cook mode. -->
<dialog class="photo-picker" bind:this={dialog} aria-labelledby="{uid}-title" data-controls>
	<div class="stack">
		<h2 id="{uid}-title">Photos of step {number}</h2>

		<ul class="photo-picker__list">
			{#each step.photoIds as photoId, index (photoId)}
				{@const selected = photoId === step.selectedPhotoId}
				<li class="photo-picker__item">
					<button
						class={['photo-picker__photo', selected && 'photo-picker__photo--selected']}
						type="button"
						aria-pressed={selected}
						onclick={() => selectStepPhoto(recipeId, step.id, photoId)}
					>
						<StoredPhoto id={photoId} />
						{#if selected}
							<span class="photo-picker__mark"><Icon name="check" />Selected</span>
						{/if}
						<span class="visually-hidden">Photo {index + 1}: show this photo on the step</span>
					</button>
					<button class="photo-picker__delete" type="button" onclick={() => remove(photoId)}>
						<Icon name="trash" />
						<span class="visually-hidden">Delete photo {index + 1}</span>
					</button>
				</li>
			{/each}
		</ul>

		<p class="muted">
			The step shows the selected photo. A step keeps {STEP_PHOTO_LIMIT} photos: a new photo removes the
			oldest one that is not selected.
		</p>

		<button class="button button--primary" type="button" onclick={() => dialog?.close()}>
			Done
		</button>
	</div>
</dialog>

<style>
	.photo-picker__list {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--space-3);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.photo-picker__item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
	}

	.photo-picker__photo {
		position: relative;
		inline-size: 100%;
		aspect-ratio: 3 / 4;
		padding: 0;
		overflow: hidden;
		background: none;
		border: 3px solid transparent;
		border-radius: var(--radius-control);
		cursor: pointer;
		transition: scale 0.2s var(--ease-out);

		&:active {
			scale: 0.96;
		}
	}

	.photo-picker__photo--selected {
		border-color: var(--ink);
	}

	.photo-picker__mark {
		position: absolute;
		inset-inline: 0;
		inset-block-end: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-1);
		padding: var(--space-1);
		font-size: 0.75rem;
		font-weight: 800;
		text-transform: uppercase;
		color: var(--paper);
		background: var(--ink);

		& :global(.icon) {
			inline-size: 0.9rem;
			block-size: 0.9rem;
		}
	}

	.photo-picker__delete {
		display: grid;
		place-items: center;
		inline-size: var(--tap);
		block-size: var(--tap);
		padding: 0;
		color: var(--ink-soft);
		background: none;
		border: 0;
		border-radius: var(--radius-control);
		cursor: pointer;

		& :global(.icon) {
			inline-size: 1.25rem;
			block-size: 1.25rem;
		}
	}
</style>
