<script>
	import Icon from '$lib/components/ui/Icon.svelte';

	/**
	 * How many ingredients of a recipe the pantry has, as "7/9". A full count is olive.
	 * A reference recipe has no ingredients, so it shows no count.
	 * "onPhoto" gives the dark label that lies on a photo.
	 * @type {{ have: number, need: number, onPhoto?: boolean }}
	 */
	let { have, need, onPhoto = false } = $props();
</script>

{#if need > 0}
	<span
		class={[
			'badge',
			'pantry-count',
			have === need && 'badge--good',
			onPhoto && 'pantry-count--photo'
		]}
	>
		<Icon name="pantry" />
		<span aria-hidden="true">{have}/{need}</span>
		<span class="visually-hidden">The pantry has {have} of {need} ingredients.</span>
	</span>
{/if}

<style>
	.pantry-count {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;

		& :global(.icon) {
			flex: none;
			inline-size: 1rem;
			block-size: 1rem;
		}
	}

	/* On a photo: the ink label of the card. A full count is olive. */
	.pantry-count.pantry-count--photo {
		color: var(--paper);
		background: var(--ink);
		border-color: var(--ink);

		&:global(.badge--good) {
			color: var(--ink);
			background: var(--olive);
			border-color: var(--olive);
		}
	}
</style>
