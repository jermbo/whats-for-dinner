<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import RecipeDetail from '$lib/components/recipes/RecipeDetail.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { sessionsOfRecipe, startCook } from '$lib/data/cooking';
	import { addToMenu } from '$lib/data/menu';
	import { shareRecipe } from '$lib/data/share';
	import { useKitchen } from '$lib/state/kitchen.svelte';
	import { live } from '$lib/state/live.svelte';
	import { status } from '$lib/state/status.svelte';

	const kitchen = useKitchen();

	const id = $derived(page.params.id ?? '');
	const recipe = $derived(kitchen.recipesById.get(id));
	const sessions = live(
		() => sessionsOfRecipe(id),
		[],
		() => id
	);

	/** The recipe as a meal to cook on the menu. Leftovers are a different meal. */
	const item = $derived(
		kitchen.menu.find((entry) => entry.recipeId === id && entry.kind === 'recipe')
	);

	async function add() {
		await addToMenu(id);
		status.say('Added to the menu.');
	}

	async function cook() {
		if (!item) return;
		const sessionId = await startCook(item);
		goto(resolve('/cook/[id]', { id: sessionId }));
	}

	async function share() {
		if (!recipe) return;
		const result = await shareRecipe(recipe);
		if (result === 'downloaded') status.say('The recipe file is in the downloads.');
	}
</script>

{#if recipe}
	<RecipeDetail
		{recipe}
		sessions={sessions.current}
		{item}
		onadd={add}
		oncook={cook}
		onshare={share}
	/>
{:else}
	<PageHeader title="Recipe" />
	<p class="muted">This recipe is not on this device.</p>
{/if}
