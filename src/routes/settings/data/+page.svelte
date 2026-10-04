<script>
	import { resolve } from '$app/paths';
	import ExportPanel from '$lib/components/data/ExportPanel.svelte';
	import ImportPanel from '$lib/components/data/ImportPanel.svelte';
	import SampleDataPanel from '$lib/components/data/SampleDataPanel.svelte';
	import StatusPanel from '$lib/components/data/StatusPanel.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { lastBackupAt } from '$lib/data/backup';
	import { countSampleData } from '$lib/data/sample';
	import { live } from '$lib/state/live.svelte';

	const lastBackup = live(lastBackupAt, '');
	const sampleCount = live(countSampleData, 0);
</script>

<PageHeader title="Data">
	<a class="button" href={resolve('/settings')}>Settings</a>
</PageHeader>

<ExportPanel lastBackup={lastBackup.current} />
<ImportPanel />
<SampleDataPanel count={sampleCount.current} />
<StatusPanel />

<!-- A test for the QR code of a transfer between two devices. -->
<div>
	<a class="button" href={resolve('/settings/data/code-test')}>Code test</a>
</div>
