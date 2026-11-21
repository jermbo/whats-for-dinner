<script lang="ts">
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
	import { showLength } from '../../occasion/clock';
	import type { PlanDish } from '../../occasion/cook-plan';
	import { tokenTime } from '../motion';

	type Props = {
		one: MenuDish;
		// The recipe of the dish, or null for a dish with only a name.
		entry: RecipeEntry | null;
		onpick: () => void;
		onready: (ready: boolean) => void;
		onchange: (change: DishChange) => void;
		oncook: () => void;
		// The time and the start of your dish, from the plan of the day.
		time?: PlanDish;
	};
	let { one, entry, onpick, onready, onchange, oncook, time }: Props = $props();

	const duration = $derived(tokenTime('change'));
	const { dish, course } = $derived(one);
	const name = $derived(entry ? showName(entry.recipe.title) : dish.name);
	const person = $derived(dish.person === null ? null : personName(dish.person));
	const yours = $derived(person === null);
	// Mum cooks her own pie, so only your dishes have "Cook" and the work before the day.
	const canCook = $derived(yours && entry !== null && !dish.ready);
	// "Start 13:30", or only the time when the serve time is not there, or "Set time". A guess has "~".
	const timeText = $derived.by(() => {
		if (!time || time.dish.ready) return null;
		const mark = time.guessed ? '~' : '';
		if (time.start) return `Start ${mark}${time.start}`;
		return time.minutes === null ? 'Set time' : `${mark}${showLength(time.minutes)}`;
	});
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
			<span class="wfd-dish__name" title={name}><Struck on={dish.ready}>{name}</Struck></span>
			<span class="wfd-dish__meta">
				{#if dish.scale !== 1}<span class="wfd-dish__scale wfd-number">×{dish.scale}</span>{/if}
				{#if person === OPEN}
					<Sticker label="Who brings?" kind="dashed" />
				{:else}
					<span class="wfd-dish__course wfd-label">{course}</span>
				{/if}
				{#if timeText}<span class="wfd-dish__time wfd-label">{timeText}</span>{/if}
			</span>
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
			outline-offset: var(--wfd-focus-inset);
		}
	}

	button.wfd-dish__check:active :global(.wfd-tick) {
		scale: 0.88;
	}

	button.wfd-dish__open {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--wfd-space-tight);
		align-items: flex-start;
		justify-content: center;
		min-inline-size: 0;
		/* Obsidian sets nowrap on buttons: the name must wrap or clip inside the card. */
		white-space: normal;
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
			outline-offset: var(--wfd-focus-offset);
		}
	}

	.wfd-dish__name {
		min-inline-size: 0;
		font-size: var(--wfd-font-size-name);
		font-weight: 600;
		line-height: var(--wfd-line-height-display);
		overflow-wrap: anywhere;
		/* Two lines at most: a long title ends in "…" and the full name is the tooltip. */
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		max-inline-size: 100%;
	}

	.wfd-dish__meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-tight) var(--wfd-space-group);
		align-items: center;
	}

	.wfd-dish__scale {
		font-size: var(--wfd-font-size-name);
	}

	.wfd-dish__course {
		color: var(--wfd-color-text-muted);
	}

	/* The start is the fact that you act on, so it is in the text colour, not muted. */
	.wfd-dish__time {
		white-space: nowrap;
	}

	/* The Cook link keeps its size: the name gives way, not the action. */
	.wfd-dish__row :global(.wfd-button--link) {
		flex: none;
		white-space: nowrap;
	}

	.wfd-dish__prep {
		padding-block-end: var(--wfd-space-inset);
	}
</style>
