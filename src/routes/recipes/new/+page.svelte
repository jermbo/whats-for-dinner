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

<RecipeForm
	recipe={blankRecipe()}
	ingredients={ingredients.current}
	onsave={(recipe) => goto(resolve('/recipes/[id]', { id: recipe.id }))}
/>
