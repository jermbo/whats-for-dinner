<script>
	import { recipePhoto } from '$lib/data/photos';
	import { photoAddress } from '$lib/photo-address.svelte';

	/**
	 * The photo of a recipe: its cover, which is a photo of the finished meal from the database.
	 * A recipe with no photo shows an olive block: the name next to it is the picture.
	 * It shows a soft shimmer until the photo loads, then the photo comes in. If the photo
	 * cannot load (no connection), the olive stays.
	 * The photo is decoration: the name of the recipe is always next to it.
	 * @type {{ recipe: import('$lib/types').Recipe, variant?: 'thumb' | 'card' | 'hero' }}
	 */
	let { recipe, variant = 'card' } = $props();

	let loaded = $state(false);
	let failed = $state(false);

	const cover = photoAddress(() => recipe.coverPhotoId);
	const src = $derived(recipe.coverPhotoId ? cover.current : recipePhoto(recipe));
</script>

<div
	class={[
		'recipe-photo',
		`recipe-photo--${variant}`,
		loaded && 'recipe-photo--loaded',
		failed && 'recipe-photo--failed',
		!src && !recipe.coverPhotoId && 'recipe-photo--empty'
	]}
	data-recipe-photo
>
	{#if !failed && src}
		<img
			class="recipe-photo__image"
			{src}
			alt=""
			loading="lazy"
			decoding="async"
			onload={() => (loaded = true)}
			onerror={() => (failed = true)}
		/>
	{/if}
</div>

<style>
	.recipe-photo {
		overflow: hidden;
		background: linear-gradient(
				100deg,
				transparent 30%,
				color-mix(in srgb, var(--card) 45%, transparent) 50%,
				transparent 70%
			)
			var(--olive);
		background-size: 200% 100%;
		animation: shimmer 1.4s linear infinite;

		&.recipe-photo--loaded,
		&.recipe-photo--failed,
		&.recipe-photo--empty {
			background-image: none;
			animation: none;
		}
	}

	.recipe-photo--card {
		aspect-ratio: 16 / 10;
	}

	.recipe-photo--thumb {
		flex: none;
		inline-size: 3.75rem;
		aspect-ratio: 1;
		border-radius: var(--radius-control);
	}

	.recipe-photo--hero {
		aspect-ratio: 16 / 9;
		border-radius: var(--radius);
		/* The photo of the tapped card grows into this one. See motion/photo-morph.js. */
		view-transition-name: recipe-photo;

		/* In a wide container, the photo is a band: it is not tall. */
		@container (min-width: 38rem) {
			aspect-ratio: 21 / 8;
		}
	}

	.recipe-photo__image {
		display: block;
		inline-size: 100%;
		block-size: 100%;
		object-fit: cover;
		opacity: 0;
		scale: 1.04;
		transition:
			opacity 0.5s,
			scale 0.6s var(--ease-out);
	}

	.recipe-photo--loaded .recipe-photo__image {
		opacity: 1;
		scale: 1;
	}

	:global(.card--media:hover) .recipe-photo--loaded .recipe-photo__image {
		scale: 1.06;
	}
</style>
