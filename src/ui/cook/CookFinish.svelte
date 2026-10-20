<script lang="ts">
	import { countMeal, stocksAfterMeal } from '../../cook/out-of-pantry';
	import type { CookResult } from '../../kitchen/types';
	import type { RecipeEntry } from '../../recipes/types';
	import { showMeasure } from '../../units';
	import Field from '../parts/Field.svelte';

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

	// The pantry as it is when this page opens. A change of a note after that does not move the rows.
	const count = () => countMeal(entry.match.ingredients, picked);
	const { counted, others, check } = count();

	// For each counted ingredient: if you used it. The food item is the one of "Get out".
	let used = $state(counted.map(() => true));
	let rating = $state<number | null>(null);
	let note = $state('');
	let photos = $state<FileList | null>(null);

	async function done(event: SubmitEvent) {
		event.preventDefault();
		busy = true;

		const stocks = stocksAfterMeal(counted, used);
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

	<Field label="Note for the next time">
		<textarea id="{uid}-note" rows="2" bind:value={note}></textarea>
	</Field>

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
		gap: var(--wfd-space-section);
	}

	.wfd-finish__part {
		display: grid;
		gap: var(--wfd-space-group);
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
		color: var(--wfd-color-text-muted);
	}

	.wfd-finish__legend {
		inline-size: 100%;
		margin-block-end: var(--wfd-space-tight);
		padding: 0 0 var(--wfd-space-tight);
		border-block-end: var(--wfd-border) solid var(--wfd-color-border);
		color: var(--wfd-color-text);
		font-size: var(--wfd-font-size-title);
	}

	.wfd-finish__row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group) var(--wfd-space-stack);
		align-items: center;
		min-block-size: 52px;
		padding-block: var(--wfd-space-tight);
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-border);
		color: var(--wfd-color-text);
	}

	.wfd-finish__used {
		display: flex;
		flex: 1 1 10rem;
		gap: var(--wfd-space-stack);
		align-items: center;
		min-block-size: var(--wfd-control-min);
		cursor: pointer;
	}

	.wfd-finish__name {
		font-size: var(--wfd-font-size-text);
		font-weight: 500;
	}

	.wfd-finish__food {
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
	}

	.wfd-finish__amount {
		font-size: var(--wfd-font-size-name);
	}

	.wfd-finish__hint {
		margin: 0;
		font-size: var(--wfd-font-size-small);
	}

	.wfd-finish__stars {
		display: flex;
		gap: var(--wfd-space-group);
	}

	button.wfd-finish__star {
		inline-size: 52px;
		block-size: var(--wfd-control);
		padding: 0;
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-control);
		box-shadow: none;
		color: var(--wfd-color-text-faint);
		font-size: var(--wfd-font-size-title);
		line-height: var(--wfd-line-height-single);
		cursor: pointer;
		transition:
			background-color var(--wfd-chip-motion),
			scale var(--wfd-chip-motion);

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}

		&:active {
			scale: 0.9;
		}
	}

	button.wfd-finish__star--on {
		border-color: var(--wfd-color-selected);
		background: var(--wfd-color-selected);
		color: var(--wfd-color-on-selected);
	}

	.wfd-finish__photo {
		color: var(--wfd-color-text);
		font-family: inherit;
		font-size: var(--wfd-font-size-small);
	}
</style>
