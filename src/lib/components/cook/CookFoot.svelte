<script>
	import Icon from '$lib/components/ui/Icon.svelte';

	/**
	 * The two buttons of Cook mode. They are large and in reach of the thumb. The wide one is
	 * "Next". The last card has its own "Cooked" button, so it gets only "Back".
	 * @type {{ first: boolean, last: boolean, onback: () => void, onnext: () => void }}
	 *   first, last: the card on the screen is the first or the last one.
	 */
	let { first, last, onback, onnext } = $props();
</script>

<footer class="cook-foot">
	<button class="button cook-foot__step" type="button" disabled={first} onclick={onback}>
		<Icon name="back" />
		Back
	</button>
	{#if !last}
		<button
			class="button button--primary cook-foot__step cook-foot__step--main"
			type="button"
			onclick={onnext}
		>
			Next
			<Icon name="next" />
		</button>
	{/if}
</footer>

<style>
	.cook-foot {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: var(--space-3);
		padding: var(--space-3) var(--space-5) max(var(--space-4), env(safe-area-inset-bottom));
		border-block-start: var(--rule-4) solid var(--ink);
	}

	.cook-foot__step {
		gap: var(--space-2);
		min-block-size: 3.75rem;
		font-size: 1.1rem;
	}

	.cook-foot__step--main {
		font-size: 1.2rem;
	}
</style>
