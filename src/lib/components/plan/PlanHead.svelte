<script>
	import Icon from '$lib/components/ui/Icon.svelte';
	import { PLAN_STEPS } from '$lib/domain/menu-plan';

	/**
	 * The top of one step of the Menu flow: the way back, "Step 2 of 4", one segment for each
	 * step, and the large title with one sentence below it.
	 * @type {{
	 *   title: string,
	 *   step: import('$lib/domain/menu-plan').PlanStep,
	 *   sub?: string,
	 *   back?: string,
	 *   onback?: () => void,
	 *   aside?: import('svelte').Snippet
	 * }}
	 *   back: the name of the step before, for the way back. aside: a small block at the right
	 *   of the title, such as the count of the places.
	 */
	let { title, step, sub, back, onback, aside } = $props();

	const number = $derived(PLAN_STEPS.findIndex((entry) => entry.value === step) + 1);
</script>

<svelte:head>
	<title>{title} · Larder</title>
</svelte:head>

<header class="plan-head">
	<div class="plan-head__top">
		{#if back && onback}
			<button class="plan-head__back" type="button" onclick={onback}>
				<Icon name="back" />
				{back}
			</button>
		{/if}
		<p class="label plan-head__step">Step {number} of {PLAN_STEPS.length}</p>
	</div>

	<div class="plan-head__marks" aria-hidden="true">
		{#each PLAN_STEPS as entry, at (entry.value)}
			<span class={['plan-head__mark', at < number && 'plan-head__mark--done']}></span>
		{/each}
	</div>

	<div class="plan-head__line">
		<h1 class="plan-head__title">{title}.</h1>
		{@render aside?.()}
	</div>

	{#if sub}
		<p class="plan-head__sub">{sub}</p>
	{/if}
</header>

<style>
	.plan-head {
		display: grid;
		gap: var(--space-2);
	}

	.plan-head__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		min-block-size: var(--tap);
	}

	.plan-head__back {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		min-block-size: var(--tap);
		padding: 0;
		font-size: 1.0625rem;
		font-weight: 800;
		background: none;
		border: 0;
		cursor: pointer;

		& :global(.icon) {
			transition: translate 0.25s var(--ease-out);
		}

		&:active :global(.icon) {
			translate: -0.25rem 0;
		}
	}

	.plan-head__step {
		margin-inline-start: auto;
	}

	.plan-head__marks {
		display: flex;
		gap: var(--space-2);
	}

	/* One segment for each step. The steps to this one are ink. */
	.plan-head__mark {
		flex: 1;
		block-size: var(--rule-8);
		background: var(--paper-deep);
		transition: background-color 0.35s;
	}

	.plan-head__mark--done {
		background: var(--ink);
	}

	.plan-head__line {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: var(--space-3);
		margin-block-start: var(--space-2);
	}

	/* A title of two words: smaller than the title of a screen, so that it is one line. */
	.plan-head__title {
		font-size: clamp(2.75rem, 15cqi, 4.5rem);
		animation: rise 0.4s var(--ease-out) backwards;
	}

	.plan-head__sub {
		font-size: 1.0625rem;
		font-weight: 600;
		line-height: 1.3;
	}
</style>
