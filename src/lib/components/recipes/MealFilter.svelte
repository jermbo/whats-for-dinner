<script>
	import SelectChip from '$lib/components/ui/SelectChip.svelte';
	import { MEAL_FILTERS } from '$lib/domain/options';

	/** @type {{ value: string }} */
	let { value = $bindable('all') } = $props();
</script>

<SelectChip label="Meal type" options={MEAL_FILTERS} bind:value active={value !== 'all'} />
