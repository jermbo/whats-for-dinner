<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import { showName } from '../../match/names';
	import type { MenuDish } from '../../occasion/menu';
	import { OPEN, personName, type DishChange } from '../../occasion/occasion-note';
	import type { RecipeEntry } from '../../recipes/types';
	import { coverThen } from '../cover';
	import Button from '../parts/Button.svelte';
	import Sticker from '../parts/Sticker.svelte';
	import Struck from '../parts/Struck.svelte';
	import Tick from '../parts/Tick.svelte';
	import PrepNote from '../recipes/PrepNote.svelte';

	type Props = {
		one: MenuDish;
		// The recipe of the dish, or null for a dish with only a name.
		entry: RecipeEntry | null;
		onpick: () => void;
		onready: (ready: boolean) => void;
		onchange: (change: DishChange) => void;
		oncook: () => void;
	};
	let { one, entry, onpick, onready, onchange, oncook }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	const { dish, course } = $derived(one);
	const name = $derived(entry ? showName(entry.recipe.title) : dish.name);
	const person = $derived(dish.person === null ? null : personName(dish.person));
	const yours = $derived(person === null);
	// Mum cooks her own pie, so only your dishes have "Cook" and the work before the day.
	const canCook = $derived(yours && entry !== null && !dish.ready);
	const prep = $derived(yours && !dish.ready ? (entry?.prep ?? null) : null);
</script>

<div class="wfd-dish">
	<div class="wfd-dish__row">
		<button
			class="wfd-dish__check"
			type="button"
			aria-pressed={dish.ready}
			aria-label="{name} is ready"
			onclick={() => onready(!dish.ready)}
		>
			<Tick on={dish.ready} />
		</button>
		<!-- A tap on the name opens "Who brings?". The check is its own button, so it does not. -->
		<button class="wfd-dish__open" type="button" aria-haspopup="dialog" onclick={onpick}>
			<span class="wfd-dish__name"><Struck on={dish.ready}>{name}</Struck></span>
			{#if dish.scale !== 1}<span class="wfd-dish__scale wfd-number">×{dish.scale}</span>{/if}
			{#if person === OPEN}
				<Sticker label="Who brings?" kind="dashed" />
			{:else}
				<span class="wfd-dish__course wfd-label">{course}</span>
			{/if}
		</button>
		{#if canCook}
			<Button kind="link" onclick={(event) => coverThen(event, 'frame', oncook)}>Cook</Button>
		{/if}
	</div>

	{#if prep}
		<div class="wfd-dish__prep" transition:slide={{ duration }}>
			<PrepNote text={prep} done={dish.prepDone} onchange={(done) => onchange({ prepDone: done })} />
		</div>
	{/if}
</div>

<style>
	.wfd-dish {
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-track);
	}

	.wfd-dish__row {
		display: flex;
		gap: var(--wfd-space-group);
		align-items: center;
		min-block-size: var(--wfd-control);
	}

	/* The check is its own button: a tap on it marks the dish, and does not open the sheet. */
	button.wfd-dish__check {
		display: grid;
		flex: none;
		place-items: center;
		inline-size: var(--wfd-control-min);
		block-size: var(--wfd-control-min);
		padding: 0;
		border: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text-muted);
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: -4px;
		}
	}

	button.wfd-dish__check:active :global(.wfd-tick) {
		scale: 0.88;
	}

	button.wfd-dish__open {
		display: flex;
		flex: 1;
		flex-wrap: wrap;
		gap: var(--wfd-space-tight) var(--wfd-space-group);
		align-items: center;
		min-inline-size: 0;
		block-size: auto;
		min-block-size: var(--wfd-control);
		padding: var(--wfd-space-group) 0;
		border: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		text-align: start;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	.wfd-dish__name {
		min-inline-size: 0;
		font-size: var(--wfd-font-size-name);
		font-weight: 600;
		line-height: var(--wfd-line-height-display);
		overflow-wrap: anywhere;
	}

	.wfd-dish__scale {
		font-size: var(--wfd-font-size-name);
	}

	.wfd-dish__course {
		color: var(--wfd-color-text-muted);
	}

	.wfd-dish__prep {
		padding-block-end: var(--wfd-space-inset);
	}
</style>
