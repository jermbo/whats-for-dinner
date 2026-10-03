<script>
	import { recipePhoto } from '$lib/data/photos';

	/**
	 * The photo of a recipe. It shows a soft shimmer until the photo loads, then the photo
	 * comes in. If the photo cannot load (no connection), the soft color stays.
	 * The photo is decoration: the name of the recipe is always next to it.
	 * @type {{ recipe: import('$lib/types').Recipe, variant?: 'thumb' | 'card' | 'hero' }}
	 */
	let { recipe, variant = 'card' } = $props();

	const SIZES = { thumb: [160, 160], card: [640, 420], hero: [1200, 560] };

	let loaded = $state(false);
	let failed = $state(false);

	const src = $derived(recipePhoto(recipe, SIZES[variant][0], SIZES[variant][1]));
</script>

<div
	class={[
		'recipe-photo',
		`recipe-photo--${variant}`,
		loaded && 'recipe-photo--loaded',
		failed && 'recipe-photo--failed'
	]}
	data-recipe-photo
>
	{#if !failed}
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
				rgb(255 255 255 / 0.6) 50%,
				transparent 70%
			)
			var(--color-accent-soft);
		background-size: 200% 100%;
		animation: shimmer 1.4s linear infinite;

		&.recipe-photo--loaded,
		&.recipe-photo--failed {
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
		border-radius: 1rem;
	}

	.recipe-photo--hero {
		aspect-ratio: 16 / 9;
		border-radius: var(--radius);
		box-shadow: var(--shadow);
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
