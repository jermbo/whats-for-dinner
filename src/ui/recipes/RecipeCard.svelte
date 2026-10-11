<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { RecipeEntry } from '../../kitchen-state.svelte';
	import type { Ingredient } from '../../recipemd/types';
	import { isReady } from '../../recipes/browse';
	import Button from '../parts/Button.svelte';
	import Count from '../parts/Count.svelte';
	import Sticker from '../parts/Sticker.svelte';
	import WeekButton from '../parts/WeekButton.svelte';
	import IngredientRows from './IngredientRows.svelte';

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
	const line = $derived([...recipe.tags, ...recipe.yields.map((amount) => amount.text)].join(' · '));

	const statuses = $derived(new Map(match.ingredients.map((one) => [one.ingredient, one.status])));
	const statusOf = (ingredient: Ingredient) => statuses.get(ingredient);
</script>

<article class="wfd-recipe" class:wfd-recipe--week={planned}>
	<div class="wfd-recipe__top">
		<button
			class="wfd-recipe__main"
			type="button"
			aria-expanded={open}
			aria-controls="{uid}-body"
			onclick={() => (open = !open)}
		>
			<span class="wfd-recipe__name wfd-display">{recipe.title}</span>
			<span class="wfd-recipe__line wfd-label">{line}</span>
			{#if match.useSoon.length || isReady(entry) || entry.rating}
				<span class="wfd-recipe__flags">
					{#if match.useSoon.length}
						<Sticker label="Uses {match.useSoon.join(' · ')}" kind="tomato" />
					{/if}
					{#if isReady(entry)}
						<Sticker label="Ready" kind="olive" />
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
			{#if recipe.description}
				<p class="wfd-recipe__description">{recipe.description}</p>
			{/if}
			<IngredientRows ingredients={recipe.ingredients} groups={recipe.groups} {statusOf} />
			<div class="wfd-recipe__actions">
				<Button onclick={onopen}>Open the note</Button>
				<Button kind="main" onclick={oncook}>Cook →</Button>
			</div>
		</div>
	{/if}
</article>

<style>
	.wfd-recipe {
		border: 2px solid transparent;
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-card);
		transition: border-color 0.2s ease-out;
	}

	/* A recipe that is in the week has an ink edge. */
	.wfd-recipe--week {
		border-color: var(--wfd-ink);
	}

	.wfd-recipe__top {
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: 12px;
		align-items: center;
		padding: 12px 12px 12px 16px;
	}

	button.wfd-recipe__main {
		display: grid;
		gap: 6px;
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
			outline: 3px solid var(--wfd-olive);
			outline-offset: 4px;
		}
	}

	.wfd-recipe__name {
		font-size: 24px;
	}

	.wfd-recipe__line {
		color: var(--wfd-ink-2);
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
		border-block-start: var(--wfd-rule-4) solid var(--wfd-ink);
		color: var(--wfd-ink-2);
		font-size: 15px;
		white-space: pre-line;
	}

	.wfd-recipe__actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin-block-start: 16px;
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-recipe {
			transition: none;
		}
	}
</style>
