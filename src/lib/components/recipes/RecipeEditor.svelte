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

	/** @type {RecipeForm | undefined} */
	let form = $state();

	async function remove() {
		if (!confirm('Delete this recipe and its step photos? The cook history stays.')) return;
		// A change that waits must not save the recipe again after it is deleted.
		form?.discard();
		await deleteRecipe(id);
		status.say('The recipe is deleted.');
		goto(resolve('/recipes'));
	}
</script>

{#if recipe.current}
	<RecipeForm
		bind:this={form}
		title="Edit recipe"
		recipe={recipe.current}
		ingredients={ingredients.current}
		ondone={() => goto(resolve('/recipes/[id]', { id }))}
		onremove={remove}
	/>
{:else}
	<PageHeader title="Edit recipe" />
	<p class="muted">This recipe is not on this device.</p>
{/if}
