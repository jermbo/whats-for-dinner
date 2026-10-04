<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import RecipeForm from '$lib/components/recipes/RecipeForm.svelte';
	import { blankRecipe } from '$lib/domain/recipes';
	import { useKitchen } from '$lib/state/kitchen.svelte';
	import { usePreferences } from '$lib/state/preferences.svelte';

	const kitchen = useKitchen();
	const preferences = usePreferences();
</script>

<!--
	The form copies the recipe one time, so it waits for the preferences.
	A form with no text made no recipe: "Done" then goes back to the list.
-->
{#if preferences.ready}
	<RecipeForm
		title="New recipe"
		recipe={blankRecipe(preferences.values.recipeServings)}
		ingredients={kitchen.ingredients}
		ondone={(id) => goto(id ? resolve('/recipes/[id]', { id }) : resolve('/recipes'))}
	/>
{/if}
