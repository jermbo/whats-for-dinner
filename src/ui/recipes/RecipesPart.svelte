<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { Kitchen, RecipeEntry } from '../../kitchen-state.svelte';
	import { inSequence, isFound, isReady, typeOf, typesOf, type Sort } from '../../recipes/browse';
	import Chip from '../parts/Chip.svelte';
	import Count from '../parts/Count.svelte';
	import FindField from '../parts/FindField.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import PartHead from '../parts/PartHead.svelte';
	import RecipeCard from './RecipeCard.svelte';

	type Props = {
		kitchen: Kitchen;
		oncook: (path: string) => void;
		// The type that the filter starts with, when you come from a type of the plan.
		startType?: string | null;
	};
	let { kitchen, oncook, startType = null }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	const sorts: { value: Sort; label: string }[] = [
		{ value: 'match', label: 'Best for the pantry' },
		{ value: 'type', label: 'By type' },
		{ value: 'rating', label: 'Best rating' },
		{ value: 'name', label: 'A to Z' }
	];
	let sort = $state<Sort>('match');

	// The text that finds a recipe.
	let find = $state('');
	// The filters. A recipe shows only if it passes each filter that is on.
	let ready = $state(false);
	let soon = $state(false);
	const firstType = () => startType;
	let type = $state<string | null>(firstType());

	const types = $derived(typesOf(kitchen.recipes));
	// A type with no recipe has no chip, so its filter cannot be on.
	const typeOn = $derived(type !== null && types.includes(type) ? type : null);
	const readyCount = $derived(kitchen.recipes.filter(isReady).length);

	const shown = $derived(
		inSequence(
			kitchen.recipes.filter(
				(entry) =>
					isFound(entry, find) &&
					(!ready || isReady(entry)) &&
					(!soon || entry.match.useSoon.length > 0) &&
					(!typeOn || typeOf(entry) === typeOn)
			),
			sort
		)
	);

	// The sequence by type has one group for each type. Each other sequence is one group.
	const groups = $derived.by((): { title: string; entries: RecipeEntry[] }[] => {
		if (sort !== 'type') return [{ title: '', entries: shown }];
		return typesOf(shown).map((title) => ({
			title,
			entries: shown.filter((entry) => typeOf(entry) === title)
		}));
	});

	const toggleWeek = (path: string) =>
		kitchen.isPlanned(path) ? kitchen.removeFromPlan(path) : kitchen.addToPlan(path);
</script>

<section class="wfd-recipes" aria-label="Recipes">
	<PartHead title="Recipes">
		{#snippet side()}
			<Count have={readyCount} of={kitchen.recipes.length} label="ready" />
		{/snippet}
	</PartHead>

	<div class="wfd-recipes__bar">
		<div class="wfd-recipes__tools">
			<FindField label="Find a recipe or ingredient" bind:value={find} />

			<div class="wfd-recipes__filters">
				<select class="wfd-recipes__sort" aria-label="Sequence of the recipes" bind:value={sort}>
					{#each sorts as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>

				<div class="wfd-recipes__chips" role="group" aria-label="Filters">
					<Chip label="Ready to cook" on={ready} onclick={() => (ready = !ready)} />
					<Chip label="Uses food soon" on={soon} onclick={() => (soon = !soon)} />
					{#each types as option}
						<Chip
							label={option.charAt(0).toUpperCase() + option.slice(1)}
							on={typeOn === option}
							onclick={() => (type = typeOn === option ? null : option)}
						/>
					{/each}
				</div>
			</div>
		</div>
	</div>

	{#if !shown.length}
		<p class="wfd-recipes__empty" aria-live="polite">
			{#if !kitchen.recipes.length}
				The vault has no recipes.
			{:else if find.trim() && !ready && !soon && !typeOn}
				No recipe has "{find.trim()}" in its name or in its ingredients.
			{:else}
				No recipe passes these filters.
			{/if}
		</p>
	{/if}

	{#each groups as group (group.title)}
		{#if group.title}
			<GroupHead title={group.title} note={String(group.entries.length)} />
		{/if}
		<ul class="wfd-recipes__list">
			{#each group.entries as entry (entry.path)}
				<li transition:slide={{ duration }}>
					<RecipeCard
						{entry}
						planned={kitchen.isPlanned(entry.path)}
						onweek={() => toggleWeek(entry.path)}
						oncook={() => oncook(entry.path)}
						onopen={() => kitchen.open(entry.path)}
					/>
				</li>
			{/each}
		</ul>
	{/each}

	{#if kitchen.rejected.length}
		<details class="wfd-recipes__rejected">
			<summary class="wfd-recipes__rejected-summary wfd-label">
				{kitchen.rejected.length}
				{kitchen.rejected.length === 1 ? 'note is not a recipe' : 'notes are not recipes'}
			</summary>
			<ul class="wfd-recipes__reasons">
				{#each kitchen.rejected as { path, reason } (path)}
					<li class="wfd-recipes__reason">
						<span class="wfd-recipes__path">{path}</span>
						<span class="wfd-recipes__why">{reason}</span>
					</li>
				{/each}
			</ul>
		</details>
	{/if}
</section>

<style>
	.wfd-recipes {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
	}

	/* The bar asks its own width: a phone gets two rows, and a wide tab gets one row. */
	.wfd-recipes__bar {
		container-type: inline-size;
	}

	.wfd-recipes__tools {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 6px 12px;
		align-items: center;
	}

	/* One row: the sequence stays, and the filters scroll to the side. */
	.wfd-recipes__filters {
		display: flex;
		gap: 10px;
		align-items: center;
		min-inline-size: 0;
	}

	@container (inline-size > 46rem) {
		.wfd-recipes__tools {
			grid-template-columns: minmax(12rem, 18rem) minmax(0, 1fr);
		}
	}

	.wfd-recipes :global(select.wfd-recipes__sort) {
		flex: none;
		min-block-size: 36px;
		padding-inline: 10px 28px;
		font-size: 14px;
		font-weight: 700;
	}

	.wfd-recipes__chips {
		display: flex;
		gap: 8px;
		min-inline-size: 0;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.wfd-recipes__empty {
		margin: 0;
		color: var(--wfd-ink-2);
	}

	.wfd-recipes__list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
		gap: 10px;
		align-items: start;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-recipes__rejected {
		margin-block-start: 16px;
		color: var(--wfd-ink-2);
	}

	.wfd-recipes__rejected-summary {
		display: flex;
		align-items: center;
		min-block-size: 44px;
		cursor: pointer;

		&:focus-visible {
			outline: 2px solid var(--wfd-ink);
			outline-offset: 2px;
		}
	}

	.wfd-recipes__reasons {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-recipes__reason {
		display: grid;
		gap: 2px;
		padding-block: 8px;
		border-block-end: 1px solid var(--wfd-line);
		font-size: 14px;
	}

	.wfd-recipes__path {
		color: var(--wfd-ink);
		font-weight: 600;
	}
</style>
