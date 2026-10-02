<script>
	import { onMount } from 'svelte';
	import { version } from '$app/environment';

	/** @type {boolean | null} */
	let persistent = $state(null);
	let offlineReady = $state(false);
	let online = $state(true);

	onMount(async () => {
		online = navigator.onLine;
		navigator.serviceWorker?.ready.then(() => (offlineReady = true));
		persistent = (await navigator.storage?.persisted?.()) ?? false;
	});

	/** @param {boolean | null} value */
	const yesNo = (value) => (value === null ? '…' : value ? 'Yes' : 'No');
</script>

<svelte:window ononline={() => (online = true)} onoffline={() => (online = false)} />

<section class="stack stack--tight" aria-labelledby="status-title">
	<h2 id="status-title">Status</h2>

	<dl class="status-panel">
		<dt>Connection</dt>
		<dd>{online ? 'Online' : 'Offline'}</dd>

		<dt>Ready for offline use</dt>
		<dd>{yesNo(offlineReady)}</dd>

		<dt>Storage is persistent</dt>
		<dd>{yesNo(persistent)}</dd>

		<dt>Version</dt>
		<dd>{version}</dd>
	</dl>
</section>

<style>
	.status-panel {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--space-1) var(--space-4);
		margin: 0;

		& dt {
			font-weight: 600;
		}

		& dd {
			margin: 0;
		}
	}
</style>
