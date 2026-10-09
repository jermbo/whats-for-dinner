<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import RecipeForm from '$lib/components/recipes/RecipeForm.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { deleteRecipe } from '$lib/data/recipes';
	import { useKitchen } from '$lib/state/kitchen.svelte';
	import { status } from '$lib/state/status.svelte';

	const kitchen = useKitchen();

	const id = $derived(page.params.id ?? '');
	const recipe = $derived(kitchen.recipesById.get(id));

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

<!-- A new key gives a new form, and thus a new copy of the text, for each recipe. -->
{#key id}
	{#if recipe}
		<RecipeForm
			bind:this={form}
			title="Edit recipe"
			{recipe}
			ingredients={kitchen.ingredients}
			ondone={() => goto(resolve('/recipes/[id]', { id }))}
			onremove={remove}
		/>
	{:else}
		<PageHeader title="Edit recipe" />
		<p class="muted">This recipe is not on this device.</p>
	{/if}
{/key}
