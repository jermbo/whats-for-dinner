<script>
	/**
	 * One preference as a row of a ruled list: its name at the left, and its control at the right.
	 * The control has the name for a screen reader, so the text of the row is hidden from it.
	 * "group": the row has more than one control, such as a chip for each meal type. Then the
	 * name of the row is the name of the group.
	 * @type {{ label: string, group?: boolean, children: import('svelte').Snippet }}
	 */
	let { label, group = false, children } = $props();
</script>

<li class="preference">
	<div
		class="preference__row"
		role={group ? 'group' : undefined}
		aria-label={group ? label : undefined}
	>
		<span class="preference__label" aria-hidden="true">{label}</span>
		<div class="preference__control">{@render children()}</div>
	</div>
</li>

<style>
	.preference {
		border-block-end: var(--rule-1) solid var(--hairline);
	}

	/* A row is as high as one control. The controls of a group go below a long name. */
	.preference__row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0 var(--space-3);
		min-block-size: var(--tap);
		padding-block: var(--space-1);
	}

	.preference__label {
		font-weight: 700;
	}

	.preference__control {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}
</style>
