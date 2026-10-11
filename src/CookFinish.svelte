<script lang="ts">
	import type { CookResult, RecipeEntry } from './kitchen-state.svelte';
	import { showName } from './match/names';
	import type { FoodNote } from './note';
	import { available, takeOut } from './pantry/total';
	import type { Stock } from './pantry/types';
	import { showMeasure, type Measure } from './units';

	type Props = { entry: RecipeEntry; ondone: (result: CookResult) => Promise<void> };
	let { entry, ondone }: Props = $props();

	const uid = $props.id();

	// An ingredient that the plugin can take out of the pantry: it has an amount, and one or more
	// food items have an amount that compares.
	type Counted = { name: string; need: Measure; options: FoodNote[]; first: string };

	// The pantry as it is when this page opens. A change of a note after that does not move the rows.
	function count(): { counted: Counted[]; others: string[] } {
		const counted: Counted[] = [];
		const others: string[] = [];
		for (const { ingredient, candidates, food, need } of entry.match.ingredients) {
			const options = need
				? candidates.filter((option) => available(option.item.stocks, need.kind) > 0)
				: [];
			if (need && options.length) {
				const first = options.find((option) => option.path === food?.path) ?? options[0];
				counted.push({ name: showName(ingredient.name), need, options, first: first.path });
			} else {
				others.push(showName(ingredient.name));
			}
		}
		return { counted, others };
	}
	const { counted, others } = count();

	// For each counted ingredient: if you used it, and from which food item.
	let choices = $state(counted.map((row) => ({ used: true, food: row.first })));
	let rating = $state<number | null>(null);
	let note = $state('');
	let photos = $state<FileList | null>(null);
	let busy = $state(false);

	async function done(event: SubmitEvent) {
		event.preventDefault();
		busy = true;

		// Two ingredients can use the same food item, so each one starts with the rows that are left.
		const stocks = new Map<string, Stock[]>();
		counted.forEach((row, at) => {
			const food = row.options.find((option) => option.path === choices[at].food);
			if (!choices[at].used || !food) return;
			stocks.set(food.path, takeOut(stocks.get(food.path) ?? food.item.stocks, row.need));
		});

		try {
			await ondone({ stocks, rating, note, photo: photos?.[0] ?? null });
		} finally {
			busy = false;
		}
	}
</script>

<form class="finish" onsubmit={done}>
	<fieldset class="finish__part">
		<legend class="finish__legend">Take out of the pantry</legend>
		{#if !counted.length}
			<p class="finish__hint">The plugin cannot count an ingredient of this recipe.</p>
		{/if}
		{#each counted as row, at}
			<div class="finish__row">
				<label class="finish__used">
					<input type="checkbox" bind:checked={choices[at].used} />
					<span>{row.name}</span>
					<span class="finish__amount">{showMeasure(row.need)}</span>
				</label>
				{#if row.options.length > 1}
					<select aria-label="The food item for {row.name}" bind:value={choices[at].food}>
						{#each row.options as option}
							<option value={option.path}>{option.item.name}</option>
						{/each}
					</select>
				{/if}
			</div>
		{/each}
		{#if others.length}
			<p class="finish__hint">Not counted: {others.join(', ')}.</p>
		{/if}
	</fieldset>

	<fieldset class="finish__part">
		<legend class="finish__legend">Rating</legend>
		<div class="finish__stars">
			{#each [1, 2, 3, 4, 5] as value}
				{@const on = rating !== null && value <= rating}
				<button
					class="finish__star"
					type="button"
					aria-label="{value} of 5"
					aria-pressed={on}
					onclick={() => (rating = rating === value ? null : value)}
				>
					{on ? '★' : '☆'}
				</button>
			{/each}
		</div>
	</fieldset>

	<label class="finish__part" for="{uid}-note">
		<span class="finish__legend">Note for the next time</span>
		<textarea id="{uid}-note" rows="3" bind:value={note}></textarea>
	</label>

	<label class="finish__part" for="{uid}-photo">
		<span class="finish__legend">Photo</span>
		<input id="{uid}-photo" type="file" accept="image/*" capture="environment" bind:files={photos} />
	</label>

	<button class="finish__done mod-cta" type="submit" disabled={busy}>
		{busy ? 'One moment' : 'Done'}
	</button>
</form>

<style>
	.finish {
		display: grid;
		gap: var(--size-4-6);
	}

	.finish__part {
		display: grid;
		gap: var(--size-4-2);
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.finish__legend {
		padding: 0;
		font-size: var(--font-ui-medium);
		font-weight: var(--font-semibold);
	}

	.finish__row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--size-4-2);
		align-items: center;
		justify-content: space-between;
		border-block-end: var(--border-width) solid var(--background-modifier-border);
	}

	.finish__used {
		display: flex;
		flex: 1 1 12rem;
		gap: var(--size-4-3);
		align-items: center;
		min-block-size: 44px;
		cursor: pointer;
	}

	.finish__amount,
	.finish__hint {
		color: var(--text-muted);
	}

	.finish__hint {
		margin: 0;
		font-size: var(--font-ui-small);
	}

	.finish__stars {
		display: flex;
		gap: var(--size-4-1);
	}

	.finish__star {
		inline-size: 48px;
		block-size: 48px;
		padding: 0;
		border: 0;
		background: none;
		box-shadow: none;
		color: var(--text-muted);
		font-size: 2rem;
		line-height: 1;
		transition: scale 0.15s ease-out;

		&[aria-pressed='true'] {
			color: var(--color-yellow);
			scale: 1.1;
		}
	}

	.finish__part :global(textarea) {
		inline-size: 100%;
	}

	.finish__done {
		min-block-size: 56px;
		font-size: var(--font-ui-medium);
	}

	@media (prefers-reduced-motion: reduce) {
		.finish__star {
			transition: none;
		}
	}
</style>
