<script>
	/**
	 * The preparation rows of the recipe form, for example "Move the chicken to the refrigerator".
	 * @type {{ steps: import('$lib/types').PrepStep[] }}
	 */
	let { steps = $bindable() } = $props();

	const uid = $props.id();
</script>

<fieldset class="fieldset">
	<legend class="fieldset__legend">Preparation before the cook day</legend>

	<div class="stack stack--tight">
		<p class="muted">
			Example: "Move the chicken from the freezer to the refrigerator", 24 hours before.
		</p>

		{#each steps as step, index (index)}
			<div class="prep-row">
				<div class="field prep-row__text">
					<label class="field__label" for="{uid}-text-{index}">Step {index + 1}</label>
					<input class="field__control" id="{uid}-text-{index}" bind:value={step.text} />
				</div>

				<div class="field prep-row__lead">
					<label class="field__label" for="{uid}-lead-{index}">Hours before</label>
					<input
						class="field__control"
						id="{uid}-lead-{index}"
						type="number"
						inputmode="decimal"
						min="0"
						step="any"
						bind:value={step.leadHours}
					/>
				</div>

				<button
					class="button"
					type="button"
					aria-label="Remove preparation step {index + 1}"
					onclick={() => steps.splice(index, 1)}
				>
					Remove
				</button>
			</div>
		{/each}

		<div>
			<button class="button" type="button" onclick={() => steps.push({ text: '', leadHours: 24 })}>
				Add preparation step
			</button>
		</div>
	</div>
</fieldset>

<style>
	.prep-row {
		display: grid;
		grid-template-columns: 1fr 7rem auto;
		align-items: end;
		gap: var(--space-2);
	}

	.prep-row__text {
		grid-column: 1 / -1;

		@media (min-width: 34rem) {
			grid-column: auto;
		}
	}
</style>
