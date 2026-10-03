<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import RecipeForm from '$lib/components/recipes/RecipeForm.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { blankRecipe } from '$lib/data/recipes';
	import { db } from '$lib/db/db';
	import { live } from '$lib/live.svelte';

	const ingredients = live(() => db.ingredients.toArray(), []);
</script>

<PageHeader title="New recipe" />

<!-- A form with no text made no recipe: "Done" then goes back to the list. -->
<RecipeForm
	recipe={blankRecipe()}
	ingredients={ingredients.current}
	ondone={(id) => goto(id ? resolve('/recipes/[id]', { id }) : resolve('/recipes'))}
/>
