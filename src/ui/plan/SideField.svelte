<script lang="ts">
	import { showName } from '../../match/names';
	import type { PlannedSide } from '../../plan/plan-note';
	import { typeOf } from '../../recipes/browse';
	import type { RecipeEntry } from '../../recipes/types';
	import Button from '../parts/Button.svelte';
	import Count from '../parts/Count.svelte';
	import FindField from '../parts/FindField.svelte';

	type Props = {
		// The recipes in the sequence "best for the pantry", less the dishes that the meal has.
		recipes: RecipeEntry[];
		onadd: (side: PlannedSide) => void;
		oncancel: () => void;
	};
	let { recipes, onadd, oncancel }: Props = $props();

	const SHOWN = 5;
	let find = $state('');
	const text = $derived(find.trim());

	// A recipe with the type "side" is the side that you usually want, so it comes first.
	const found = $derived.by(() => {
		const words = text.toLowerCase();
		const matches = recipes.filter((entry) => showName(entry.recipe.title).toLowerCase().includes(words));
		const isSide = (entry: RecipeEntry) => typeOf(entry) === 'side';
		return [...matches.filter(isSide), ...matches.filter((entry) => !isSide(entry))].slice(0, SHOWN);
	});
</script>

<!-- A side is a recipe, or only a name, such as "Salad", when you need no recipe. -->
<div class="wfd-side-field">
	<FindField label="Find a side, or type a name" bind:value={find} />
	<ul class="wfd-side-field__list">
		{#each found as entry (entry.path)}
			<li>
				<button
					class="wfd-side-field__row"
					type="button"
					onclick={() => onadd({ path: entry.path, name: showName(entry.recipe.title) })}
				>
					<span class="wfd-side-field__name">{showName(entry.recipe.title)}</span>
					<Count have={entry.match.inPantry} of={entry.match.ingredients.length} />
				</button>
			</li>
		{/each}
	</ul>
	<div class="wfd-side-field__actions">
		<Button kind="link" onclick={oncancel}>Cancel</Button>
		{#if text}
			<Button onclick={() => onadd({ path: null, name: text })}>Add "{text}"</Button>
		{/if}
	</div>
</div>

<style>
	.wfd-side-field {
		display: grid;
		gap: var(--wfd-space-group);
	}

	.wfd-side-field__list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	button.wfd-side-field__row {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: center;
		justify-content: space-between;
		inline-size: 100%;
		block-size: auto;
		min-block-size: var(--wfd-control);
		padding: 0;
		border: 0;
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-border);
		border-radius: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		font-size: var(--wfd-font-size-text);
		text-align: start;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	.wfd-side-field__name {
		font-weight: 500;
	}

	.wfd-side-field__actions {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: center;
		justify-content: space-between;
	}
</style>
