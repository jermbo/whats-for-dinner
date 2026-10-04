<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import RecipeForm from '$lib/components/recipes/RecipeForm.svelte';
	import { blankRecipe } from '$lib/domain/recipes';
	import { useKitchen } from '$lib/state/kitchen.svelte';

	const kitchen = useKitchen();
</script>

<!-- A form with no text made no recipe: "Done" then goes back to the list. -->
<RecipeForm
	title="New recipe"
	recipe={blankRecipe()}
	ingredients={kitchen.ingredients}
	ondone={(id) => goto(id ? resolve('/recipes/[id]', { id }) : resolve('/recipes'))}
/>
