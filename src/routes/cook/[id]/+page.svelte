<script>
	import { page } from '$app/state';
	import CookMode from '$lib/components/cook/CookMode.svelte';

	const id = $derived(page.params.id ?? '');
</script>

<!-- A new key gives a new component, and thus new queries, for each cook session. -->
{#key id}
	<CookMode {id} />
{/key}
