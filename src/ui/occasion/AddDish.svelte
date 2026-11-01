<script lang="ts">
	import { showName } from '../../match/names';
	import type { Dish } from '../../occasion/occasion-note';
	import type { RecipeEntry } from '../../recipes/types';
	import Button from '../parts/Button.svelte';
	import FindField from '../parts/FindField.svelte';

	type Props = {
		// The recipes that are not a dish of the occasion yet.
		recipes: RecipeEntry[];
		onadd: (dish: Pick<Dish, 'path' | 'name'>) => void;
	};
	let { recipes, onadd }: Props = $props();

	const SHOWN = 5;
	let text = $state('');
	let form = $state<HTMLFormElement>();
	const words = $derived(text.trim());
	// A text of spaces or signs only is no name.
	const isName = $derived(/[\p{L}\p{N}]/u.test(words));

	// The name of a recipe finds it. An ingredient does not: you add a dish, not a food.
	const found = $derived(
		words
			? recipes
					.filter((entry) => showName(entry.recipe.title).toLowerCase().includes(words.toLowerCase()))
					.slice(0, SHOWN)
			: []
	);

	// The field opens in a card after a tap, so it takes the focus at once.
	$effect(() => {
		form?.querySelector('input')?.focus();
	});

	// The field keeps the focus, so that the next dish is one word away.
	function add(dish: Pick<Dish, 'path' | 'name'>) {
		onadd(dish);
		text = '';
		form?.querySelector('input')?.focus();
	}

	function addName(event: SubmitEvent) {
		event.preventDefault();
		if (isName) add({ path: null, name: words });
	}
</script>

<!-- A dish is a recipe, or only a name, such as "Pumpkin pie" that Mum brings. -->
<form class="wfd-add-dish" onsubmit={addName} bind:this={form}>
	<div class="wfd-add-dish__field">
		<FindField label="Add a dish" bind:value={text} />
		<Button kind="main" type="submit" disabled={!isName}>Add</Button>
	</div>
	{#if found.length}
		<ul class="wfd-add-dish__list">
			{#each found as entry (entry.path)}
				<li>
					<button
						class="wfd-add-dish__row"
						type="button"
						onclick={() => add({ path: entry.path, name: showName(entry.recipe.title) })}
					>
						{showName(entry.recipe.title)}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</form>

<style>
	.wfd-add-dish {
		display: grid;
		gap: var(--wfd-space-group);
	}

	.wfd-add-dish__field {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: var(--wfd-space-group);
	}

	.wfd-add-dish__list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	button.wfd-add-dish__row {
		display: flex;
		align-items: center;
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
		font-weight: 500;
		text-align: start;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}
</style>
