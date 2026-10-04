<script>
	import CameraButton from '$lib/components/ui/CameraButton.svelte';
	import StoredPhoto from '$lib/components/ui/StoredPhoto.svelte';
	import { setFinishedPhoto } from '$lib/data/finished-photos';

	/**
	 * The photo of the finished meal of one cook session. With no photo, it is one large
	 * camera button: the plate is full and people wait, so the photo is one tap.
	 * With a photo, it shows the photo, and a second photo replaces it.
	 * @type {{ session: import('$lib/types').CookSession }}
	 */
	let { session } = $props();

	/** @param {Blob} blob */
	const save = (blob) => setFinishedPhoto(session.id, blob);
</script>

{#if session.photoId}
	<div class="finished-photo">
		<div class="finished-photo__frame">
			<StoredPhoto id={session.photoId} alt="The finished meal" />
		</div>
		<CameraButton class="button" label="Take the photo again" onphoto={save} />
	</div>
{:else}
	<CameraButton class="finished-photo__take" label="Take a photo of your meal" onphoto={save} />
{/if}

<style>
	.finished-photo {
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: var(--space-3);
	}

	.finished-photo__frame {
		inline-size: 100%;
		aspect-ratio: 4 / 3;
		max-block-size: 45dvh;
		overflow: hidden;
		border-radius: var(--radius);
		box-shadow: var(--shadow);
	}

	/* The class is on the label of the camera button, which is in a different component. */
	:global {
		.finished-photo__take {
			flex-direction: column;
			inline-size: 100%;
			min-block-size: 13rem;
			padding: var(--space-5);
			font-family: var(--font-display);
			font-size: 1.5rem;
			font-weight: 400;
			text-align: center;
			text-transform: uppercase;
			background: var(--paper-deep);
			border: 2px dashed var(--ink);
			border-radius: var(--radius);
			transition: scale 0.2s var(--ease-out);

			&:active {
				scale: 0.98;
			}

			& .icon {
				inline-size: 3rem;
				block-size: 3rem;
			}
		}
	}
</style>
