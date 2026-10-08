<script>
	import RecipePhoto from '$lib/components/recipes/RecipePhoto.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { entryName } from '$lib/domain/menu';

	/** @typedef {import('$lib/domain/menu').MenuEntry} MenuEntry */

	/**
	 * One meal of the menu as a small card: the photo, and the name on one line.
	 * A tap turns the card: "onturn" gets the card element, and the back of the card opens on
	 * the full screen. A meal that is not ready has a clock on the photo: amber when it needs
	 * preparation, ink while it waits.
	 * @type {{ entry: MenuEntry, onturn: (card: HTMLElement) => void }}
	 */
	let { entry, onturn } = $props();

	const name = $derived(entryName(entry));

	/** @type {HTMLElement | undefined} */
	let card = $state();
</script>

<article class="mini-card" bind:this={card}>
	{#key entry.recipe.id}
		<RecipePhoto recipe={entry.recipe} variant="thumb" />
	{/key}

	{#if entry.state !== 'ready'}
		<span class={['mini-card__flag', `mini-card__flag--${entry.state}`]}>
			<Icon name="clock" />
			<span class="visually-hidden">
				{entry.state === 'todo' ? 'Needs preparation.' : 'In preparation.'}
			</span>
		</span>
	{/if}

	<!-- The button covers the full card. -->
	<button class="mini-card__turn" type="button" onclick={() => card && onturn(card)}>
		<span class="visually-hidden">Turn the card: details of</span>
		{name}
	</button>
</article>

<style>
	.mini-card {
		position: relative;
		display: grid;
		gap: var(--space-1);
		transition:
			scale 0.25s var(--ease-spring),
			translate 0.3s var(--ease-out);

		&:active {
			scale: 0.95;
		}

		/* Only for a mouse: on a touch screen, a hover stays after the tap. */
		@media (hover: hover) {
			&:hover {
				translate: 0 -0.15rem;
			}
		}

		& :global(.recipe-photo) {
			inline-size: 100%;
			box-shadow: var(--shadow-small);
		}
	}

	/* The name has one line. */
	.mini-card__turn {
		padding: 0;
		overflow: hidden;
		font-size: 0.75rem;
		font-weight: 600;
		line-height: 1.25;
		text-align: start;
		text-overflow: ellipsis;
		white-space: nowrap;
		background: none;
		border: 0;
		cursor: pointer;

		&::after {
			position: absolute;
			inset: 0;
			content: '';
			border-radius: var(--radius-control);
		}

		&:focus-visible {
			outline: none;

			&::after {
				outline: var(--focus-ring);
				outline-offset: 2px;
			}
		}
	}

	/* A round label on the corner of the photo, for a meal that is not ready. */
	.mini-card__flag {
		position: absolute;
		inset-block-start: calc(-1 * var(--space-1));
		inset-inline-start: calc(-1 * var(--space-1));
		display: grid;
		place-items: center;
		inline-size: 1.5rem;
		block-size: 1.5rem;
		border-radius: var(--radius-sticker);

		& :global(.icon) {
			inline-size: 1rem;
			block-size: 1rem;
		}

		&.mini-card__flag--todo {
			color: var(--ink);
			background: var(--amber);
		}

		&.mini-card__flag--waiting {
			color: var(--paper);
			background: var(--ink);
		}
	}
</style>
