<script>
	import { page } from '$app/state';
	import CookMode from '$lib/components/cook/CookMode.svelte';
	import { useCookSession } from '$lib/state/cook-session.svelte';

	const id = $derived(page.params.id ?? '');
	const cook = useCookSession(() => id);
</script>

<!-- A new key gives a new component, and thus a new place in the cards, for each cook session. -->
{#key id}
	<CookMode {id} session={cook.session} recipe={cook.recipe} cooks={cook.cooks} />
{/key}
