<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { crossfade, slide } from 'svelte/transition';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import type { Meal } from '../../plan/types';
	import Button from '../parts/Button.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import PartHead from '../parts/PartHead.svelte';
	import PartTop from '../parts/PartTop.svelte';
	import MealCard from './MealCard.svelte';

	type Props = {
		kitchen: Kitchen;
		oncook: (path: string) => void;
		// Opens the recipes, so that you can add a meal.
		onadd: () => void;
	};
	let { kitchen, oncook, onadd }: Props = $props();
	const headId = $props.id();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	// A flag moves the card between "Tonight" and the list, so you see where it went.
	const [send, receive] = crossfade({
		duration: () => duration,
		fallback: (node) => slide(node, { duration })
	});

	// The week is a set of options. The meal that you flagged for tonight is in its own section.
	const tonight = $derived(kitchen.meals.find((meal) => kitchen.plan.isTonight(meal)));
	const options = $derived(kitchen.meals.filter((meal) => meal !== tonight));
</script>

{#snippet card(meal: Meal, isTonight: boolean)}
	<MealCard
		{meal}
		tonight={isTonight}
		recipes={kitchen.recipes}
		ontonight={(on) => kitchen.plan.setTonight(meal.path, on)}
		onprep={(done) => kitchen.plan.setPrepDone(meal.path, done)}
		onremove={() => kitchen.plan.removeFromPlan(meal.path)}
		{oncook}
		onaddside={(side) => kitchen.plan.addSide(meal.path, side)}
		onremoveside={(index) => kitchen.plan.removeSide(meal.path, index)}
	/>
{/snippet}

<section class="wfd-plan" aria-labelledby={headId}>
	<PartTop>
		<PartHead id={headId} title="Plan">
			{#snippet side()}
				{#if kitchen.meals.length}
					<span class="wfd-plan__count wfd-label">
						{kitchen.meals.length === 1 ? '1 meal' : `${kitchen.meals.length} meals`}
					</span>
				{/if}
			{/snippet}
		</PartHead>
		<!-- One place to add a meal, with 0 meals or with 20. -->
		<Button kind="main" onclick={onadd}>Add a meal</Button>
	</PartTop>

	{#if tonight}
		<section class="wfd-plan__tonight" transition:slide={{ duration }}>
			<GroupHead title="Tonight" />
			{#key tonight.path}
				<div in:receive={{ key: tonight.path }} out:send={{ key: tonight.path }}>
					{@render card(tonight, true)}
				</div>
			{/key}
		</section>
	{/if}

	{#if options.length}
		{#if tonight}
			<GroupHead title="Other options" note={String(options.length)} />
		{/if}
		<ul class="wfd-plan__list">
			{#each options as meal (meal.path)}
				<li in:receive={{ key: meal.path }} out:send={{ key: meal.path }}>
					{@render card(meal, false)}
				</li>
			{/each}
		</ul>
	{:else if !tonight}
		<p class="wfd-plan__empty">No meals planned.</p>
	{/if}
</section>

<style>
	.wfd-plan,
	.wfd-plan__tonight {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-stack);
	}

	.wfd-plan__count {
		color: var(--wfd-color-text-muted);
	}

	.wfd-plan__list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
		gap: var(--wfd-space-stack);
		align-items: stretch;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-plan__empty {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}
</style>
