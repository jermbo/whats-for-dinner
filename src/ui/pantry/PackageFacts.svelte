<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import Chip from '../parts/Chip.svelte';
	import Field from '../parts/Field.svelte';

	// The facts of the package in the last step of "Add to pantry", all filled in. They are small,
	// because you look, and you tap a fact only when it is wrong. The food item and the size open their own steps; the place
	// and the count open a row of chips here, because each is one tap.
	type Props = {
		name: string;
		isNew: boolean;
		size: string;
		place: string;
		places: string[];
		count: number;
		onname: () => void;
		onsize: () => void;
		onplace: (place: string) => void;
		oncount: (count: number) => void;
	};
	let { name, isNew, size, place, places, count, onname, onsize, onplace, oncount }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 150);
	const COUNTS = [1, 2, 3, 4, 6, 12];

	// With no place, the row of places is open, because a package needs one.
	let open = $state<'place' | 'count' | null>(null);
	const shown = $derived(place ? open : 'place');
	let countText = $state('');

	const toggle = (row: 'place' | 'count') => (open = open === row ? null : row);

	function pickPlace(next: string) {
		onplace(next);
		open = null;
	}

	function pickCount(next: number) {
		countText = '';
		oncount(next);
		open = null;
	}

	function setCount(next: string) {
		countText = next;
		const typed = Number(next);
		if (Number.isInteger(typed) && typed >= 1 && typed <= 99) oncount(typed);
	}
</script>

<div class="wfd-facts">
	<div class="wfd-facts__row" role="group" aria-label="Package">
		<button class="wfd-facts__fact wfd-facts__fact--name" type="button" onclick={onname}>
			{#if isNew}<span class="wfd-facts__new wfd-label">New</span>{/if}
			{name}
		</button>
		<button class="wfd-facts__fact" type="button" aria-label="Size: {size}" onclick={onsize}>{size}</button>
		<button
			class="wfd-facts__fact"
			type="button"
			aria-label="Place: {place || 'none'}"
			aria-expanded={shown === 'place'}
			onclick={() => toggle('place')}
		>
			{place || 'Place'}
		</button>
		<button
			class="wfd-facts__fact"
			type="button"
			aria-expanded={shown === 'count'}
			onclick={() => toggle('count')}
		>
			{count === 1 ? '1 package' : `${count} packages`}
		</button>
	</div>

	{#if shown === 'place'}
		<div class="wfd-facts__chips" role="group" aria-label="Place" transition:slide={{ duration }}>
			{#each places as option (option)}
				<Chip label={option} on={place === option} onclick={() => pickPlace(option)} />
			{/each}
		</div>
	{:else if shown === 'count'}
		<div class="wfd-facts__chips" role="group" aria-label="Packages" transition:slide={{ duration }}>
			{#each COUNTS as option (option)}
				<Chip label={String(option)} on={count === option && !countText} onclick={() => pickCount(option)} />
			{/each}
			<div class="wfd-facts__count">
				<Field kind="number">
					<input
						type="text"
						inputmode="numeric"
						placeholder="More"
						aria-label="Number of packages"
						value={countText}
						oninput={(event) => setCount(event.currentTarget.value)}
					/>
				</Field>
			</div>
		</div>
	{/if}
</div>

<style>
	.wfd-facts {
		display: grid;
		flex: 1;
		gap: var(--wfd-space-group);
		min-inline-size: 0;
	}

	.wfd-facts__row,
	.wfd-facts__chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group);
		align-items: center;
	}

	/* A fact reads as a value that you can tap: the face of a chip, with the height of a thumb. */
	button.wfd-facts__fact {
		display: inline-flex;
		gap: var(--wfd-space-group);
		align-items: center;
		block-size: auto;
		min-block-size: var(--wfd-control-min);
		padding: 0 var(--wfd-space-inset);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-control);
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		font-size: var(--wfd-font-size-small);
		font-weight: 600;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}

		&[aria-expanded='true'] {
			border-color: var(--wfd-color-selected);
		}
	}

	/* The food item is the fact that you check first, so it is the largest. */
	button.wfd-facts__fact--name {
		font-size: var(--wfd-font-size-text);
		font-weight: 700;
	}

	.wfd-facts__new {
		color: var(--wfd-color-text-muted);
	}

	.wfd-facts__count {
		inline-size: calc(2 * var(--wfd-control));
	}
</style>
