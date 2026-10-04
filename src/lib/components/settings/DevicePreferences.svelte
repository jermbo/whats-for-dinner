<script>
	import ToggleChip from '$lib/components/ui/ToggleChip.svelte';

	/**
	 * @typedef {import('$lib/domain/preferences').Preferences} Preferences
	 * @typedef {'timerSound' | 'vibration' | 'screenOn' | 'lessMotion'} SwitchKey
	 */

	/**
	 * The device preferences: how this one device behaves. They stay on the device, and a backup
	 * does not have them. See docs/settings/device-preferences.md.
	 * @type {{
	 *   values: Preferences,
	 *   onchange: (key: SwitchKey, value: boolean) => void,
	 *   onhints: () => void
	 * }}
	 */
	let { values, onchange, onhints } = $props();

	const uid = $props.id();

	/** @type {{ key: SwitchKey, label: string }[]} */
	const switches = [
		{ key: 'timerSound', label: 'Timer sound' },
		{ key: 'vibration', label: 'Vibration' },
		{ key: 'screenOn', label: 'Screen stays on in Cook mode' },
		{ key: 'lessMotion', label: 'Less motion' }
	];
</script>

<section class="stack stack--tight" aria-labelledby="{uid}-title">
	<h2 class="section-title" id="{uid}-title">This device</h2>

	<div class="cluster">
		{#each switches as { key, label } (key)}
			<ToggleChip {label} bind:checked={() => values[key], (value) => onchange(key, value)} />
		{/each}
	</div>

	<div>
		<button class="button" type="button" onclick={onhints}>Show the hints again</button>
	</div>
</section>
