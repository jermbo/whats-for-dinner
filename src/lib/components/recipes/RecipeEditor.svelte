<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { deleteRecipe } from '$lib/data/recipes';
	import { db } from '$lib/db/db';
	import { live } from '$lib/live.svelte';
	import { status } from '$lib/status.svelte';
	import RecipeForm from './RecipeForm.svelte';

	/** @type {{ id: string }} */
	let { id } = $props();

	const recipe = live(() => db.recipes.get(id), undefined);
	const ingredients = live(() => db.ingredients.toArray(), []);

	async function remove() {
		if (!confirm('Delete this recipe? The cook history stays.')) return;
		await deleteRecipe(id);
		status.say('The recipe is deleted.');
		goto(resolve('/recipes'));
	}
</script>

<PageHeader title="Edit recipe" />

{#if recipe.current}
	<RecipeForm
		recipe={recipe.current}
		ingredients={ingredients.current}
		onsave={() => goto(resolve('/recipes/[id]', { id }))}
	/>

	<button class="button button--danger" type="button" onclick={remove}>Delete recipe</button>
{:else}
	<p class="muted">This recipe is not on this device.</p>
{/if}
