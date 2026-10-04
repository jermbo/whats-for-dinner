<script>
	import { resolve } from '$app/paths';
	import RecipePhoto from '$lib/components/recipes/RecipePhoto.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { pantryCount } from '$lib/domain/availability';
	import { cookProgress, stepsToCook } from '$lib/domain/cook-cards';
	import { entryName } from '$lib/domain/menu';
	import { hasPhoto } from '$lib/domain/recipe-photo';
	import { oldestUse, stockAge, URGENT_DAYS } from '$lib/domain/use-up';
	import { photoMorph } from '$lib/motion/photo-morph';
	import { useKitchen } from '$lib/state/kitchen.svelte';
	import { formatWhen } from '$lib/util/format';
	import CardTimer from './CardTimer.svelte';

	/** @typedef {import('$lib/domain/menu').MenuEntry} MenuEntry */

	/** One hour, in milliseconds. */
	const HOUR = 60 * 60 * 1000;

	/**
	 * One meal on the "Today" screen, as a card. The front has the photo, the olive pack label
	 * with the name, the state of the pantry, and the actions. With no photo, the card is olive,
	 * and the name is the picture.
	 * The square button turns the card: "onturn" gets the card element, and the hand opens the
	 * back of the card on the full screen.
	 * Face down, the card shows only its cover: the hand uses this for a shuffle.
	 * A meal that is not ready has a sticker: it tells that the owner must prepare, or when the
	 * meal is ready. The back of the card shows what the preparation is.
	 * The line "In the pantry" shows the oldest food that the meal uses, and the count tells how
	 * many of the ingredients the pantry has. Leftovers use no ingredients, so they have no count.
	 * A meal that the owner is cooking has an ink outline, the timer on the photo, and the bar
	 * of its steps. Its main action is "Continue".
	 * A recipe with steps has two actions. "Cook" opens Cook mode with "onstart".
	 * "Cooked" is the one-tap path for a meal that the owner knows from memory.
	 * @type {{
	 *   entry: MenuEntry,
	 *   soon?: import('$lib/domain/use-up').SoonItem[],
	 *   session?: import('$lib/types').CookSession,
	 *   facedown?: boolean,
	 *   onturn?: (card: HTMLElement) => void,
	 *   onstart?: (entry: MenuEntry) => void,
	 *   oncook: (entry: MenuEntry) => void,
	 *   onprep?: (entry: MenuEntry) => unknown
	 * }}
	 */
	let { entry, soon = [], session, facedown = false, onturn, onstart, oncook, onprep } = $props();

	const kitchen = useKitchen();

	/** Cook mode shows the steps of a recipe. Leftovers have no steps to do. */
	const hasSteps = $derived(entry.item.kind === 'recipe' && stepsToCook(entry.recipe).length > 0);
	const cooking = $derived(session !== undefined);
	const photo = $derived(hasPhoto(entry.recipe));

	const name = $derived(entryName(entry));
	const lead = $derived(Math.max(0, ...entry.recipe.prepSteps.map((step) => step.leadHours)));
	const count = $derived(
		pantryCount(entry.recipe, kitchen.ingredientsById, kitchen.pantryByIngredient)
	);
	const oldest = $derived(oldestUse(entry.recipe, soon));
	const progress = $derived(session ? cookProgress(entry.recipe, session) : null);

	/** What a meal that needs preparation says, for a card with no photo. */
	const lede = $derived.by(() => {
		if (entry.state !== 'todo') return '';
		const task = entry.recipe.prepSteps[0]?.text.trim().replace(/\.$/, '') ?? 'Prepare';
		return `${task}. Ready ${formatWhen(Date.now() + lead * HOUR)} if you start now.`;
	});

	/** @type {HTMLElement | undefined} */
	let card = $state();
</script>

<article class={['meal-card', facedown && 'meal-card--down']} bind:this={card} use:photoMorph>
	<div
		class={[
			'meal-card__front',
			'card',
			'pack',
			!photo && 'pack--plain',
			cooking && 'meal-card__front--cooking'
		]}
		inert={facedown}
	>
		{#if photo}
			<!-- The title below is the link for the keyboard and for screen readers. -->
			<a
				class="pack__media"
				href={resolve('/recipes/[id]', { id: entry.recipe.id })}
				tabindex="-1"
				aria-hidden="true"
			>
				{#key entry.recipe.id}
					<RecipePhoto recipe={entry.recipe} />
				{/key}
				{#if session}
					<CardTimer {session} />
				{/if}
			</a>
		{/if}

		<div class="pack__band">
			<!-- The sticker sits on the top edge of the band. -->
			<p class="pack__flag">
				{#if cooking}
					<span class="sticker sticker--olive">In progress</span>
				{:else if entry.state === 'todo'}
					<span class="sticker sticker--paper">
						<span class="sticker__dot"></span>
						Prepare {lead} h before
					</span>
				{:else if entry.state === 'waiting' && entry.readyAt}
					<span class="sticker sticker--paper">
						<Icon name="clock" />
						Ready {formatWhen(entry.readyAt)}
					</span>
				{:else}
					<span class="sticker">{entry.item.kind === 'leftover' ? 'Leftovers' : 'Ready'}</span>
				{/if}
			</p>

			<h3 class="pack__name">
				<a href={resolve('/recipes/[id]', { id: entry.recipe.id })}>{name}</a>
			</h3>

			{#if !photo && lede}
				<p class="pack__lede">{lede}</p>
			{/if}
		</div>

		{#if onturn}
			<button class="meal-card__turn" type="button" onclick={() => card && onturn(card)}>
				<Icon name="turn" />
				<span class="visually-hidden">Turn the card: details of {name}</span>
			</button>
		{/if}

		<div class="pack__foot">
			{#if progress}
				<div class="pack__steps">
					<p class="pack__steps-line label">
						<span>Step {progress.step} of {progress.total}</span>
					</p>
					<span class="meal-card__bar" aria-hidden="true">
						{#each { length: progress.total }, index (index)}
							<span class={['meal-card__part', index < progress.step && 'meal-card__part--done']}
							></span>
						{/each}
					</span>
				</div>
				<div class="pack__line">
					<p>
						<span class="label">Next step</span>
						<span class="pack__sub">
							{progress.next ? progress.next.split(/(?<=[.!?])\s/)[0] : 'Finish the meal.'}
						</span>
					</p>
					<p class="count" aria-hidden="true">
						{progress.step}<span class="count__total">/{progress.total}</span>
					</p>
				</div>
			{:else if entry.item.kind === 'recipe'}
				<div class="pack__line">
					<p>
						<span class="label">In the pantry</span>
						{#if oldest}
							<span class={['pack__sub', oldest.days >= URGENT_DAYS && 'pack__sub--urgent']}>
								{oldest.ingredient.name}: {stockAge(oldest.days).toLowerCase()}
							</span>
						{:else}
							<span class="pack__sub">
								{count.have === count.need
									? 'All ingredients are here.'
									: `${count.need - count.have} to buy.`}
							</span>
						{/if}
					</p>
					{#if count.need > 0}
						<p class="count">
							<span aria-hidden="true"
								>{count.have}<span class="count__total">/{count.need}</span></span
							>
							<span class="visually-hidden">
								The pantry has {count.have} of {count.need} ingredients.
							</span>
						</p>
					{/if}
				</div>
			{/if}

			<div class="pack__actions">
				{#if cooking && onstart}
					<button
						class="button button--strong pack__main"
						type="button"
						onclick={() => onstart(entry)}
					>
						Continue <span class="visually-hidden">: {name}</span>
					</button>
				{:else if entry.state === 'todo' && onprep}
					<button
						class="button button--strong pack__main"
						type="button"
						onclick={() => onprep(entry)}
					>
						Preparation done <span class="visually-hidden">: {name}</span>
					</button>
					{#if onturn}
						<button
							class="button meal-card__details"
							type="button"
							onclick={() => card && onturn(card)}
						>
							Details <span class="visually-hidden">: {name}</span>
						</button>
					{/if}
				{:else if onstart && hasSteps}
					<button
						class={['button', 'pack__main', entry.state === 'ready' && 'button--strong']}
						type="button"
						onclick={() => onstart(entry)}
					>
						Cook <span class="visually-hidden">: {name}</span>
					</button>
					<button class="button" type="button" onclick={() => oncook(entry)}>
						Cooked <span class="visually-hidden">: {name}</span>
					</button>
				{:else}
					<button
						class={['button', 'pack__main', entry.state === 'ready' && 'button--strong']}
						type="button"
						onclick={() => oncook(entry)}
					>
						Cooked <span class="visually-hidden">: {name}</span>
					</button>
				{/if}
			</div>
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
	 * back of a photo through "backface-visibility".
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

	/* A meal that the owner cooks stays on top with an ink outline. */
	.meal-card__front--cooking {
		outline: 3px solid var(--ink);
		outline-offset: -3px;
	}

	/*
	 * The cover of a card that is face down: ink, with an olive rule and the name of the app.
	 * It goes away only after the face is turned away, so that the eye does not see the change.
	 */
	.meal-card > .meal-card__cover {
		position: absolute;
		inset: 0;
		visibility: hidden;
		display: grid;
		place-items: center;
		background: var(--ink);
		border-radius: var(--radius);
		box-shadow:
			inset 0 0 0 0.6rem var(--ink),
			inset 0 0 0 0.75rem var(--olive),
			var(--shadow);
		opacity: 0;
		pointer-events: none;
		transform: rotateY(180deg);
		transition-delay: 0s, 0s, 0s, 0.25s, 0.3s;

		&::after {
			content: 'Larder';
			font-family: var(--font-display);
			font-size: 3rem;
			line-height: 0.9;
			text-transform: uppercase;
			color: var(--olive);
		}
	}

	.meal-card--down > .meal-card__cover {
		visibility: visible;
		opacity: 1;
		transform: rotateY(0deg);
		transition-delay: 0s;
	}

	/* A square button at the top right: ink, as a label on the pack. */
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
		color: var(--paper);
		background: var(--ink);
		border: 0;
		border-radius: var(--radius-sticker);
		cursor: pointer;
		transition:
			scale 0.2s var(--ease-out),
			rotate 0.4s var(--ease-out);

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

	/* The bar of the steps: one part for each step. The parts that are done are ink. */
	.meal-card__bar {
		display: flex;
		gap: 3px;
	}

	.meal-card__part {
		flex: 1;
		block-size: 0.5rem;
		background: var(--paper-deep);

		&.meal-card__part--done {
			background: var(--ink);
		}
	}

	/* A wide hand shows the facts of the top card next to the pile: no button turns the card. */
	@container hand (min-width: 36rem) {
		.meal-card__turn,
		.meal-card__details {
			display: none;
		}
	}
</style>
