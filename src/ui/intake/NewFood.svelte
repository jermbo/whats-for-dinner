<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { FoodNote } from '../../note';
	import FindField from '../parts/FindField.svelte';

	type Props = {
		// The name of the line, with a capital first letter: "Kosher salt".
		name: string;
		foods: FoodNote[];
		onpick: (path: string) => void;
		// A shorter name for the new food, such as "Lemons" for "lemons plus more for garnishing".
		onname: (name: string) => void;
	};
	let { name, foods, onpick, onname }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 160);
	let open = $state(false);
	let find = $state('');

	// The food items whose name has the text, from A to Z. With no text, all of them.
	const wanted = $derived(find.trim());
	const found = $derived(
		foods
			.filter(({ item }) => item.name.toLowerCase().includes(wanted.toLowerCase()))
			.sort((a, b) => a.item.name.localeCompare(b.item.name))
	);
	// The text that you typed can also be the name of the new food, when the pantry has no food
	// item with that name.
	const typedName = $derived(wanted.charAt(0).toUpperCase() + wanted.slice(1));
	const canName = $derived(
		wanted !== '' &&
			typedName !== name &&
			!foods.some(({ item }) => item.name.toLowerCase() === wanted.toLowerCase())
	);

	function rename() {
		onname(typedName);
		open = false;
		find = '';
	}
</script>

<!-- With no tap, "Save" makes a stub. A tap finds a food item that the pantry has already, or
     gives the new food a shorter name. -->
<div class="wfd-new">
	<button
		class="wfd-new__chip"
		type="button"
		aria-expanded={open}
		aria-label="New: {name}. Find a food item instead"
		onclick={() => (open = !open)}
	>
		New: {name}
	</button>
	{#if open}
		<div class="wfd-new__find" transition:slide={{ duration }}>
			<FindField label="Find a food item" bind:value={find} />
			<ul class="wfd-new__foods">
				{#if canName}
					<li>
						<button class="wfd-new__food wfd-new__food--name" type="button" onclick={rename}>
							New: {typedName}
						</button>
					</li>
				{/if}
				{#each found as food (food.path)}
					<li>
						<button class="wfd-new__food" type="button" onclick={() => onpick(food.path)}>
							{food.item.name}
						</button>
					</li>
				{:else}
					{#if !canName}
						<li class="wfd-new__none">No food item has "{wanted}" in its name.</li>
					{/if}
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.wfd-new {
		display: grid;
		gap: var(--wfd-space-group);
		justify-items: start;
	}

	button.wfd-new__chip {
		block-size: auto;
		min-block-size: var(--wfd-control-min);
		padding: 0 var(--wfd-space-inset);
		border: var(--wfd-border) dashed var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		font-size: var(--wfd-font-size-small);
		font-weight: 700;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	.wfd-new__find {
		display: grid;
		gap: var(--wfd-space-group);
		inline-size: 100%;
	}

	/* A long pantry scrolls in its own box, so that the next lines stay near. */
	.wfd-new__foods {
		max-block-size: 14rem;
		margin: 0;
		padding: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		list-style: none;
	}

	button.wfd-new__food {
		inline-size: 100%;
		block-size: auto;
		min-block-size: var(--wfd-control-min);
		padding: 0 var(--wfd-space-inset);
		justify-content: start;
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
			outline-offset: -2px;
		}
	}

	button.wfd-new__food--name {
		font-weight: 700;
	}

	.wfd-new__none {
		padding: var(--wfd-space-inset) var(--wfd-space-inset);
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
	}
</style>
