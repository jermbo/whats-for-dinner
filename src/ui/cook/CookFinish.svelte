<script lang="ts">
	import { optionsOf } from '../../cook/pick-food';
	import type { CookResult, RecipeEntry } from '../../kitchen/types';
	import { showName } from '../../match/names';
	import type { FoodNote } from '../../note';
	import { takeOut } from '../../pantry/total';
	import type { Stock } from '../../pantry/types';
	import { showMeasure, type Measure } from '../../units';

	type Props = {
		// The button that sends this form is in the navigation of Cook Mode. It finds the form by this.
		id: string;
		entry: RecipeEntry;
		// The food item that "Get out" selected for each ingredient, by its place in the matches.
		picked: (string | null)[];
		ondone: (result: CookResult) => Promise<void>;
		// True while the notes of the vault change.
		busy?: boolean;
	};
	let { id, entry, picked, ondone, busy = $bindable(false) }: Props = $props();

	const uid = $props.id();

	// An ingredient that the plugin can take out of the pantry: it has an amount, and one or more
	// food items have an amount that compares.
	type Counted = { name: string; need: Measure; options: FoodNote[]; first: FoodNote };

	// Food that the pantry counts, but in an amount that compares with nothing, such as 1 onion
	// against a bag of 1 kg. Water with the row "tap" has no amount, so it is never to check.
	const isCounted = (food: FoodNote) => food.item.stocks.some((stock) => stock.amount?.factor);

	// The pantry as it is when this page opens. A change of a note after that does not move the rows.
	function count(): { counted: Counted[]; others: string[]; check: string[] } {
		const counted: Counted[] = [];
		const others: string[] = [];
		const check: string[] = [];
		for (const [at, match] of entry.match.ingredients.entries()) {
			const { ingredient, food, need } = match;
			const options = need ? optionsOf(match) : [];
			if (need && options.length) {
				const first =
					options.find((option) => option.path === picked[at]) ??
					options.find((option) => option.path === food?.path) ??
					options[0];
				counted.push({ name: showName(ingredient.name), need, options, first });
			} else {
				others.push(showName(ingredient.name));
				if (need && food && isCounted(food)) check.push(food.path);
			}
		}
		return { counted, others, check };
	}
	const { counted, others, check } = count();

	// For each counted ingredient: if you used it. The food item is the one of "Get out".
	let used = $state(counted.map(() => true));
	let rating = $state<number | null>(null);
	let note = $state('');
	let photos = $state<FileList | null>(null);

	async function done(event: SubmitEvent) {
		event.preventDefault();
		busy = true;

		// Two ingredients can use the same food item, so each one starts with the rows that are left.
		const stocks = new Map<string, Stock[]>();
		counted.forEach((row, at) => {
			if (!used[at]) return;
			const food = row.first;
			stocks.set(food.path, takeOut(stocks.get(food.path) ?? food.item.stocks, row.need));
		});

		try {
			await ondone({ stocks, check, rating, note, photo: photos?.[0] ?? null });
		} finally {
			busy = false;
		}
	}
</script>

<form class="wfd-finish" {id} onsubmit={done}>
	<fieldset class="wfd-finish__part">
		<legend class="wfd-finish__legend wfd-display">Out of the pantry</legend>
		{#if !counted.length}
			<p class="wfd-finish__hint">The plugin cannot count an ingredient of this recipe.</p>
		{/if}
		{#each counted as row, at}
			<div class="wfd-finish__row">
				<label class="wfd-finish__used">
					<input type="checkbox" bind:checked={used[at]} />
					<span class="wfd-finish__name">{row.name}</span>
				</label>
				{#if row.options.length > 1}
					<span class="wfd-finish__food">{row.first.item.name}</span>
				{/if}
				<span class="wfd-finish__amount wfd-number">{showMeasure(row.need)}</span>
			</div>
		{/each}
		{#if others.length}
			<p class="wfd-finish__hint">Not counted: {others.join(', ')}.</p>
		{/if}
	</fieldset>

	<fieldset class="wfd-finish__part">
		<legend class="wfd-finish__legend wfd-display">How was it?</legend>
		<div class="wfd-finish__stars">
			{#each [1, 2, 3, 4, 5] as value}
				{@const on = rating !== null && value <= rating}
				<button
					class="wfd-finish__star"
					class:wfd-finish__star--on={on}
					type="button"
					aria-label="{value} of 5"
					aria-pressed={on}
					onclick={() => (rating = rating === value ? null : value)}
				>
					★
				</button>
			{/each}
		</div>
	</fieldset>

	<label class="wfd-finish__part" for="{uid}-note">
		<span class="wfd-label">Note for the next time</span>
		<textarea id="{uid}-note" rows="2" bind:value={note}></textarea>
	</label>

	<label class="wfd-finish__part" for="{uid}-photo">
		<span class="wfd-label">Photo</span>
		<input
			class="wfd-finish__photo"
			id="{uid}-photo"
			type="file"
			accept="image/*"
			capture="environment"
			bind:files={photos}
		/>
	</label>
</form>

<style>
	.wfd-finish {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 22px;
	}

	.wfd-finish__part {
		display: grid;
		gap: 6px;
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
		color: var(--wfd-ink-2);
	}

	.wfd-finish__legend {
		inline-size: 100%;
		margin-block-end: 4px;
		padding: 0 0 6px;
		border-block-end: 2px solid var(--wfd-ink);
		color: var(--wfd-ink);
		font-size: 20px;
	}

	.wfd-finish__row {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 12px;
		align-items: center;
		min-block-size: 52px;
		padding-block: 4px;
		border-block-end: 1px solid var(--wfd-line);
		color: var(--wfd-ink);
	}

	.wfd-finish__used {
		display: flex;
		flex: 1 1 10rem;
		gap: 12px;
		align-items: center;
		min-block-size: 44px;
		cursor: pointer;
	}

	.wfd-finish__name {
		font-size: 17px;
		font-weight: 500;
	}

	.wfd-finish__food {
		color: var(--wfd-ink-2);
		font-size: 15px;
	}

	.wfd-finish__amount {
		font-size: 18px;
	}

	.wfd-finish__hint {
		margin: 0;
		font-size: 14px;
	}

	.wfd-finish__stars {
		display: flex;
		gap: 6px;
	}

	button.wfd-finish__star {
		inline-size: 52px;
		block-size: 52px;
		padding: 0;
		border: 2px solid var(--wfd-line);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-quiet);
		box-shadow: none;
		color: var(--wfd-ink-3);
		font-size: 26px;
		line-height: 1;
		cursor: pointer;
		transition:
			background-color 0.15s ease-out,
			scale 0.15s ease-out;

		&:focus-visible {
			outline: 2px solid var(--wfd-ink);
			outline-offset: 2px;
		}

		&:active {
			scale: 0.9;
		}
	}

	button.wfd-finish__star--on {
		border-color: var(--wfd-ink);
		background: var(--wfd-ink);
		color: var(--wfd-on-ink);
	}

	.wfd-finish__part :global(textarea) {
		inline-size: 100%;
	}

	.wfd-finish__photo {
		color: var(--wfd-ink);
		font-family: inherit;
		font-size: 15px;
	}

	@media (prefers-reduced-motion: reduce) {
		button.wfd-finish__star {
			transition: none;
		}
	}
</style>
