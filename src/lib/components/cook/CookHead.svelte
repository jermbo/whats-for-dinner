<script>
	import Icon from '$lib/components/ui/Icon.svelte';

	/**
	 * The top of Cook mode: the button that leaves it, the name of the recipe, and the place
	 * of the owner in the cards.
	 * @type {{ name: string, place: string, titleId: string, onleave: () => void }}
	 *   place: for example "Step 2 of 5". titleId: the ID of the title, for the label of the dialog.
	 */
	let { name, place, titleId, onleave } = $props();
</script>

<header class="cook-head">
	<button class="cook-head__leave" type="button" onclick={onleave}>
		<Icon name="close" />
		<span class="visually-hidden">Leave Cook mode. The app keeps your place.</span>
	</button>
	<div class="cook-head__title">
		<h1 class="cook-head__name" id={titleId}>{name}</h1>
		<p class="cook-head__place" aria-live="polite">{place}</p>
	</div>
</header>

<style>
	.cook-head {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: max(var(--space-3), env(safe-area-inset-top)) var(--space-5) var(--space-3);
	}

	.cook-head__leave {
		display: grid;
		flex: none;
		place-items: center;
		inline-size: var(--tap);
		block-size: var(--tap);
		padding: 0;
		color: var(--paper);
		background: var(--ink);
		border: 0;
		border-radius: var(--radius-control);
		cursor: pointer;
		transition: scale 0.2s var(--ease-out);

		&:active {
			scale: 0.9;
		}
	}

	.cook-head__title {
		min-inline-size: 0;
	}

	.cook-head__name {
		overflow: hidden;
		font-size: 1.5rem;
		line-height: 1;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.cook-head__place {
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
</style>
