<script>
	import { exportAll, exportRecipes } from '$lib/data/backup';
	import { download } from '$lib/data/backup-file';
	import { getMeta } from '$lib/db/meta';
	import { live } from '$lib/state/live.svelte';
	import { formatDateTime } from '$lib/util/format';

	const lastBackup = live(() => getMeta('lastBackupAt'), undefined);
</script>

<section class="stack" aria-labelledby="export-title">
	<h2 id="export-title">Export</h2>

	<p>
		This device has the only copy of the data.
		{#if typeof lastBackup.current === 'string'}
			Last full backup: {formatDateTime(lastBackup.current)}.
		{:else}
			There is no full backup yet.
		{/if}
	</p>

	<div class="cluster">
		<button
			class="button button--primary"
			type="button"
			onclick={async () => download(await exportAll())}
		>
			Export a full backup
		</button>
		<button class="button" type="button" onclick={async () => download(await exportRecipes())}>
			Export all recipes, with their photos
		</button>
	</div>
</section>
