<script>
	import { resolve } from '$app/paths';
	import Icon from '$lib/components/ui/Icon.svelte';
	import SegmentedControl from '$lib/components/ui/SegmentedControl.svelte';
	import { PANTRY_VIEWS } from '$lib/domain/pantry-view';

	/**
	 * The controls of the pantry: the view, the add button, the search, and the scan.
	 * @type {{
	 *   view: import('$lib/domain/pantry-view').PantryView,
	 *   search: string,
	 *   onadd: () => void
	 * }}
	 */
	let { view = $bindable(), search = $bindable(), onadd } = $props();

	const uid = $props.id();
</script>

<div class="pantry-tools wide">
	<div class="pantry-tools__row">
		<div class="pantry-tools__grow">
			<SegmentedControl legend="Sequence" hideLegend options={PANTRY_VIEWS} bind:value={view} />
		</div>
		<button class="button button--strong button--round" type="button" onclick={onadd}>
			<Icon name="plus" />
			<span class="visually-hidden">Add an item by hand</span>
		</button>
	</div>

	<div class="pantry-tools__row">
		<div class="field pantry-tools__grow">
			<label class="visually-hidden" for="{uid}-search">Do I have this?</label>
			<input
				class="field__control"
				id="{uid}-search"
				type="search"
				placeholder="Do I have this?"
				autocomplete="off"
				bind:value={search}
			/>
		</div>
		<a class="button button--round" href={resolve('/pantry/scan')}>
			<Icon name="scan" />
			<span class="visually-hidden">Scan a barcode</span>
		</a>
	</div>
</div>

<style>
	/* A phone has two rows. A wide main area has the two rows side by side. */
	.pantry-tools {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2) var(--space-4);
	}

	.pantry-tools__row {
		display: flex;
		flex: 1 1 18rem;
		align-items: center;
		gap: var(--space-2);
	}

	.pantry-tools__grow {
		flex: 1;
		min-inline-size: 0;
	}

	/* The square buttons are as high as the field and the view control. */
	.pantry-tools__row :global(.button--round) {
		flex: none;
		inline-size: var(--button-height);
		min-block-size: var(--button-height);
	}
</style>
