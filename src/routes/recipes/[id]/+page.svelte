<script>
	import { page } from '$app/state';
	import RecipeDetail from '$lib/components/recipes/RecipeDetail.svelte';

	const id = $derived(page.params.id ?? '');
</script>

<!-- A new key gives a new component, and thus new queries, for each recipe. -->
{#key id}
	<RecipeDetail {id} />
{/key}
