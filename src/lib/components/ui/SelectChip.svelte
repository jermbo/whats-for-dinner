<script>
	/**
	 * A select that looks like a pill, for one filter with a few values. It uses the height of
	 * one button. The label is for screen readers: the selected value is the text in view.
	 * "active" gives the dark fill: use it when the filter hides something.
	 * @type {{
	 *   label: string,
	 *   options: { value: string, label: string }[],
	 *   value?: string,
	 *   active?: boolean
	 * }}
	 */
	let { label, options, value = $bindable(''), active = false } = $props();

	const uid = $props.id();
</script>

<span class={['select-chip', active && 'select-chip--active']}>
	<label class="visually-hidden" for={uid}>{label}</label>
	<select class="select-chip__control" id={uid} bind:value>
		{#each options as option (option.value)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</span>

<style>
	.select-chip {
		position: relative;
		display: inline-grid;
		color: var(--color-muted);

		/* The arrow of the select. */
		&::after {
			position: absolute;
			inset-block-start: 50%;
			inset-inline-end: var(--space-4);
			inline-size: 0.5rem;
			block-size: 0.5rem;
			content: '';
			border: solid currentColor;
			border-width: 0 2px 2px 0;
			pointer-events: none;
			rotate: 45deg;
			translate: 0 -70%;
		}

		&.select-chip--active {
			color: var(--color-on-accent);
		}
	}

	.select-chip__control {
		min-block-size: var(--tap);
		padding: var(--space-2) 2.5rem var(--space-2) var(--space-4);
		font-weight: 500;
		background: var(--color-surface);
		border: 0;
		border-radius: var(--radius-pill);
		box-shadow: var(--shadow);
		appearance: none;
		cursor: pointer;
	}

	.select-chip--active .select-chip__control {
		font-weight: 600;
		background: var(--color-accent-strong);
	}
</style>
