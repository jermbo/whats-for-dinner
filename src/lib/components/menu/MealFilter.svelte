<script>
	import SegmentedControl from '$lib/components/ui/SegmentedControl.svelte';
	import { MEAL_FILTERS } from '$lib/data/options';

	/** @type {{ value: string }} */
	let { value = $bindable('all') } = $props();
</script>

<SegmentedControl legend="Meal type" hideLegend options={MEAL_FILTERS} bind:value />
