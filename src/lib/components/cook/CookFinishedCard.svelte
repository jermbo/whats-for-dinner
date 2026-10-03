<script>
	import FinishedPhotoField from './FinishedPhotoField.svelte';

	/**
	 * The last card of Cook mode. It asks for a photo of the finished meal. The photo is
	 * optional: "Cooked", below the card, works with no photo.
	 * @type {{ session: import('$lib/types').CookSession }}
	 */
	let { session } = $props();
</script>

<section class="cook-finished" aria-labelledby="cook-finished-title">
	<h2 class="cook-finished__title" id="cook-finished-title">
		{session.photoId ? 'That looks good.' : 'The meal is ready.'}
	</h2>

	<FinishedPhotoField {session} />

	<p class="muted">"Cooked" subtracts the ingredients from the pantry.</p>
</section>

<style>
	.cook-finished {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.cook-finished__title {
		font-size: 1.75rem;
	}
</style>
