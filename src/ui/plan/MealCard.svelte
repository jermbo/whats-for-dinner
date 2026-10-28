<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { PlannedSide } from '../../plan/plan-note';
	import type { Meal } from '../../plan/types';
	import { typeOf } from '../../recipes/browse';
	import { showName } from '../../match/names';
	import type { RecipeEntry } from '../../recipes/types';
	import Button from '../parts/Button.svelte';
	import Count from '../parts/Count.svelte';
	import InkCard from '../parts/InkCard.svelte';
	import Sticker from '../parts/Sticker.svelte';
	import PrepNote from '../recipes/PrepNote.svelte';
	import { coverThen } from '../cover';
	import SideField from './SideField.svelte';

	type Props = {
		meal: Meal;
		// The meal that you flagged for tonight: a large dark card, with its preparation.
		tonight: boolean;
		// The recipes that can be a side, in the sequence "best for the pantry".
		recipes: RecipeEntry[];
		ontonight: (on: boolean) => void;
		onprep: (done: boolean) => void;
		onremove: () => void;
		oncook: (path: string) => void;
		onaddside: (side: PlannedSide) => void;
		onremoveside: (index: number) => void;
	};
	let {
		meal,
		tonight,
		recipes,
		ontonight,
		onprep,
		onremove,
		oncook,
		onaddside,
		onremoveside
	}: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	const { path, entry, prepDone, sides } = $derived(meal);
	// Preparation that waits comes before "Cook": the main button is the one that you need next.
	const ready = $derived(!entry?.prep || prepDone);
	const type = $derived(entry ? typeOf(entry) : null);

	// "2 to buy" counts each dish of the meal that has a recipe.
	const dishes = $derived([entry, ...sides.map((side) => side.entry)].filter((one) => one !== null));
	const toBuy = $derived(
		dishes.reduce((sum, dish) => sum + dish.match.ingredients.length - dish.match.inPantry, 0)
	);
	const toCheck = $derived(
		dishes.reduce(
			(sum, dish) => sum + dish.match.ingredients.filter((one) => one.status === 'unknown').length,
			0
		)
	);
	const useSoon = $derived([...new Set(dishes.flatMap((dish) => dish.match.useSoon))]);

	// A dish is in a meal one time, so the field does not offer the dishes that the meal has.
	const inMeal = $derived(new Set([path, ...sides.map((side) => side.path)]));
	const offered = $derived(recipes.filter((recipe) => !inMeal.has(recipe.path)));

	let addingSide = $state(false);

	function addSide(side: PlannedSide) {
		addingSide = false;
		onaddside(side);
	}
</script>

<!-- The meal of tonight is an open card: its ink spreads from the star. -->
<InkCard open={tonight}>
	<article class="wfd-meal" class:wfd-meal--tonight={tonight}>
		<div class="wfd-meal__top">
			<h3 class="wfd-meal__name wfd-display">{showName(entry?.recipe.title ?? path)}</h3>
			{#if entry}
				<Count have={entry.match.inPantry} of={entry.match.ingredients.length} />
			{/if}
		</div>

		{#if type || (entry?.prep && !tonight)}
			<div class="wfd-meal__labels">
				{#if type}<span class="wfd-meal__type wfd-label">{type}</span>{/if}
				{#if entry?.prep && !tonight}<Sticker label="Prep" />{/if}
			</div>
		{/if}

		{#if sides.length}
			<ul class="wfd-meal__sides">
				{#each sides as side, index (`${index}-${side.path ?? side.name}`)}
					<li class="wfd-meal__side" transition:slide={{ duration }}>
						<span class="wfd-meal__side-name">{showName(side.entry?.recipe.title ?? side.name)}</span>
						{#if side.entry}
							<Count have={side.entry.match.inPantry} of={side.entry.match.ingredients.length} />
						{/if}
						<span class="wfd-meal__side-actions">
							{#if side.entry && side.path}
								{@const sidePath = side.path}
								<Button
									kind="link"
									onclick={(event) => coverThen(event, 'frame', () => oncook(sidePath))}>Cook</Button
								>
							{/if}
							<Button
								kind="link"
								aria-label="Remove {side.name}"
								onclick={() => onremoveside(index)}>Remove</Button
							>
						</span>
					</li>
				{/each}
			</ul>
		{/if}

		{#if addingSide}
			<div transition:slide={{ duration }}>
				<SideField recipes={offered} onadd={addSide} oncancel={() => (addingSide = false)} />
			</div>
		{:else}
			<div class="wfd-meal__add-side">
				<Button kind="link" onclick={() => (addingSide = true)}>+ Side</Button>
			</div>
		{/if}

		<div class="wfd-meal__facts">
			{#if entry}
				<span class="wfd-label">
					{toBuy ? `${toBuy} to buy` : 'All in the pantry'}{toCheck ? ` · ${toCheck} to check` : ''}
				</span>
				{#if useSoon.length}
					<Sticker label="Uses {useSoon.join(' · ')}" kind="tomato" />
				{/if}
			{:else}
				<span class="wfd-label">The note of this recipe is gone</span>
			{/if}
		</div>

		{#if tonight && entry?.prep}
			<PrepNote text={entry.prep} done={prepDone} onchange={onprep} />
		{/if}

		<div class="wfd-meal__actions">
			<button
				class="wfd-meal__flag"
				class:wfd-meal__flag--on={tonight}
				type="button"
				aria-pressed={tonight}
				aria-label="{showName(entry?.recipe.title ?? path)} for tonight"
				data-ink-from
				onclick={() => ontonight(!tonight)}
			>
				<span aria-hidden="true">{tonight ? '★' : '☆'}</span>
				Tonight
			</button>
			{#if entry}
				<Button
					kind={tonight && ready ? 'olive' : 'quiet'}
					arrow={tonight && ready}
					onclick={(event) => coverThen(event, 'frame', () => oncook(path))}
				>
					Cook
				</Button>
			{/if}
		</div>
		<div class="wfd-meal__remove">
			<Button kind="link" onclick={onremove}>Remove</Button>
		</div>
	</article>
</InkCard>

<style>
	.wfd-meal {
		display: grid;
		gap: var(--wfd-space-stack);
		align-content: space-between;
		block-size: 100%;
	}

	.wfd-meal__top {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: start;
		justify-content: space-between;
	}

	.wfd-meal__name {
		margin: 0;
		color: var(--wfd-color-text);
		font-size: var(--wfd-font-size-name);
		overflow-wrap: anywhere;
	}

	/* The meal of tonight is the largest name of the Plan, so you see it first. */
	.wfd-meal--tonight .wfd-meal__name {
		font-size: var(--wfd-font-size-title);
	}

	.wfd-meal__labels {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group);
		align-items: center;
	}

	.wfd-meal__type {
		color: var(--wfd-color-text-muted);
		text-transform: capitalize;
	}

	.wfd-meal__sides {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-meal__side {
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: var(--wfd-space-group);
		align-items: center;
		min-block-size: var(--wfd-control);
		border-block-start: var(--wfd-border-thin) solid var(--wfd-color-border);
	}

	.wfd-meal__side-name {
		grid-column: 1;
		color: var(--wfd-color-text);
	}

	.wfd-meal__side-actions {
		display: flex;
		grid-column: 3;
		gap: var(--wfd-space-group);
	}

	.wfd-meal__add-side,
	.wfd-meal__remove {
		display: flex;
	}

	.wfd-meal__remove {
		justify-content: center;
	}

	.wfd-meal__facts {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group);
		align-items: center;
		padding-block-end: var(--wfd-space-inset);
		border-block-end: var(--wfd-border) solid var(--wfd-color-border);
		color: var(--wfd-color-text-muted);
	}

	.wfd-meal__actions {
		display: grid;
		grid-auto-columns: 1fr;
		grid-auto-flow: column;
		gap: var(--wfd-space-stack);
	}

	/* A dashed edge is a flag that you can set. When it is on, it is full, in the accent colour. */
	button.wfd-meal__flag {
		display: inline-flex;
		gap: var(--wfd-space-group);
		align-items: center;
		justify-content: center;
		block-size: auto;
		min-block-size: var(--wfd-control);
		border: var(--wfd-border) dashed var(--wfd-color-text-muted);
		border-radius: var(--wfd-radius-button);
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		font-size: var(--wfd-font-size-text);
		font-weight: 700;
		cursor: pointer;
		transition: background-color var(--wfd-motion-change) var(--wfd-ease-out);

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	button.wfd-meal__flag--on {
		border-style: solid;
		border-color: var(--wfd-color-primary);
		background: var(--wfd-color-primary);
		color: var(--wfd-color-on-primary);
	}
</style>
