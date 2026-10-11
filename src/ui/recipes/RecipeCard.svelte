<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { RecipeEntry } from '../../kitchen-state.svelte';
	import type { Ingredient } from '../../recipemd/types';
	import { isReady } from '../../recipes/browse';
	import { withoutPrep } from '../../recipes/prep';
	import Button from '../parts/Button.svelte';
	import Count from '../parts/Count.svelte';
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
	};
	let { entry, planned, onweek, oncook, onopen }: Props = $props();

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

<article class="wfd-recipe">
	<div class="wfd-recipe__top">
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
				<Button kind="main" onclick={oncook}>Cook →</Button>
			</div>
		</div>
	{/if}
</article>

<style>
	.wfd-recipe {
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-card);
	}

	.wfd-recipe__top {
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: 12px;
		align-items: center;
		padding: 14px 14px 14px 16px;
	}

	/* Obsidian puts the content of each button in the center. This button starts at the left. */
	button.wfd-recipe__main {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 6px;
		align-items: start;
		justify-content: stretch;
		justify-items: start;
		min-inline-size: 0;
		block-size: auto;
		min-block-size: 46px;
		padding: 0;
		border: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-ink);
		font-family: inherit;
		text-align: start;
		white-space: normal;
		cursor: pointer;

		&:focus-visible {
			outline: 2px solid var(--wfd-ink);
			outline-offset: 4px;
		}
	}

	.wfd-recipe__name {
		font-size: 21px;
	}

	.wfd-recipe__line {
		color: var(--wfd-ink-2);
		font-size: 14px;
		font-weight: 500;
		line-height: 1.4;
	}

	.wfd-recipe__flags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 10px;
		align-items: center;
	}

	.wfd-recipe__stars {
		font-size: 15px;
		letter-spacing: 1px;
	}

	.wfd-recipe__no-star {
		color: var(--wfd-track);
	}

	.wfd-recipe__body {
		padding: 0 16px 16px;
	}

	.wfd-recipe__description {
		margin: 0 0 8px;
		padding-block-start: 12px;
		border-block-start: 2px solid var(--wfd-ink);
		color: var(--wfd-ink-2);
		font-size: 15px;
		line-height: 1.45;
		white-space: pre-line;
	}

	.wfd-recipe__prep {
		margin-block: 12px 4px;
	}

	.wfd-recipe__actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin-block-start: 16px;
	}

</style>
