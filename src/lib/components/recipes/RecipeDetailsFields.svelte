<script>
	import { MEAL_TYPES, labelOf } from '$lib/data/options';
	import { plural } from '$lib/util/format';
	import PrepStepFields from './PrepStepFields.svelte';

	/**
	 * The fields of the recipe form that have a usual value: the meal type, the servings, the
	 * source, the rotation, and the preparation. They are closed until the owner needs them,
	 * and the closed line tells their values.
	 * @type {{ recipe: import('$lib/types').Recipe }}
	 */
	let { recipe = $bindable() } = $props();

	const uid = $props.id();

	const summary = $derived(
		[
			labelOf(MEAL_TYPES, recipe.mealType),
			plural(Number(recipe.servings) || 1, 'serving'),
			recipe.inRotation ? 'In rotation' : '',
			recipe.prepSteps.length > 0 ? 'Preparation' : ''
		]
			.filter(Boolean)
			.join(' · ')
	);
</script>

<details class="recipe-details">
	<summary class="recipe-details__summary">
		<span class="recipe-details__title">Details</span>
		<span class="muted">{summary}</span>
	</summary>

	<div class="stack recipe-details__body">
		<div class="recipe-details__pair">
			<div class="field">
				<label class="field__label" for="{uid}-meal">Meal type</label>
				<select class="field__control" id="{uid}-meal" bind:value={recipe.mealType}>
					{#each MEAL_TYPES as type (type.value)}
						<option value={type.value}>{type.label}</option>
					{/each}
				</select>
			</div>

			<div class="field">
				<label class="field__label" for="{uid}-servings">Servings</label>
				<input
					class="field__control"
					id="{uid}-servings"
					type="number"
					inputmode="numeric"
					min="1"
					bind:value={recipe.servings}
				/>
			</div>
		</div>

		<div class="field">
			<label class="field__label" for="{uid}-source">Source</label>
			<input
				class="field__control"
				id="{uid}-source"
				placeholder="A URL, or a book name and a page"
				bind:value={recipe.source}
			/>
		</div>

		<label class="field field--inline">
			<input type="checkbox" bind:checked={recipe.inRotation} />
			<span>In my rotation</span>
		</label>

		<PrepStepFields bind:steps={recipe.prepSteps} />
	</div>
</details>

<style>
	.recipe-details {
		background: var(--color-surface);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
	}

	.recipe-details__summary {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-1) var(--space-3);
		min-block-size: var(--tap);
		padding: var(--space-3) var(--space-5);
		border-radius: var(--radius);
		cursor: pointer;
	}

	.recipe-details__title {
		font-family: var(--font-heading);
		font-size: 1.1rem;
		font-weight: 600;
	}

	.recipe-details__body {
		padding: var(--space-2) var(--space-5) var(--space-5);
	}

	.recipe-details__pair {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 7rem;
		gap: var(--space-3);
	}
</style>
