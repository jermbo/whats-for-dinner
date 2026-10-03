<script>
	import { resolve } from '$app/paths';
	import RecipePhoto from '$lib/components/recipes/RecipePhoto.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { entryName } from '$lib/data/menu';
	import { photoMorph } from '$lib/motion/photo-morph';
	import { formatWhen } from '$lib/util/format';

	/** @typedef {import('$lib/data/menu').MenuEntry} MenuEntry */

	/**
	 * One meal on the "Today" screen, as a card. The front has the photo and the actions.
	 * The round button turns the card: "onturn" gets the card element, and the hand opens the
	 * back of the card on the full screen. Face down, the card shows only its pattern: the hand
	 * uses this for a shuffle.
	 * A meal that is not ready has a flag on the photo: amber when it needs preparation, teal while
	 * it waits. The back of the card shows what the preparation is.
	 * @type {{
	 *   entry: MenuEntry,
	 *   facedown?: boolean,
	 *   onturn?: (card: HTMLElement) => void,
	 *   oncook: (entry: MenuEntry) => void
	 * }}
	 */
	let { entry, facedown = false, onturn, oncook } = $props();

	const name = $derived(entryName(entry));
	const lead = $derived(Math.max(0, ...entry.recipe.prepSteps.map((step) => step.leadHours)));

	/** @type {HTMLElement | undefined} */
	let card = $state();
</script>

<article class={['meal-card', facedown && 'meal-card--down']} bind:this={card} use:photoMorph>
	<div class="meal-card__front card card--media" inert={facedown}>
		<!-- The title below is the link for the keyboard and for screen readers. -->
		<a
			class="card__media"
			href={resolve('/recipes/[id]', { id: entry.recipe.id })}
			tabindex="-1"
			aria-hidden="true"
		>
			{#key entry.recipe.id}
				<RecipePhoto recipe={entry.recipe} />
			{/key}
			<!-- A meal that is not ready has the flag at the bottom of the photo in place of this label. -->
			{#if entry.state === 'ready'}
				<span class="card__tag">{entry.item.kind === 'leftover' ? 'Leftovers' : 'Ready'}</span>
			{/if}
			{#if entry.state === 'todo'}
				<span class="meal-card__flag meal-card__flag--todo">
					<Icon name="clock" />
					Prepare {lead} h before
				</span>
			{:else if entry.state === 'waiting' && entry.readyAt}
				<span class="meal-card__flag meal-card__flag--waiting">
					<Icon name="clock" />
					Ready {formatWhen(entry.readyAt)}
				</span>
			{/if}
		</a>

		{#if onturn}
			<button
				class={['meal-card__turn', entry.state === 'todo' && 'meal-card__turn--hint']}
				type="button"
				onclick={() => card && onturn(card)}
			>
				<Icon name="turn" />
				<span class="visually-hidden">Turn the card: details of {name}</span>
			</button>
		{/if}

		<div class="card__body">
			<h3 class="card__title">
				<a href={resolve('/recipes/[id]', { id: entry.recipe.id })}>{name}</a>
			</h3>

			{#if entry.state === 'todo'}
				<p class="muted">Turn the card to see the preparation.</p>
			{/if}

			<button
				class={['button', 'meal-card__cook', entry.state === 'ready' && 'button--strong']}
				type="button"
				onclick={() => oncook(entry)}
			>
				Cooked <span class="visually-hidden">: {name}</span>
			</button>
		</div>
	</div>

	<!-- The back of a card that is face down. -->
	<div class="meal-card__cover" aria-hidden="true"></div>
</article>

<style>
	.meal-card {
		position: relative;
		display: grid;
		perspective: 70rem;
	}

	/*
	 * Face down: the front turns away and the cover turns to the front, with a spring.
	 * A face that is turned away is also hidden after the turn, because some browsers show the
	 * back of a photo or of a blur through "backface-visibility".
	 * The selectors start with ".meal-card >", so that they are stronger than ".card".
	 */
	.meal-card > .meal-card__front,
	.meal-card > .meal-card__cover {
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		transition:
			transform 0.6s var(--ease-spring),
			translate 0.3s var(--ease-out),
			box-shadow 0.3s,
			opacity 0s,
			visibility 0s;
	}

	.meal-card > .meal-card__front {
		position: relative;
	}

	.meal-card--down > .meal-card__front {
		visibility: hidden;
		transform: rotateY(-180deg);
		transition-delay: 0s, 0s, 0s, 0s, 0.3s;
	}

	/*
	 * The pattern of a card that is face down: rings as a plate, on teal with lines.
	 * It goes away only after the face is turned away, so that the eye does not see the change.
	 */
	.meal-card > .meal-card__cover {
		position: absolute;
		inset: 0;
		visibility: hidden;
		background:
			radial-gradient(
				circle,
				transparent 0 2.25rem,
				rgb(255 255 255 / 0.9) 2.25rem 2.5rem,
				transparent 2.5rem 3.25rem,
				rgb(255 255 255 / 0.55) 3.25rem 3.4rem,
				transparent 3.4rem
			),
			repeating-linear-gradient(45deg, rgb(255 255 255 / 0.1) 0 0.6rem, transparent 0.6rem 1.2rem),
			var(--color-accent);
		border-radius: var(--radius);
		box-shadow:
			inset 0 0 0 0.6rem var(--color-accent),
			inset 0 0 0 0.75rem rgb(255 255 255 / 0.55),
			var(--shadow);
		opacity: 0;
		pointer-events: none;
		transform: rotateY(180deg);
		transition-delay: 0s, 0s, 0s, 0.25s, 0.3s;
	}

	.meal-card--down > .meal-card__cover {
		visibility: visible;
		opacity: 1;
		transform: rotateY(0deg);
		transition-delay: 0s;
	}

	/* A round button on the photo, as the label of the photo. */
	.meal-card__turn {
		position: absolute;
		z-index: 1;
		inset-block-start: var(--space-3);
		inset-inline-end: var(--space-3);
		display: grid;
		place-items: center;
		inline-size: 2.75rem;
		block-size: 2.75rem;
		padding: 0;
		color: #ffffff;
		background: rgb(0 0 0 / 0.55);
		border: 0;
		border-radius: 50%;
		backdrop-filter: blur(6px);
		cursor: pointer;
		transition:
			scale 0.25s var(--ease-spring),
			rotate 0.5s var(--ease-spring);

		/* Only for a mouse: on a touch screen, a hover stays after the tap. */
		@media (hover: hover) {
			&:hover {
				rotate: 90deg;
			}
		}

		&:active {
			scale: 0.9;
		}
	}

	/* A wide label at the bottom of the photo, for a meal that is not ready. */
	.meal-card__flag {
		position: absolute;
		inset-inline: var(--space-3);
		inset-block-end: var(--space-3);
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		font-size: 0.9rem;
		font-weight: 700;
		border-radius: var(--radius-pill);
		box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 0.18);

		& :global(.icon) {
			flex: none;
			inline-size: 1.15rem;
			block-size: 1.15rem;
		}

		&.meal-card__flag--todo {
			color: #3d2600;
			background: var(--color-low);
		}

		&.meal-card__flag--waiting {
			color: var(--color-on-accent);
			background: var(--color-accent-strong);
		}
	}

	/* A meal that needs preparation: the turn button has an amber ring that breathes. */
	@keyframes breathe {
		50% {
			box-shadow: 0 0 0 0.35rem rgb(255 212 128 / 0.55);
		}
	}

	.meal-card__turn--hint {
		box-shadow: 0 0 0 2px var(--color-low);
		animation: breathe 2.4s ease-in-out infinite;
	}

	/* "Cooked" stays at the bottom of a tall card. */
	.card__body {
		flex: 1;
	}

	.meal-card__cook {
		margin-block-start: auto;
	}

	.card__title a {
		color: inherit;
		text-decoration: none;
	}
</style>
