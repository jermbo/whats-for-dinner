<script>
	import Icon from '$lib/components/ui/Icon.svelte';

	/**
	 * How many ingredients of a recipe the pantry has, as "7/9". A full count is teal.
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

	/* On a photo: the dark label of the card. A full count is teal. */
	.pantry-count.pantry-count--photo {
		color: #ffffff;
		background: rgb(0 0 0 / 0.6);
		backdrop-filter: blur(6px);

		&:global(.badge--good) {
			background: var(--color-accent-strong);
		}
	}
</style>
