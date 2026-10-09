<script>
	import CookProgress from './CookProgress.svelte';

	/**
	 * The top of Cook mode, on the dark surround: one segment for each card, and the button
	 * that leaves Cook mode. The name of the recipe and the place of the owner are for screen
	 * readers: each card shows them to the eye.
	 * @type {{
	 *   name: string,
	 *   place: string,
	 *   titleId: string,
	 *   keys: string[],
	 *   index: number,
	 *   onleave: () => void
	 * }}
	 *   place: for example "Step 2 of 5". titleId: the ID of the title, for the label of the
	 *   dialog. keys: the key of each card. index: the place of the card on the screen.
	 */
	let { name, place, titleId, keys, index, onleave } = $props();
</script>

<header class="cook-head">
	<h1 class="visually-hidden" id={titleId}>Cook: {name}</h1>
	<p class="visually-hidden" aria-live="polite">{place}</p>

	<CookProgress {keys} {index} />

	<button class="cook-head__leave" type="button" onclick={onleave}>
		Exit
		<span class="visually-hidden">Cook mode. The app keeps your place.</span>
	</button>
</header>

<style>
	.cook-head {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: max(var(--space-1), env(safe-area-inset-top)) var(--space-2) 0 var(--space-4);
	}

	.cook-head__leave {
		flex: none;
		min-inline-size: var(--tap);
		min-block-size: var(--tap);
		padding: 0 var(--space-2);
		font-weight: 800;
		color: var(--paper);
		background: none;
		border: 0;
		border-radius: var(--radius-control);
		cursor: pointer;
		transition: scale 0.2s var(--ease-out);

		&:active {
			scale: 0.92;
		}

		/* The ring must show on the dark surround. */
		&:focus-visible {
			outline-color: var(--paper);
			box-shadow: none;
		}
	}
</style>
