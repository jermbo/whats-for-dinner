<script>
	import Icon from '$lib/components/ui/Icon.svelte';

	/**
	 * The two buttons of Cook mode. They are large and in reach of the thumb. The wide one is
	 * "Next", or "Cooked" on the last card.
	 * @type {{
	 *   first: boolean,
	 *   last: boolean,
	 *   finishing: boolean,
	 *   onback: () => void,
	 *   onnext: () => void,
	 *   onfinish: () => void
	 * }}
	 *   first, last: the card on the screen is the first or the last one. finishing: true
	 *   after "Cooked", until the next page opens.
	 */
	let { first, last, finishing, onback, onnext, onfinish } = $props();
</script>

<footer class="cook-foot">
	<button class="button cook-foot__step" type="button" disabled={first} onclick={onback}>
		<Icon name="back" />
		Back
	</button>
	{#if last}
		<button
			class="button button--strong cook-foot__step cook-foot__step--main"
			type="button"
			disabled={finishing}
			onclick={onfinish}
		>
			<Icon name="check" />
			Cooked
		</button>
	{:else}
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
