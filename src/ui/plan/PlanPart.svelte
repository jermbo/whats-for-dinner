<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import Button from '../parts/Button.svelte';
	import Count from '../parts/Count.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import PartHead from '../parts/PartHead.svelte';
	import Sticker from '../parts/Sticker.svelte';
	import WeekButton from '../parts/WeekButton.svelte';

	type Props = { kitchen: Kitchen; oncook: (path: string) => void; onbrowse: () => void };
	let { kitchen, oncook, onbrowse }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	const open = $derived(kitchen.meals.filter((meal) => !meal.cooked));
	const cooked = $derived(kitchen.meals.filter((meal) => meal.cooked));

	// The plugin proposes the recipes that use up the pantry, and that are not in the week.
	const ideas = $derived(
		kitchen.recipes
			.filter((entry) => !kitchen.plan.some((meal) => meal.path === entry.path))
			.slice(0, 3)
	);
</script>

<section class="wfd-plan" aria-label="Plan of the week">
	<PartHead title="Plan">
		{#snippet side()}
			{#if kitchen.meals.length}
				<Count have={cooked.length} of={kitchen.meals.length} label="cooked" />
			{/if}
		{/snippet}
	</PartHead>

	<ul class="wfd-plan__list">
		{#each open as { path, entry } (path)}
			<li class="wfd-plan__meal" transition:slide={{ duration }}>
				<div class="wfd-plan__top">
					<h3 class="wfd-plan__name wfd-display">{entry?.recipe.title ?? path}</h3>
					{#if entry}
						<Count have={entry.match.inPantry} of={entry.match.ingredients.length} />
					{/if}
				</div>
				<div class="wfd-plan__facts">
					{#if entry}
						{@const toBuy = entry.match.ingredients.length - entry.match.inPantry}
						<span class="wfd-label">{toBuy ? `${toBuy} to buy` : 'All in the pantry'}</span>
						{#if entry.match.useSoon.length}
							<Sticker label="Uses {entry.match.useSoon.join(' · ')}" kind="tomato" />
						{/if}
					{:else}
						<span class="wfd-label">The note of this recipe is gone</span>
					{/if}
				</div>
				<div class="wfd-plan__actions">
					<Button onclick={() => kitchen.removeFromPlan(path)}>Remove</Button>
					{#if entry}
						<Button kind="main" onclick={() => oncook(path)}>Cook →</Button>
					{/if}
				</div>
			</li>
		{/each}

		<!-- A dashed edge is an empty place in the week. -->
		<li>
			<button class="wfd-plan__slot" type="button" onclick={onbrowse}>
				<span aria-hidden="true">+</span> Add a meal from Recipes
			</button>
		</li>
	</ul>

	{#if ideas.length}
		<GroupHead title="Ideas for your pantry" />
		<ul class="wfd-plan__ideas">
			{#each ideas as entry (entry.path)}
				<li class="wfd-plan__idea" transition:slide={{ duration }}>
					<span class="wfd-plan__idea-text">
						<span class="wfd-plan__idea-name">{entry.recipe.title}</span>
						{#if entry.match.useSoon.length}
							<Sticker label="Uses {entry.match.useSoon.join(' · ')}" kind="tomato" />
						{/if}
					</span>
					<Count have={entry.match.inPantry} of={entry.match.ingredients.length} />
					<WeekButton
						name={entry.recipe.title}
						planned={false}
						onclick={() => kitchen.addToPlan(entry.path)}
					/>
				</li>
			{/each}
		</ul>
	{/if}

	{#if cooked.length}
		<GroupHead title="Cooked" note={String(cooked.length)} />
		<ul class="wfd-plan__ideas">
			{#each cooked as { path, entry } (path)}
				<li class="wfd-plan__idea" transition:slide={{ duration }}>
					<span class="wfd-plan__idea-text">
						<span class="wfd-plan__idea-name wfd-plan__idea-name--done">
							{entry?.recipe.title ?? path}
						</span>
					</span>
					<Button kind="link" onclick={() => kitchen.addToPlan(path)}>Cook again</Button>
				</li>
			{/each}
		</ul>
	{/if}

	{#if kitchen.meals.length}
		<div class="wfd-plan__end">
			<Button kind="link" onclick={() => kitchen.clearPlan()}>Start a new week</Button>
		</div>
	{/if}
</section>

<style>
	.wfd-plan {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
	}

	.wfd-plan__list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
		gap: 10px;
		align-items: stretch;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-plan__meal {
		display: grid;
		gap: 10px;
		align-content: space-between;
		padding: 16px;
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-card);
	}

	.wfd-plan__top {
		display: flex;
		gap: 12px;
		align-items: start;
		justify-content: space-between;
	}

	.wfd-plan__name {
		margin: 0;
		color: var(--wfd-ink);
		font-size: 26px;
	}

	.wfd-plan__facts {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
		padding-block-end: 10px;
		border-block-end: var(--wfd-rule-4) solid var(--wfd-ink);
		color: var(--wfd-ink-2);
	}

	.wfd-plan__actions {
		display: grid;
		grid-auto-columns: 1fr;
		grid-auto-flow: column;
		gap: 10px;
	}

	button.wfd-plan__slot {
		display: flex;
		gap: 8px;
		align-items: center;
		justify-content: center;
		inline-size: 100%;
		block-size: 100%;
		min-block-size: 72px;
		border: 2px dashed var(--wfd-ink);
		border-radius: var(--wfd-radius-card);
		background: none;
		box-shadow: none;
		color: var(--wfd-ink);
		font-family: inherit;
		font-size: 16px;
		font-weight: 700;
		cursor: pointer;

		&:focus-visible {
			outline: 3px solid var(--wfd-olive);
			outline-offset: 2px;
		}
	}

	.wfd-plan__ideas {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-plan__idea {
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: 12px;
		align-items: center;
		min-block-size: 60px;
		padding-block: 6px;
		border-block-end: 1px solid var(--wfd-ink);
	}

	.wfd-plan__idea-text {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 10px;
		align-items: center;
	}

	.wfd-plan__idea-name {
		font-size: 17px;
		font-weight: 600;
	}

	.wfd-plan__idea-name--done {
		color: var(--wfd-ink-2);
		text-decoration: line-through;
	}

	.wfd-plan__end {
		display: flex;
		justify-content: center;
	}
</style>
