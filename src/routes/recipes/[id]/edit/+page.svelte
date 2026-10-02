<script>
	import { page } from '$app/state';
	import RecipeEditor from '$lib/components/recipes/RecipeEditor.svelte';

	const id = $derived(page.params.id ?? '');
</script>

{#key id}
	<RecipeEditor {id} />
{/key}
