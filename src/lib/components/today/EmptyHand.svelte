<script>
	import { resolve } from '$app/paths';
	import { WEEK_MEALS } from '$lib/domain/week';

	/**
	 * The place of the cards when the hand is empty: a dashed card of the same size, so that the
	 * screen does not jump when the first meal comes. A line tells which food to use first.
	 * @type {{ soon?: string[] }}
	 */
	let { soon = [] } = $props();

	const line = $derived(
		soon.length > 0 ? `${soon.slice(0, 2).join(' and ')} need using first.` : 'Choose what to cook.'
	);
</script>

<div class="empty-hand">
	<div class="empty-slot empty-hand__slot">
		<h2 class="empty-slot__name">Deal {WEEK_MEALS} meals for the week.</h2>
		<p class="empty-hand__line">{line}</p>
		<a class="button button--strong button--wide" href={resolve('/menu')}>Build the menu</a>
	</div>
	<!-- Two more places show the rest of the hand. A phone shows only the first. -->
	<div class="empty-slot empty-hand__ghost" aria-hidden="true"></div>
	<div class="empty-slot empty-hand__ghost empty-hand__ghost--small" aria-hidden="true"></div>
</div>

<style>
	.empty-hand {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.empty-hand__slot {
		flex: none;
		inline-size: min(100%, 20rem);
		min-block-size: 24rem;
	}

	.empty-hand__line {
		font-size: 0.9375rem;
		font-weight: 600;
	}

	.empty-hand__ghost {
		display: none;
		flex: none;
		inline-size: 8.5rem;
		block-size: 16rem;
		border-color: var(--hairline);
	}

	.empty-hand__ghost--small {
		inline-size: 5.5rem;
		block-size: 10rem;
	}

	@container main (min-width: 38rem) {
		.empty-hand__ghost {
			display: block;
		}
	}
</style>
