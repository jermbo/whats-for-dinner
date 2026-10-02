<script>
	import { isUrl } from '$lib/util/format';

	/**
	 * Where the recipe came from: a link for a URL, or text for a book and a page.
	 * @type {{ source: string }}
	 */
	let { source } = $props();
</script>

{#if source}
	<p>
		<span class="muted">Source:</span>
		{#if isUrl(source)}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- an external URL -->
			<a href={source} target="_blank" rel="noreferrer external">{source}</a>
		{:else}
			{source}
		{/if}
	</p>
{/if}
