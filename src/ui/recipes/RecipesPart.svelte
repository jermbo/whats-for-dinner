<script lang="ts">
	import { flushSync } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { RecipeEntry } from '../../recipes/types';
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
	import PartTop from '../parts/PartTop.svelte';
	import { coverThen } from '../cover';
	import { glide } from '../glide';
	import RecipeCard from './RecipeCard.svelte';

	type Props = {
		kitchen: Kitchen;
		oncook: (path: string) => void;
		bar: BarState<Sort, Only>;
	};
	let { kitchen, oncook, bar }: Props = $props();
	const headId = $props.id();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	// When the part opens, the cards come in one after the other. A card that a filter brings back
	// later only slides in, so the deal is for the first moment only.
	let dealing = $state(true);
	$effect(() => {
		const timer = setTimeout(() => (dealing = false), 1000);
		return () => clearTimeout(timer);
	});

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

	// One recipe is open at a time. The other cards step back while it is open.
	let openPath = $state<string | null>(null);
	// A card closes in two steps: first its ink goes back and its inside fades, in its place. Then
	// the inside goes, and each card that it pushed glides back.
	let closingPath = $state<string | null>(null);
	let closeTimer: ReturnType<typeof setTimeout> | undefined;
	let listBox = $state<HTMLElement>();
	const change = (next: () => void) =>
		glide(listBox, '.wfd-recipes__item', () => flushSync(next));

	function close() {
		if (!openPath) return;
		clearTimeout(closeTimer);
		closingPath = openPath;
		openPath = null;
		closeTimer = setTimeout(
			() => change(() => (closingPath = null)),
			prefersReducedMotion.current ? 0 : 300
		);
	}

	// A tap on a different card closes the open one at once, so the new card does not move after
	// it gets to the top of the screen.
	function toggle(path: string) {
		if (openPath === path) return close();
		clearTimeout(closeTimer);
		change(() => {
			closingPath = null;
			openPath = path;
		});
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') close();
	}

	const toggleWeek = (path: string) =>
		kitchen.plan.isPlanned(path) ? kitchen.plan.removeFromPlan(path) : kitchen.plan.addToPlan(path);
</script>

<svelte:window {onkeydown} />

<section class="wfd-recipes" aria-labelledby={headId} bind:this={listBox}>
	<PartTop>
		<PartHead id={headId} title="Recipes">
			{#snippet side()}
				<div class="wfd-recipes__side">
					<Count have={readyCount} of={kitchen.recipes.length} label="ready" />
					<Button
						onclick={(event) => coverThen(event, 'bg', () => kitchen.openPage({ is: 'intake' }))}
						>Add recipe</Button
					>
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
	</PartTop>

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
		<ul
			class="wfd-recipes__list"
			class:wfd-recipes__list--deal={dealing}
			class:wfd-recipes__list--focus={openPath !== null}
		>
			{#each group.entries as entry, index (entry.path)}
				<li
					class="wfd-recipes__item"
					class:wfd-recipes__item--open={entry.path === openPath}
					style:--wfd-deal={Math.min(index, 12)}
					transition:slide={{ duration }}
					data-glide-surface
				>
					<RecipeCard
						{kitchen}
						{entry}
						planned={kitchen.plan.isPlanned(entry.path)}
						open={entry.path === openPath}
						leaving={entry.path === closingPath}
						ontoggle={() => toggle(entry.path)}
						onweek={() => toggleWeek(entry.path)}
						oncook={(event) => coverThen(event, 'frame', () => oncook(entry.path))}
						photo={entry.photo ? kitchen.photoUrl(entry.photo, entry.path) : null}
						ongallery={(event) =>
							coverThen(event, 'frame', () => kitchen.openPage({ is: 'gallery', path: entry.path }))}
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
						<Button
							onclick={(event) =>
								coverThen(event, 'bg', () => kitchen.openPage({ is: 'convert', path }))}
							>Convert</Button
						>
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
		gap: var(--wfd-space-stack);
	}

	.wfd-recipes__side {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group) var(--wfd-space-section);
		align-items: center;
	}

	.wfd-recipes__none {
		display: grid;
		gap: var(--wfd-space-stack);
		justify-items: start;
	}

	.wfd-recipes__empty {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}

	/*
	 * The cards flow down in columns, as the bins of the Pantry. An open card makes only its own
	 * column longer, so no space is empty next to it. The sequence goes down each column.
	 */
	.wfd-recipes__list {
		columns: 22rem;
		column-gap: var(--wfd-space-stack);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-recipes__item {
		margin-block-end: var(--wfd-space-stack);
		break-inside: avoid;
		transition: opacity var(--wfd-card-motion);
	}

	/*
	 * While a recipe is open, the other cards step back. Only their opacity changes, so the
	 * browser needs no new layout and no new paint. A hover brings one forward again.
	 */
	.wfd-recipes__list--focus .wfd-recipes__item:not(.wfd-recipes__item--open) {
		opacity: 0.45;
	}

	@media (hover: hover) {
		.wfd-recipes__list--focus .wfd-recipes__item:hover {
			opacity: 1;
		}
	}

	.wfd-recipes__list--deal .wfd-recipes__item {
		animation: wfd-deal calc(var(--wfd-motion-move) * 1.6) var(--wfd-ease-out) backwards;
		animation-delay: calc(var(--wfd-deal) * var(--wfd-motion-move) * 0.12);
	}

	@keyframes wfd-deal {
		from {
			opacity: 0;
			translate: 0 24px;
		}
	}

	.wfd-recipes__rejected {
		margin-block-start: var(--wfd-space-section);
		color: var(--wfd-color-text-muted);
	}

	.wfd-recipes__rejected-summary {
		display: flex;
		align-items: center;
		min-block-size: var(--wfd-control-min);
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
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
		gap: var(--wfd-space-tight);
		justify-items: start;
		padding-block: var(--wfd-space-group);
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-border);
		font-size: var(--wfd-font-size-small);
	}

	.wfd-recipes__path {
		color: var(--wfd-color-text);
		font-weight: 600;
	}
</style>
