<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { Kitchen, Meal } from '../../kitchen-state.svelte';
	import { MAIN_TYPES, ROOM, weekGroups } from '../../plan/week';
	import Button from '../parts/Button.svelte';
	import Count from '../parts/Count.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import PartHead from '../parts/PartHead.svelte';
	import Sticker from '../parts/Sticker.svelte';
	import WeekButton from '../parts/WeekButton.svelte';
	import MealCard from './MealCard.svelte';

	type Props = {
		kitchen: Kitchen;
		oncook: (path: string) => void;
		// Shows the recipes of one type, so that you can add a meal of that type.
		onbrowse: (type: string) => void;
	};
	let { kitchen, oncook, onbrowse }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	const open = $derived(kitchen.meals.filter((meal) => !meal.cooked));
	const cooked = $derived(kitchen.meals.filter((meal) => meal.cooked));

	// The meals of today are at the top. Each other meal is in the group of its type.
	const today = $derived(open.filter((meal) => kitchen.isToday(meal)));
	const groups = $derived(weekGroups(open));
	// A main type with no meal has no group. It gets a small button, so that you see its room.
	const empty = $derived(
		MAIN_TYPES.filter((type) => !groups.some((group) => group.type === type))
	);
	const nameOf = (type: string) => type.charAt(0).toUpperCase() + type.slice(1);

	// The plugin proposes the recipes that use up the pantry, and that are not in the week.
	const ideas = $derived(
		kitchen.recipes
			.filter((entry) => !kitchen.plan.some((meal) => meal.path === entry.path))
			.slice(0, 3)
	);

	// A new week removes each meal from the plan, so the plugin asks first.
	let asking = $state(false);
	const question = $derived(
		kitchen.meals.length === 1
			? 'Remove the meal of this week?'
			: `Remove all ${kitchen.meals.length} meals of this week?`
	);

	async function startNewWeek() {
		asking = false;
		await kitchen.clearPlan();
	}
</script>

<section class="wfd-plan" aria-label="Plan of the week">
	<PartHead title="Plan">
		{#snippet side()}
			{#if kitchen.meals.length}
				<Count have={cooked.length} of={kitchen.meals.length} label="cooked" />
			{/if}
		{/snippet}
	</PartHead>

	{#snippet card(meal: Meal, isToday: boolean)}
		<MealCard
			{meal}
			today={isToday}
			ontoday={(on) => kitchen.setToday(meal.path, on)}
			onprep={(done) => kitchen.setPrepDone(meal.path, done)}
			onremove={() => kitchen.removeFromPlan(meal.path)}
			oncook={() => oncook(meal.path)}
		/>
	{/snippet}

	<!-- A dashed edge is an empty place in the week. A tap shows the recipes of that type. -->
	{#snippet slot(type: string, small: boolean)}
		<button
			class="wfd-plan__slot"
			class:wfd-plan__slot--small={small}
			type="button"
			aria-label="Add a meal of the type {type}"
			onclick={() => onbrowse(type)}
		>
			<span aria-hidden="true">+</span>
			{nameOf(type)}
		</button>
	{/snippet}

	{#if today.length}
		<section class="wfd-plan__group" transition:slide={{ duration }}>
			<GroupHead title="Today" note={String(today.length)} />
			<ul class="wfd-plan__list">
				{#each today as meal (meal.path)}
					<li transition:slide={{ duration }}>{@render card(meal, true)}</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#each groups as group (group.type)}
		<section class="wfd-plan__group" transition:slide={{ duration }}>
			<GroupHead title={nameOf(group.type)} note="{group.meals.length}/{ROOM}" />
			<ul class="wfd-plan__list">
				{#each group.meals.filter((meal) => !kitchen.isToday(meal)) as meal (meal.path)}
					<li transition:slide={{ duration }}>{@render card(meal, false)}</li>
				{/each}
				{#if group.meals.length < ROOM}
					<li>{@render slot(group.type, false)}</li>
				{/if}
			</ul>
		</section>
	{/each}

	{#if empty.length}
		<div class="wfd-plan__more">
			{#each empty as type (type)}
				{@render slot(type, true)}
			{/each}
		</div>
	{/if}

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
			{#if asking}
				<div class="wfd-plan__ask" in:slide={{ duration }}>
					<p class="wfd-plan__question" role="alert">{question}</p>
					<Button onclick={() => (asking = false)}>Keep the plan</Button>
					<Button kind="main" onclick={startNewWeek}>Start a new week</Button>
				</div>
			{:else}
				<Button kind="link" onclick={() => (asking = true)}>Start a new week</Button>
			{/if}
		</div>
	{/if}
</section>

<style>
	.wfd-plan {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
	}

	.wfd-plan__group {
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

	button.wfd-plan__slot {
		display: flex;
		gap: 8px;
		align-items: center;
		justify-content: center;
		inline-size: 100%;
		block-size: 100%;
		min-block-size: 72px;
		border: 2px dashed var(--wfd-ink-3);
		border-radius: var(--wfd-radius-card);
		background: none;
		box-shadow: none;
		color: var(--wfd-ink-2);
		font-family: inherit;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;

		&:focus-visible {
			outline: 2px solid var(--wfd-ink);
			outline-offset: 2px;
		}
	}

	/* The types with no meal are in one row, so that an empty week stays small. */
	.wfd-plan__more {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	button.wfd-plan__slot--small {
		flex: 1 1 auto;
		inline-size: auto;
		block-size: auto;
		min-block-size: 48px;
		padding-inline: 14px;
		font-size: 15px;
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
		border-block-end: 1px solid var(--wfd-line);
	}

	.wfd-plan__idea-text {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 10px;
		align-items: center;
	}

	.wfd-plan__idea-name {
		font-size: 17px;
		font-weight: 500;
	}

	.wfd-plan__idea-name--done {
		color: var(--wfd-ink-2);
		text-decoration: line-through;
	}

	.wfd-plan__end {
		display: flex;
		justify-content: center;
	}

	/* The question, with the two answers side by side below it. */
	.wfd-plan__ask {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px 12px;
		inline-size: 100%;
	}

	.wfd-plan__question {
		grid-column: 1 / -1;
		margin: 0;
		font-weight: 600;
		text-align: center;
	}
</style>
