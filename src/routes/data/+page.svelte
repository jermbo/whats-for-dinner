<script>
	import ExportPanel from '$lib/components/data/ExportPanel.svelte';
	import ImportPanel from '$lib/components/data/ImportPanel.svelte';
	import StatusPanel from '$lib/components/data/StatusPanel.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
</script>

<PageHeader title="Data" />

<ExportPanel />
<ImportPanel />
<StatusPanel />
