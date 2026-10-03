<script>
	import { autosave } from '$lib/autosave.svelte';
	import IngredientDialog from '$lib/components/ingredients/IngredientDialog.svelte';
	import { blankIngredient } from '$lib/data/ingredients';
	import { hasContent, saveRecipe } from '$lib/data/recipes';
	import { newStep } from '$lib/data/step-list';
	import { sortByName } from '$lib/util/collections';
	import RecipeDetailsFields from './RecipeDetailsFields.svelte';
	import RecipeIngredientFields from './RecipeIngredientFields.svelte';
	import StepFields from './StepFields.svelte';

	/** @typedef {import('$lib/types').Recipe} Recipe */

	/**
	 * Write mode: the form of a recipe. It asks for text only: a name, the steps, and the
	 * ingredients. The photos come from Cook mode.
	 * There is no Save button. The form saves each change a moment after it, so nothing is lost
	 * when the owner puts the phone down. "Done" saves and gives the ID of the recipe: null
	 * when the owner typed nothing.
	 * @type {{
	 *   recipe: Recipe,
	 *   ingredients: import('$lib/types').Ingredient[],
	 *   ondone: (id: string | null) => void
	 * }}
	 */
	let { recipe, ingredients, ondone } = $props();

	const uid = $props.id();

	function initial() {
		const copy = structuredClone(recipe);
		// The list of steps always has one row to type in.
		if (copy.steps.length === 0) copy.steps.push(newStep());
		return copy;
	}
	let form = $state(initial());

	/**
	 * The ID and the first time of the record. A new recipe gets them at its first save. They
	 * are not in the form: the form must not change when it is saved.
	 */
	const record = () => ({ id: recipe.id, createdAt: recipe.createdAt });
	let saved = record();

	const saving = autosave(
		() => $state.snapshot(form),
		async (value) => {
			// A new recipe with no text is not a recipe yet.
			if (!saved.id && !hasContent(value)) return;
			const { id, createdAt } = await saveRecipe({ ...value, ...saved });
			saved = { id, createdAt };
		}
	);

	/** Stops the saves. Call it before the recipe is deleted, so that a save cannot bring it back. */
	export function discard() {
		saving.stop();
	}

	async function done() {
		await saving.flush();
		ondone(saved.id || null);
	}

	/** @type {StepFields | undefined} */
	let steps = $state();
	/** @type {IngredientDialog | undefined} */
	let dialog = $state();
	/** @type {RecipeIngredientFields | undefined} */
	let rows = $state();
	/** The quantity of the line that made a new ingredient. The row gets it after the dialog. */
	let quantity = 0;

	/**
	 * A name that the app does not know: the dialog asks for its unit one time.
	 * @param {string} name
	 * @param {number} amount
	 */
	function newIngredient(name, amount) {
		quantity = amount;
		// The name starts with a capital letter, as the other names in the pantry.
		dialog?.open({ ...blankIngredient(), name: name.charAt(0).toUpperCase() + name.slice(1) });
	}
</script>

<div class="recipe-form stack stack--loose wide">
	<div class="split split--loose recipe-form__columns">
		<div class="stack">
			<div class="field">
				<label class="visually-hidden" for="{uid}-name">Name of the recipe</label>
				<input
					class="field__control recipe-form__name"
					id="{uid}-name"
					placeholder="Name of the recipe"
					autocomplete="off"
					enterkeyhint="next"
					bind:value={form.name}
					onkeydown={(event) => {
						// Enter goes from the name to the first step, as in a note.
						if (event.key === 'Enter' && !event.isComposing) steps?.focus(0);
					}}
				/>
			</div>

			<StepFields bind:this={steps} bind:steps={form.steps} />
		</div>

		<div class="split__side">
			<RecipeIngredientFields
				bind:this={rows}
				bind:rows={form.ingredients}
				ingredients={sortByName(ingredients)}
				onnew={newIngredient}
			/>

			<RecipeDetailsFields bind:recipe={form} />
		</div>
	</div>

	<div class="recipe-form__actions">
		<button class="button button--primary button--wide" type="button" onclick={done}>Done</button>
		<p class="muted" role="status">
			{saving.pending
				? 'The app saves the changes…'
				: 'The app saves each change. Nothing is lost.'}
		</p>
	</div>
</div>

<IngredientDialog bind:this={dialog} onsave={(ingredient) => rows?.add(ingredient, quantity)} />

<style>
	/* The rows of the ingredients need less width than the steps. */
	.recipe-form__columns {
		--split-columns: minmax(0, 1.3fr) minmax(0, 1fr);
	}

	/* The name is the title of the page that the owner writes. */
	.recipe-form__name {
		min-block-size: 3.5rem;
		font-family: var(--font-heading);
		font-size: 1.35rem;
		font-weight: 600;
	}

	.recipe-form__actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		max-inline-size: 24rem;
		text-align: center;
	}
</style>
