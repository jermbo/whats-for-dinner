<script>
	import { page } from '$app/state';
	import CookSessionPanel from '$lib/components/sessions/CookSessionPanel.svelte';

	const id = $derived(page.params.id ?? '');
</script>

{#key id}
	<CookSessionPanel {id} />
{/key}
