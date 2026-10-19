<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import type { FoodNote } from '../../note';
	import { isFound } from '../../pantry/views';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import SizeField from './SizeField.svelte';

	// "Add to pantry": you type a name. A known food opens its card with a new package. A new food asks
	// for its package size and its place, and then it is a note with one full package.
	type Props = {
		foods: FoodNote[];
		places: string[];
		startName: string;
		startPlace: string;
		onknown: (food: FoodNote) => void;
		onnew: (name: string, size: string, place: string) => void;
		oncancel: () => void;
	};
	let { foods, places, startName, startPlace, onknown, onnew, oncancel }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 150);
	const first = () => ({ name: startName, place: startPlace });
	let name = $state(first().name);
	let step = $state<'name' | 'size' | 'place'>('name');
	let size = $state('');
	let place = $state(first().place);

	const text = $derived(name.trim());
	const found = $derived(
		text ? foods.filter((food) => isFound(food, text)).sort((a, b) => a.item.name.localeCompare(b.item.name)) : []
	);
</script>

<div class="wfd-add">
	<div class="wfd-add__top">
		<h3 class="wfd-add__title wfd-display">Add to pantry</h3>
		<Button kind="link" onclick={oncancel}>Cancel</Button>
	</div>

	{#if step === 'name'}
		<label class="wfd-add__field">
			<span class="wfd-label">Name</span>
			<!-- svelte-ignore a11y_autofocus -->
			<input type="text" autofocus enterkeyhint="search" bind:value={name} />
		</label>
		{#if text}
			<ul class="wfd-add__list" in:fade={{ duration }}>
				{#each found as food (food.path)}
					<li>
						<button type="button" onclick={() => onknown(food)}>{food.item.name}</button>
					</li>
				{/each}
				<li>
					<button class="wfd-add__new" type="button" onclick={() => (step = 'size')}>
						New: {text}
					</button>
				</li>
			</ul>
		{/if}
	{:else if step === 'size'}
		<p class="wfd-add__what">{text}</p>
		<SizeField value={size} onchange={(next) => (size = next)} />
		<Button kind="main" disabled={!size} onclick={() => (step = 'place')}>Next</Button>
	{:else}
		<p class="wfd-add__what">{text} · {size}</p>
		<div class="wfd-add__chips" role="group" aria-label="Place">
			{#each places as option (option)}
				<Chip label={option} on={place === option} onclick={() => (place = option)} />
			{/each}
		</div>
		<Button kind="main" disabled={!place} onclick={() => onnew(text, size, place)}>Add</Button>
	{/if}
</div>

<style>
	.wfd-add {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
		padding: 16px;
		border: 2px solid var(--wfd-ink);
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-card);
	}

	.wfd-add__top {
		display: flex;
		gap: 12px;
		align-items: center;
		justify-content: space-between;
	}

	.wfd-add__title {
		margin: 0;
		font-size: 22px;
	}

	.wfd-add__field {
		display: grid;
		gap: 6px;
		color: var(--wfd-ink-2);

		& input {
			box-sizing: border-box;
			inline-size: 100%;
			block-size: 44px;
			font-size: 17px;
		}
	}

	/* A long list scrolls in its own box, so that the field stays in view. */
	.wfd-add__list {
		display: grid;
		max-block-size: 40vh;
		margin: 0;
		padding: 0;
		overflow-y: auto;
		list-style: none;

		& button {
			inline-size: 100%;
			block-size: auto;
			min-block-size: 48px;
			padding: 0 4px;
			border: 0;
			border-block-end: 1px solid var(--wfd-line);
			border-radius: 0;
			background: none;
			box-shadow: none;
			color: var(--wfd-ink);
			font-family: inherit;
			font-size: 17px;
			text-align: start;
			cursor: pointer;
		}
	}

	button.wfd-add__new {
		font-weight: 700;
	}

	.wfd-add__what {
		margin: 0;
		font-size: 18px;
		font-weight: 600;
	}

	.wfd-add__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0 6px;
	}
</style>
