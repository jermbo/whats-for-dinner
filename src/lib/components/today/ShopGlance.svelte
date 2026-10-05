<script>
	import { resolve } from '$app/paths';

	/** The most names that the sentence shows. */
	const NAMES = 5;

	/**
	 * What the owner must buy, as one sentence: the first names and the number of the others.
	 * @type {{ names: string[] }}
	 */
	let { names } = $props();

	const uid = $props.id();

	const sentence = $derived.by(() => {
		const first = names.slice(0, NAMES - 1);
		const rest = names.length - first.length;
		if (rest <= 0) return first.join(', ');
		return `${first.join(', ')} and ${rest} more`;
	});
</script>

<section class="glance" aria-labelledby="{uid}-title">
	<div class="glance__head">
		<h2 id="{uid}-title">Shop</h2>
		<p class="count">{names.length}</p>
	</div>

	<p class="glance__text">
		{names.length > 0 ? `${sentence}.` : 'The pantry has all ingredients for the menu.'}
	</p>

	<a class="button button--wide" href={resolve('/shop')}>Open the list</a>
</section>

<style>
	.glance {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.glance__head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding-block-end: var(--space-1);
		border-block-end: var(--rule-4) solid var(--ink);
	}

	.glance__text {
		font-size: 0.9375rem;
	}
</style>
