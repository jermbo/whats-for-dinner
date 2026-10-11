<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { Kitchen } from './kitchen-state.svelte';

	let { kitchen, oncook }: { kitchen: Kitchen; oncook: (path: string) => void } = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	const open = $derived(kitchen.meals.filter((meal) => !meal.cooked));
	const cooked = $derived(kitchen.meals.filter((meal) => meal.cooked));
	const count = $derived(
		`${open.length} ${open.length === 1 ? 'meal' : 'meals'} to cook, in the sequence that you want`
	);
</script>

<section class="plan" aria-label="Plan of the week">
	<p class="plan__count" aria-live="polite">{count}</p>

	{#if !kitchen.meals.length}
		<p class="plan__empty">The week has no meals. Add a meal in Recipes.</p>
	{/if}

	<ul class="plan__list">
		{#each open as { path, entry } (path)}
			<li class="plan__meal" transition:slide={{ duration }}>
				<div class="plan__text">
					<h3 class="plan__title">{entry?.recipe.title ?? path}</h3>
					<span class="plan__meta">
						{#if entry}
							{entry.match.inPantry} of {entry.match.ingredients.length} in the pantry
						{:else}
							The note of this recipe is gone.
						{/if}
					</span>
				</div>
				<button class="plan__button" type="button" onclick={() => kitchen.removeFromPlan(path)}>
					Remove
				</button>
				{#if entry}
					<button class="plan__button mod-cta" type="button" onclick={() => oncook(path)}>
						Cook
					</button>
				{/if}
			</li>
		{/each}
	</ul>

	{#if cooked.length}
		<h3 class="plan__heading">Cooked</h3>
		<ul class="plan__list">
			{#each cooked as { path, entry } (path)}
				<li class="plan__meal plan__meal--cooked" transition:slide={{ duration }}>
					<div class="plan__text">
						<span class="plan__title">{entry?.recipe.title ?? path}</span>
					</div>
					<button class="plan__button" type="button" onclick={() => kitchen.addToPlan(path)}>
						Cook again
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	{#if kitchen.meals.length}
		<button class="plan__button plan__button--end" type="button" onclick={() => kitchen.clearPlan()}>
			Start a new week
		</button>
	{/if}
</section>

<style>
	.plan {
		display: grid;
		gap: var(--size-4-3);
	}

	.plan__count,
	.plan__empty {
		margin: 0;
		color: var(--text-muted);
	}

	.plan__list {
		display: grid;
		gap: var(--size-4-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.plan__meal {
		display: flex;
		flex-wrap: wrap;
		gap: var(--size-4-2);
		align-items: center;
		padding: var(--size-4-3) var(--size-4-4);
		border: var(--border-width) solid var(--background-modifier-border);
		border-radius: var(--radius-m);
		background: var(--background-secondary);
	}

	.plan__meal--cooked {
		color: var(--text-muted);
		text-decoration: line-through;
	}

	.plan__text {
		display: grid;
		flex: 1 1 12rem;
		gap: var(--size-2-2);
	}

	.plan__title {
		margin: 0;
		font-size: var(--font-ui-medium);
		font-weight: var(--font-semibold);
	}

	.plan__meta {
		color: var(--text-muted);
		font-size: var(--font-ui-small);
	}

	.plan__heading {
		margin-block: var(--size-4-3) 0;
		color: var(--text-muted);
		font-size: var(--font-ui-small);
		font-weight: var(--font-semibold);
	}

	.plan__button {
		min-block-size: 44px;
		text-decoration: none;
	}

	.plan__button--end {
		justify-self: start;
	}
</style>
