<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { RecipeEntry } from '../../kitchen/types';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import {
		inSequence,
		isFound,
		isReady,
		typeOf,
		typesOf,
		type Only,
		type Sort
	} from '../../recipes/browse';
	import type { BarState } from '../bar-state.svelte';
	import Bar from '../parts/Bar.svelte';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import Count from '../parts/Count.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import PartHead from '../parts/PartHead.svelte';
	import RecipeCard from './RecipeCard.svelte';

	type Props = {
		kitchen: Kitchen;
		oncook: (path: string) => void;
		bar: BarState<Sort, Only>;
	};
	let { kitchen, oncook, bar }: Props = $props();
	const headId = $props.id();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	// After "Convert", the line of that note is in the list for the first frame, and then it goes
	// out with a motion. The list is open, so that you see it.
	const converted = (() => kitchen.takeConverted())();
	const openAtStart = converted !== null;
	let leaving = $state(converted);
	const reasons = $derived(
		leaving && !kitchen.rejected.some((one) => one.path === leaving?.path)
			? [...kitchen.rejected, leaving].sort((a, b) => a.path.localeCompare(b.path))
			: kitchen.rejected
	);
	$effect(() => {
		if (!leaving) return;
		const frame = requestAnimationFrame(() => (leaving = null));
		return () => cancelAnimationFrame(frame);
	});

	const sorts: { value: Sort; label: string }[] = [
		{ value: 'match', label: 'Best for the pantry' },
		{ value: 'type', label: 'By type' },
		{ value: 'rating', label: 'Best rating' },
		{ value: 'name', label: 'A to Z' }
	];

	// The text that finds a recipe.
	const text = $derived(bar.find.trim());
	const types = $derived(typesOf(kitchen.recipes));
	// A type with no recipe has no chip, so its filter cannot be on.
	const typeOn = $derived(bar.one !== null && types.includes(bar.one) ? bar.one : null);
	const count = $derived(bar.only.size + (typeOn ? 1 : 0));
	const readyCount = $derived(kitchen.recipes.filter(isReady).length);

	// A recipe shows only if it passes the text and each filter that is on.
	const shown = $derived(
		inSequence(
			kitchen.recipes.filter(
				(entry) =>
					isFound(entry, bar.find) &&
					(!bar.only.has('ready') || isReady(entry)) &&
					(!bar.only.has('soon') || entry.match.useSoon.length > 0) &&
					(!typeOn || typeOf(entry) === typeOn)
			),
			bar.sort
		)
	);

	// The sequence by type has one group for each type. Each other sequence is one group.
	const groups = $derived.by((): { title: string; entries: RecipeEntry[] }[] => {
		if (bar.sort !== 'type') return [{ title: '', entries: shown }];
		return typesOf(shown).map((title) => ({
			title,
			entries: shown.filter((entry) => typeOf(entry) === title)
		}));
	});

	const toggleWeek = (path: string) =>
		kitchen.isPlanned(path) ? kitchen.removeFromPlan(path) : kitchen.addToPlan(path);
</script>

<section class="wfd-recipes" aria-labelledby={headId}>
	<PartHead id={headId} title="Recipes">
		{#snippet side()}
			<div class="wfd-recipes__side">
				<Count have={readyCount} of={kitchen.recipes.length} label="ready" />
				<Button onclick={() => kitchen.openPage({ is: 'intake' })}>Add recipe</Button>
			</div>
		{/snippet}
	</PartHead>

	<Bar
		label="Find a recipe or ingredient"
		sequence="Sequence of the recipes"
		{sorts}
		{count}
		bind:find={bar.find}
		bind:sort={bar.sort}
		bind:open={bar.open}
	>
		{#snippet chips()}
			<Chip
				label="Ready to cook"
				on={bar.only.has('ready')}
				onclick={() => bar.flip('ready')}
			/>
			<Chip label="Uses food soon" on={bar.only.has('soon')} onclick={() => bar.flip('soon')} />
			{#each types as option (option)}
				<Chip
					label={option.charAt(0).toUpperCase() + option.slice(1)}
					on={typeOn === option}
					onclick={() => bar.pick(option)}
				/>
			{/each}
		{/snippet}
	</Bar>

	{#if !shown.length}
		<div class="wfd-recipes__none" aria-live="polite">
			<p class="wfd-recipes__empty">
				{#if !kitchen.recipes.length}
					The vault has no recipes.
				{:else if text && !count}
					No recipe has "{text}" in its name or in its ingredients.
				{:else}
					No recipe {text ? `with "${text}" ` : ''}passes
					{count === 1 ? 'this filter' : 'these filters'}.
				{/if}
			</p>
			{#if count && kitchen.recipes.length}
				<Button onclick={() => bar.clear()}>Remove the filters</Button>
			{/if}
		</div>
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
						onedit={() => kitchen.openPage({ is: 'edit', path: entry.path })}
						photo={entry.photo ? kitchen.photoUrl(entry.photo, entry.path) : null}
						ongallery={() => kitchen.openPage({ is: 'gallery', path: entry.path })}
					/>
				</li>
			{/each}
		</ul>
	{/each}

	{#if reasons.length}
		<details
			class="wfd-recipes__rejected"
			open={openAtStart || undefined}
			transition:slide={{ duration }}
		>
			<summary class="wfd-recipes__rejected-summary wfd-label">
				{reasons.length}
				{reasons.length === 1 ? 'note is not a recipe' : 'notes are not recipes'}
			</summary>
			<ul class="wfd-recipes__reasons">
				{#each reasons as { path, reason } (path)}
					<li class="wfd-recipes__reason" transition:slide={{ duration }}>
						<span class="wfd-recipes__path">{path}</span>
						<span class="wfd-recipes__why">{reason}</span>
						<Button onclick={() => kitchen.openPage({ is: 'convert', path })}>Convert</Button>
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

	.wfd-recipes__side {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 16px;
		align-items: center;
	}

	.wfd-recipes__none {
		display: grid;
		gap: 10px;
		justify-items: start;
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
		justify-items: start;
		padding-block: 8px;
		border-block-end: 1px solid var(--wfd-line);
		font-size: 14px;
	}

	.wfd-recipes__path {
		color: var(--wfd-ink);
		font-weight: 600;
	}
</style>
