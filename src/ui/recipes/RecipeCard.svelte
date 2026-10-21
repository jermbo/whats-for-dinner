<script lang="ts">
	import { linear } from 'svelte/easing';
	import { prefersReducedMotion, Tween } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import { isReady } from '../../recipes/browse';
	import type { RecipeEntry } from '../../recipes/types';
	import Count from '../parts/Count.svelte';
	import InkCard from '../parts/InkCard.svelte';
	import Sticker from '../parts/Sticker.svelte';
	import WeekButton from '../parts/WeekButton.svelte';
	import { scrollToTop } from '../scroll-to-top';
	import RecipeEdit from './RecipeEdit.svelte';
	import RecipeNeeds from './RecipeNeeds.svelte';

	type Props = {
		kitchen: Kitchen;
		entry: RecipeEntry;
		planned: boolean;
		open: boolean;
		// The card closes: its ink goes back and its inside fades, before the inside goes.
		leaving: boolean;
		ontoggle: () => void;
		onweek: () => void;
		oncook: (event: MouseEvent) => void;
		// The photo of the newest meal, or null. A tap on it opens the gallery.
		photo: string | null;
		ongallery: (event: MouseEvent) => void;
	};
	let { kitchen, entry, planned, open, leaving, ontoggle, onweek, oncook, photo, ongallery }: Props =
		$props();

	const uid = $props.id();
	const { recipe, match } = $derived(entry);
	const instant = $derived(prefersReducedMotion.current);
	const duration = $derived(instant ? 0 : 200);
	// The meter starts as the ink covers the card. One piece of the meter is one step of the count.
	const start = 150;
	const step = 55;

	// "Dinner · chicken · one pot · 4 servings"
	const line = $derived.by(() => {
		const text = [...recipe.tags, ...recipe.yields.map((amount) => amount.text)].join(' · ');
		return text.charAt(0).toUpperCase() + text.slice(1);
	});

	let card = $state<HTMLElement>();

	// The count of the head runs up from 0 with the meter when the card opens.
	const count = new Tween(0, { duration: 0 });
	$effect(() => {
		const have = match.inPantry;
		if (!open || instant) return void count.set(have, { duration: 0 });
		count.set(0, { duration: 0 });
		const timer = setTimeout(
			() => count.set(have, { duration: have * step, easing: linear }),
			start
		);
		return () => clearTimeout(timer);
	});

	// The card moves to the top of the screen as it opens.
	$effect(() => {
		if (open && card) scrollToTop(card);
	});

	// Edit: paper spreads from the button, and the form comes in on it when the paper covers about
	// half the card. A card that closes closes its form too.
	let editing = $state(false);
	let showForm = $state(false);
	$effect(() => {
		if (!open) editing = false;
	});
	$effect(() => {
		const form = open && editing;
		const timer = setTimeout(() => (showForm = form), instant ? 0 : 140);
		return () => clearTimeout(timer);
	});
	function edit() {
		editing = true;
		if (card) scrollToTop(card);
	}

	// The inside shows at its full height at once, so that no frame needs a new layout of the list.
	// Only its opacity moves.
</script>

<div class="wfd-recipe" class:wfd-recipe--open={open} bind:this={card}>
	<InkCard {open} paper={editing} flush>
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
				onclick={ontoggle}
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

			<Count have={Math.round(count.current)} of={match.ingredients.length} />
			<WeekButton name={recipe.title} {planned} onclick={onweek} />
		</div>

		{#if open || leaving}
			<div
				class="wfd-recipe__body"
				class:wfd-recipe__body--leaving={leaving}
				id="{uid}-body"
				in:fade={{ duration }}
			>
				{#if showForm}
					<RecipeEdit {kitchen} path={entry.path} onclose={() => (editing = false)} />
				{:else}
					<RecipeNeeds
						{entry}
						{start}
						{step}
						{oncook}
						onedit={edit}
						onnote={() => kitchen.open(entry.path)}
						onclose={ontoggle}
					/>
				{/if}
			</div>
		{/if}
	</InkCard>
</div>

<style>
	.wfd-recipe__top {
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: var(--wfd-space-stack);
		align-items: center;
		padding: var(--wfd-space-inset);
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

	/* The open recipe has the largest name of the list, so you see it first. */
	.wfd-recipe__name {
		font-size: var(--wfd-font-size-name);
	}

	.wfd-recipe--open .wfd-recipe__name {
		font-size: var(--wfd-font-size-title);
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
		transition: opacity var(--wfd-chip-motion);
	}

	.wfd-recipe__body--leaving {
		opacity: 0;
	}

</style>
