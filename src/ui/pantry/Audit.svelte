<script lang="ts">
	import { flip } from 'svelte/animate';
	import { prefersReducedMotion } from 'svelte/motion';
	import { SvelteSet } from 'svelte/reactivity';
	import { fade, slide } from 'svelte/transition';
	import type { FoodNote } from '../../note';
	import { auditPlaces, foodsIn, startOf } from '../../pantry/audit';
	import { withFood } from '../../pantry/empty-row';
	import { barOf, levelOf } from '../../pantry/level';
	import { barParts } from '../../pantry/pantry-bar';
	import { totalOf } from '../../pantry/total';
	import type { Stock } from '../../pantry/types';
	import Button from '../parts/Button.svelte';
	import Sticker from '../parts/Sticker.svelte';
	import FoodCard from './FoodCard.svelte';
	import StockLine from './StockLine.svelte';

	// The weekly audit: one place at a time. "Right" confirms a food item, and a tap opens its card.
	type Props = {
		foods: FoodNote[];
		settingsPlaces: string[];
		places: string[];
		// The last place that an audit finished.
		done: string;
		onwrite: (food: FoodNote, rows: Stock[] | null) => Promise<void>;
		onright: (food: FoodNote) => Promise<unknown>;
		onfinish: (place: string) => Promise<void>;
		onopen: (path: string) => void;
		onstop: () => void;
	};
	let { foods, settingsPlaces, places, done, onwrite, onright, onfinish, onopen, onstop }: Props =
		$props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	// The places as the audit started, so that a moved package does not change the walk.
	const first = () => {
		const walk = auditPlaces(settingsPlaces, foods);
		return { walk, at: startOf(walk, done) };
	};
	const { walk, at: start } = first();
	let at = $state(start);
	const place = $derived(walk[at]);
	const isLast = $derived(at === walk.length - 1);

	const confirmed = new SvelteSet<string>();
	let open = $state<string | null>(null);

	// A food item that you confirmed goes to the end of the place, so that the next one is at the top.
	const list = $derived.by(() => {
		const all = foodsIn(foods, place);
		return [...all.filter((food) => !confirmed.has(food.path)), ...all.filter((food) => confirmed.has(food.path))];
	});

	async function right(food: FoodNote) {
		confirmed.add(food.path);
		if (food.item.check) await onright(food);
	}

	async function write(food: FoodNote, rows: Stock[] | null) {
		open = null;
		confirmed.add(food.path);
		await onwrite(food, rows);
	}

	async function next() {
		await onfinish(place);
		if (isLast) return onstop();
		confirmed.clear();
		open = null;
		at += 1;
	}

	const here = (food: FoodNote) => withFood(food.item.stocks).filter((stock) => stock.place === place);
</script>

<section class="wfd-audit" aria-label="Audit">
	<div class="wfd-audit__head">
		<div>
			<p class="wfd-label">Audit · {at + 1} of {walk.length}</p>
			{#key place}
				<h3 class="wfd-audit__place wfd-display" in:fade={{ duration }}>{place}</h3>
			{/key}
		</div>
		<Button kind="link" onclick={onstop}>Stop</Button>
	</div>

	{#if !list.length}
		<p class="wfd-audit__empty">Nothing is in {place}.</p>
	{/if}

	<ul class="wfd-audit__list">
		{#each list as food (food.path)}
			{@const level = levelOf(food.item)}
			<li class="wfd-audit__item" class:wfd-audit__item--done={confirmed.has(food.path)} animate:flip={{ duration }}>
				{#if open === food.path}
					<div transition:slide={{ duration }}>
						<FoodCard
							item={food.item}
							{place}
							places={walk}
							ondone={(rows) => write(food, rows)}
							oncancel={() => (open = null)}
							onfood={() => onopen(food.path)}
						/>
					</div>
				{:else}
					<div class="wfd-audit__row">
						<StockLine
							name={food.item.name}
							note={food.item.check ? 'A meal could not count it' : ''}
							amount={totalOf(food.item.stocks)}
							packages={withFood(food.item.stocks).length}
							bar={barOf(here(food), level)}
							parts={barParts(food.item.stocks, place)}
							days={null}
							soon={false}
							onclick={() => (open = food.path)}
						/>
						{#if confirmed.has(food.path)}
							<span class="wfd-audit__mark" in:fade={{ duration }}
								><span aria-hidden="true">✓</span><span class="wfd-audit__hidden">Confirmed</span></span
							>
						{:else}
							<div class="wfd-audit__right">
								{#if food.item.check}<Sticker label="Check" kind="amber" />{/if}
								<Button onclick={() => right(food)}>Right</Button>
							</div>
						{/if}
					</div>
				{/if}
			</li>
		{/each}
	</ul>

	<Button kind="main" onclick={next}>{isLast ? 'Done' : 'Next place'}</Button>
</section>

<style>
	.wfd-audit {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
	}

	.wfd-audit__head {
		display: flex;
		gap: 12px;
		align-items: end;
		justify-content: space-between;

		& p {
			margin: 0;
		}
	}

	.wfd-audit__place {
		margin: 0;
		font-size: 26px;
	}

	.wfd-audit__empty {
		margin: 0;
		color: var(--wfd-ink-2);
	}

	.wfd-audit__list {
		display: grid;
		gap: 4px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-audit__row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 12px;
		align-items: center;
	}

	.wfd-audit__right {
		display: flex;
		gap: 8px;
		align-items: center;
	}

	/* A food item that you confirmed is grey, so that the ones that are left stand out. */
	.wfd-audit__item--done {
		opacity: 0.55;
		transition: opacity 0.2s ease-out;
	}

	.wfd-audit__hidden {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.wfd-audit__mark {
		display: grid;
		place-items: center;
		inline-size: 44px;
		block-size: 44px;
		color: var(--wfd-olive);
		font-size: 22px;
		font-weight: 800;
	}
</style>
