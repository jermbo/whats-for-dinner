<script>
	import { resolve } from '$app/paths';
	import DevicePreferences from '$lib/components/settings/DevicePreferences.svelte';
	import PlanningPreferences from '$lib/components/settings/PlanningPreferences.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { showHintsAgain } from '$lib/data/hints';
	import { resetPreference, setPreference } from '$lib/data/preferences';
	import { usePreferences } from '$lib/state/preferences.svelte';
	import { status } from '$lib/state/status.svelte';

	const preferences = usePreferences();

	async function hints() {
		await showHintsAgain();
		status.say('Each hint shows one more time.');
	}
</script>

<PageHeader title="Settings">
	<a class="button" href={resolve('/settings/ingredients')}>Ingredients</a>
	<a class="button" href={resolve('/settings/data')}>Data</a>
</PageHeader>

<!-- A control shows its new value itself, so a change of a preference gives no message. -->
<div class="grid">
	<PlanningPreferences
		values={preferences.values}
		onchange={setPreference}
		onreset={resetPreference}
	/>
	<DevicePreferences values={preferences.values} onchange={setPreference} onhints={hints} />
</div>
