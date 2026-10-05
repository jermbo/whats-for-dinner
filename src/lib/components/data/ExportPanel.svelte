<script>
	import { exportAll, exportRecipes } from '$lib/data/backup';
	import { download } from '$lib/data/backup-file';
	import { formatDateTime } from '$lib/util/format';

	/** @type {{ lastBackup: string }} The time of the last full backup, or '' for none. */
	let { lastBackup } = $props();

	const uid = $props.id();
</script>

<section class="stack" aria-labelledby="{uid}-title">
	<h2 id="{uid}-title">Export</h2>

	<p>
		This device has the only copy of the data.
		{#if lastBackup}
			Last full backup: {formatDateTime(lastBackup)}.
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
