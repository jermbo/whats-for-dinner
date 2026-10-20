<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { RecipeEntry } from '../../recipes/types';
	import type { Ingredient } from '../../recipemd/types';
	import { isReady } from '../../recipes/browse';
	import { withoutPrep } from '../../recipes/prep';
	import Button from '../parts/Button.svelte';
	import Count from '../parts/Count.svelte';
	import Panel from '../parts/Panel.svelte';
	import Sticker from '../parts/Sticker.svelte';
	import WeekButton from '../parts/WeekButton.svelte';
	import IngredientRows from './IngredientRows.svelte';
	import PrepNote from './PrepNote.svelte';

	type Props = {
		entry: RecipeEntry;
		planned: boolean;
		onweek: () => void;
		oncook: () => void;
		onopen: () => void;
		onedit: () => void;
		// The photo of the newest meal, or null. A tap on it opens the gallery.
		photo: string | null;
		ongallery: () => void;
	};
	let { entry, planned, onweek, oncook, onopen, onedit, photo, ongallery }: Props = $props();

	const uid = $props.id();
	const { recipe, match } = $derived(entry);
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	let open = $state(false);

	// "Dinner · chicken · one pot · 4 servings"
	const line = $derived.by(() => {
		const text = [...recipe.tags, ...recipe.yields.map((amount) => amount.text)].join(' · ');
		return text.charAt(0).toUpperCase() + text.slice(1);
	});

	// The preparation has its own box, so the description shows without the callout.
	const description = $derived(withoutPrep(recipe.description ?? ''));

	const statuses = $derived(new Map(match.ingredients.map((one) => [one.ingredient, one.status])));
	const statusOf = (ingredient: Ingredient) => statuses.get(ingredient);
</script>

<Panel flush>
	<article class="wfd-recipe">
		<div class="wfd-recipe__top" class:wfd-recipe__top--photo={photo}>
			{#if photo}
				<button
					class="wfd-recipe__photo"
					type="button"
					aria-label="The meals of {recipe.title}"
					onclick={ongallery}
				>
					<img src={photo} alt="" />
				</button>
			{/if}
			<button
				class="wfd-recipe__main"
				type="button"
				aria-expanded={open}
				aria-controls="{uid}-body"
				onclick={() => (open = !open)}
			>
				<span class="wfd-recipe__name wfd-display">{recipe.title}</span>
				<span class="wfd-recipe__line">{line}</span>
				{#if match.useSoon.length || isReady(entry) || entry.prep || entry.rating}
					<span class="wfd-recipe__flags">
						{#if match.useSoon.length}
							<Sticker label="Uses {match.useSoon.join(' · ')}" kind="tomato" />
						{/if}
						{#if isReady(entry)}
							<Sticker label="Ready" kind="olive" />
						{/if}
						{#if entry.prep}
							<Sticker label="Prep" kind="dashed" />
						{/if}
						{#if entry.rating}
							<span class="wfd-recipe__stars" aria-label="Rating: {entry.rating} of 5">
								{'★'.repeat(entry.rating)}<span class="wfd-recipe__no-star"
									>{'★'.repeat(5 - entry.rating)}</span
								>
							</span>
						{/if}
					</span>
				{/if}
			</button>

			<Count have={match.inPantry} of={match.ingredients.length} />
			<WeekButton name={recipe.title} {planned} onclick={onweek} />
		</div>

		{#if open}
			<div class="wfd-recipe__body" id="{uid}-body" transition:slide={{ duration }}>
				{#if description}
					<p class="wfd-recipe__description">{description}</p>
				{/if}
				{#if entry.prep}
					<div class="wfd-recipe__prep">
						<PrepNote text={entry.prep} />
					</div>
				{/if}
				<IngredientRows ingredients={recipe.ingredients} groups={recipe.groups} {statusOf} />
				<div class="wfd-recipe__actions">
					<Button onclick={onopen}>Open note</Button>
					<Button onclick={onedit}>Edit</Button>
					<Button kind="main" onclick={oncook}>Cook →</Button>
				</div>
			</div>
		{/if}
	</article>
</Panel>

<style>

	.wfd-recipe__top {
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: var(--wfd-space-stack);
		align-items: center;
		padding: var(--wfd-space-inset) var(--wfd-space-inset) var(--wfd-space-inset) var(--wfd-space-inset);
	}

	.wfd-recipe__top--photo {
		grid-template-columns: auto 1fr auto auto;
	}

	/* The photo of the newest meal: a small square, so that the list stays compact. */
	button.wfd-recipe__photo {
		inline-size: 56px;
		block-size: 56px;
		padding: 0;
		overflow: hidden;
		border: 0;
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-track);
		box-shadow: none;
		cursor: pointer;
		transition: scale var(--wfd-button-motion);

		& img {
			inline-size: 100%;
			block-size: 100%;
			object-fit: cover;
		}

		&:active {
			scale: 0.95;
		}

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	/* Obsidian puts the content of each button in the center. This button starts at the left. */
	button.wfd-recipe__main {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-group);
		align-items: start;
		justify-content: stretch;
		justify-items: start;
		min-inline-size: 0;
		block-size: auto;
		min-block-size: var(--wfd-control-min);
		padding: 0;
		border: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		text-align: start;
		white-space: normal;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 4px;
		}
	}

	.wfd-recipe__name {
		font-size: var(--wfd-font-size-name);
	}

	.wfd-recipe__line {
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
		font-weight: 500;
		line-height: var(--wfd-line-height-text);
	}

	.wfd-recipe__flags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group) var(--wfd-space-stack);
		align-items: center;
	}

	.wfd-recipe__stars {
		font-size: var(--wfd-font-size-small);
		letter-spacing: 1px;
	}

	.wfd-recipe__no-star {
		color: var(--wfd-color-track);
	}

	.wfd-recipe__body {
		padding: 0 var(--wfd-space-inset) var(--wfd-space-inset);
	}

	.wfd-recipe__description {
		margin: 0 0 var(--wfd-space-group);
		padding-block-start: var(--wfd-space-inset);
		border-block-start: var(--wfd-border) solid var(--wfd-color-border);
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
		line-height: var(--wfd-line-height-text);
		white-space: pre-line;
	}

	.wfd-recipe__prep {
		margin-block: var(--wfd-space-stack) var(--wfd-space-tight);
	}

	/* "Cook" is the main button, so it keeps the widest place, at the end of the row. */
	.wfd-recipe__actions {
		display: grid;
		grid-template-columns: auto auto 1fr;
		gap: var(--wfd-space-stack);
		margin-block-start: var(--wfd-space-section);
	}

</style>
