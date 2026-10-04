<script>
	import ExportPanel from '$lib/components/data/ExportPanel.svelte';
	import ImportPanel from '$lib/components/data/ImportPanel.svelte';
	import StatusPanel from '$lib/components/data/StatusPanel.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { lastBackupAt } from '$lib/data/backup';
	import { live } from '$lib/state/live.svelte';

	const lastBackup = live(lastBackupAt, '');
</script>

<PageHeader title="Data" />

<ExportPanel lastBackup={lastBackup.current} />
<ImportPanel />
<StatusPanel />
