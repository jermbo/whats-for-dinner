<script>
	import { page } from '$app/state';
	import CookSessionPanel from '$lib/components/sessions/CookSessionPanel.svelte';
	import { useCookSession } from '$lib/state/cook-session.svelte';

	const id = $derived(page.params.id ?? '');
	const cook = useCookSession(() => id);
</script>

<!-- A new key gives a new component for each cook session. -->
{#key id}
	<CookSessionPanel {id} session={cook.session} recipe={cook.recipe} />
{/key}
