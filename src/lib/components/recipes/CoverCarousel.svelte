<script>
	import Icon from '$lib/components/ui/Icon.svelte';
	import StoredPhoto from '$lib/components/ui/StoredPhoto.svelte';
	import { setCover } from '$lib/data/finished-photos';
	import { status } from '$lib/status.svelte';
	import { formatDate } from '$lib/util/format';

	/**
	 * The finished photos of a recipe, as a row that the owner swipes: the newest photo first.
	 * The row opens at the cover, which has a mark. Each other photo has a "Set as cover"
	 * button: a new photo never changes the cover, because the newest photo is not always the
	 * best.
	 * The next photo shows a part of itself at the edge, so the row tells that it moves.
	 * @type {{
	 *   recipe: import('$lib/types').Recipe,
	 *   photos: import('$lib/data/finished-photos').FinishedPhoto[]
	 * }}
	 */
	let { recipe, photos } = $props();

	/** @type {HTMLElement | undefined} */
	let track = $state();

	/** @param {string} photoId */
	async function select(photoId) {
		await setCover(recipe.id, photoId);
		status.say('This photo is the cover now.');
	}

	// The row opens at the cover. The photos keep their place when the owner selects a new
	// cover, so the photo under the finger does not move.
	$effect(() => {
		const cover = track?.querySelector('[data-cover]');
		if (track && cover instanceof HTMLElement) track.scrollLeft = cover.offsetLeft;
	});
</script>

<ul class="cover-carousel" aria-label="Photos of the finished meal" bind:this={track}>
	{#each photos as photo (photo.photoId)}
		{@const cover = photo.photoId === recipe.coverPhotoId}
		<li class="cover-carousel__slide" data-cover={cover ? '' : undefined}>
			<StoredPhoto
				id={photo.photoId}
				alt={photo.at ? `The finished meal on ${formatDate(photo.at)}` : 'The finished meal'}
			/>

			<div class="cover-carousel__bar">
				<span class="cover-carousel__date">
					{photo.at ? formatDate(photo.at) : 'From a recipe file'}
				</span>
				{#if cover}
					<span class="cover-carousel__label cover-carousel__label--cover">
						<Icon name="check" />
						Cover
					</span>
				{:else}
					<button
						class="cover-carousel__label cover-carousel__label--set"
						type="button"
						onclick={() => select(photo.photoId)}
					>
						Set as cover
					</button>
				{/if}
			</div>
		</li>
	{/each}
</ul>

<style>
	/* The row scrolls sideways and stops at each photo. */
	.cover-carousel {
		/* The script reads the place of the cover in this row. */
		position: relative;
		display: flex;
		gap: var(--space-3);
		margin: 0;
		padding: 0 0 var(--space-3);
		overflow-x: auto;
		list-style: none;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
	}

	.cover-carousel__slide {
		position: relative;
		flex: none;
		inline-size: 86%;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		scroll-snap-align: center;
	}

	/* The date and the cover control lie on the lower edge of the photo. */
	.cover-carousel__bar {
		position: absolute;
		inset-inline: var(--space-3);
		inset-block-end: var(--space-3);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
	}

	.cover-carousel__date,
	.cover-carousel__label {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--paper);
		background: var(--ink);
		border: 0;
		border-radius: var(--radius-sticker);

		& :global(.icon) {
			inline-size: 1rem;
			block-size: 1rem;
		}
	}

	.cover-carousel__label--cover {
		color: var(--ink);
		background: var(--olive);
	}

	.cover-carousel__label--set {
		min-block-size: var(--tap);
		padding-inline: var(--space-4);
		font: inherit;
		font-size: 0.8125rem;
		color: var(--ink);
		background: var(--card);
		border: 2px solid var(--ink);
		cursor: pointer;
	}
</style>
