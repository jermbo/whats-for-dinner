<script>
	import IngredientDialog from '$lib/components/ingredients/IngredientDialog.svelte';
	import { MEAL_TYPES } from '$lib/data/options';
	import { saveRecipe } from '$lib/data/recipes';
	import { sortByName } from '$lib/util/collections';
	import PrepStepFields from './PrepStepFields.svelte';
	import RecipeIngredientFields from './RecipeIngredientFields.svelte';

	/** @typedef {import('$lib/types').Recipe} Recipe */

	/**
	 * @type {{
	 *   recipe: Recipe,
	 *   ingredients: import('$lib/types').Ingredient[],
	 *   onsave: (recipe: Recipe) => void
	 * }}
	 */
	let { recipe, ingredients, onsave } = $props();

	const uid = $props.id();
	const initial = () => structuredClone(recipe);
	let form = $state(initial());

	/** @type {IngredientDialog | undefined} */
	let dialog = $state();

	/** @param {SubmitEvent} event */
	async function submit(event) {
		event.preventDefault();
		onsave(await saveRecipe($state.snapshot(form)));
	}
</script>

<form class="stack stack--loose" onsubmit={submit}>
	<div class="stack">
		<div class="field">
			<label class="field__label" for="{uid}-name">Name</label>
			<input
				class="field__control"
				id="{uid}-name"
				bind:value={form.name}
				required
				autocomplete="off"
			/>
		</div>

		<div class="field">
			<label class="field__label" for="{uid}-meal">Meal type</label>
			<select class="field__control" id="{uid}-meal" bind:value={form.mealType}>
				{#each MEAL_TYPES as type (type.value)}
					<option value={type.value}>{type.label}</option>
				{/each}
			</select>
		</div>

		<div class="field field--narrow">
			<label class="field__label" for="{uid}-servings">Servings</label>
			<input
				class="field__control"
				id="{uid}-servings"
				type="number"
				inputmode="numeric"
				min="1"
				bind:value={form.servings}
			/>
		</div>

		<div class="field">
			<label class="field__label" for="{uid}-source">Source</label>
			<input
				class="field__control"
				id="{uid}-source"
				bind:value={form.source}
				aria-describedby="{uid}-source-hint"
			/>
			<span class="field__hint" id="{uid}-source-hint">A URL, or a book name and a page.</span>
		</div>

		<label class="field field--inline">
			<input type="checkbox" bind:checked={form.inRotation} />
			<span>In my rotation</span>
		</label>
	</div>

	<RecipeIngredientFields
		bind:rows={form.ingredients}
		ingredients={sortByName(ingredients)}
		onnew={() => dialog?.open()}
	/>

	<PrepStepFields bind:steps={form.prepSteps} />

	<div class="field">
		<label class="field__label" for="{uid}-steps">Steps</label>
		<textarea class="field__control" id="{uid}-steps" bind:value={form.steps}></textarea>
	</div>

	<button class="button button--primary button--wide" type="submit">Save recipe</button>
</form>

<!-- Outside the form: a form cannot contain a second form. -->
<IngredientDialog
	bind:this={dialog}
	onsave={(ingredient) => form.ingredients.push({ ingredientId: ingredient.id, quantity: 0 })}
/>
