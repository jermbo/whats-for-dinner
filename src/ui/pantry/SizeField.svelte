<script lang="ts">
	import { parseAmount } from '../../recipemd/amount';
	import { UNITS } from '../../pantry/unit-list';
	import { sameUnit } from '../../units';
	import Chip from '../parts/Chip.svelte';
	import Field from '../parts/Field.svelte';

	// The size of a package: one number, and one unit that you select. "Count" is a plain count,
	// such as 12 eggs. No unit is typed, so a typo such as "1 gall" cannot get into the pantry.
	type Props = { value: string; onchange: (size: string) => void };
	let { value, onchange }: Props = $props();

	const uid = $props.id();
	const COUNT = 'Count';

	const first = () => parseAmount(value);
	let number = $state(first() ? String(first()?.factor) : '');
	let unit = $state(UNITS.find((one) => sameUnit(one, first()?.unit ?? null)) ?? COUNT);

	// A whole number or a decimal, such as 1 or 3.5. Nothing else is a size.
	const isNumber = (text: string) => /^\d+([.,]\d+)?$/.test(text.trim());

	function tell() {
		const typed = number.trim().replace(',', '.');
		onchange(isNumber(typed) ? (unit === COUNT ? typed : `${typed} ${unit}`) : '');
	}
</script>

<fieldset class="wfd-size">
	<legend class="wfd-label">Package size</legend>
	<div class="wfd-size__number">
		<Field kind="number">
			<input
				id="{uid}-number"
				type="text"
				inputmode="decimal"
				placeholder="1"
				aria-label="Number of the package size"
				bind:value={number}
				oninput={tell}
			/>
		</Field>
	</div>
	<div class="wfd-size__units" role="group" aria-label="Unit">
		{#each [COUNT, ...UNITS] as option (option)}
			<Chip label={option} on={unit === option} onclick={() => ((unit = option), tell())} />
		{/each}
	</div>
</fieldset>

<style>
	.wfd-size {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-group);
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
		color: var(--wfd-color-text-muted);
	}

	.wfd-size__number {
		inline-size: min(100%, 8rem);
	}

	/* The chips wrap, so that each one stays inside the form. */
	.wfd-size__units {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--wfd-space-group);
	}
</style>
