<script>
	/**
	 * The title of a screen: a small date line, a large Anton title, a short sentence, and the
	 * actions. A heavy rule is under the title.
	 * @type {{
	 *   title: string,
	 *   heading?: string,
	 *   eyebrow?: string,
	 *   subline?: string,
	 *   aside?: import('svelte').Snippet,
	 *   children?: import('svelte').Snippet
	 * }}
	 *   aside: a small block at the right of the date line, such as the count of a hand.
	 */
	let { title, heading = title, eyebrow, subline, aside, children } = $props();
</script>

<svelte:head>
	<title>{title} · Larder</title>
</svelte:head>

<header class="page-header wide">
	<div class={['page-header__text', aside && 'page-header__text--aside']}>
		{#if eyebrow || aside}
			<div class="page-header__top">
				<p class="page-header__eyebrow" aria-live="polite">{eyebrow}</p>
				{@render aside?.()}
			</div>
		{/if}
		<h1 class={['page-header__title', heading.length > 12 && 'page-header__title--long']}>
			{heading}.
		</h1>
	</div>

	{#if subline}
		<p class="page-header__subline">{subline}</p>
	{/if}

	{#if children}
		<div class="page-header__actions">{@render children()}</div>
	{/if}
</header>

<style>
	.page-header {
		display: flex;
		flex-wrap: wrap;
		align-items: end;
		justify-content: space-between;
		gap: var(--space-2) var(--space-4);
		padding-block-end: var(--space-3);
		border-block-end: var(--rule-4) solid var(--ink);
	}

	.page-header__text {
		min-inline-size: 0;
	}

	.page-header__top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-3);
		margin-block-end: var(--space-1);
	}

	/* With an aside, the text has the full width: the aside is at the right of the date. */
	.page-header__text--aside {
		flex: 1 1 100%;
	}

	.page-header__eyebrow {
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.page-header__title {
		/* The title is one word or two: a long word must not make the screen scroll sideways. */
		overflow-wrap: anywhere;
	}

	/* A name of a recipe is longer than one word: a smaller title, so that it fits. */
	.page-header__title--long {
		font-size: clamp(2rem, 11.5cqi, 3.5rem);
	}

	.page-header__subline {
		flex-basis: 100%;
		font-size: 1.0625rem;
		font-weight: 600;
		line-height: 1.3;
	}

	/* The actions are at the right edge, away from the title. */
	.page-header__actions {
		display: flex;
		margin-inline-start: auto;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	/* A wide hand hides its aside: then the sentence is at the right of the title. */
	@container hand (min-width: 36rem) {
		.page-header__text--aside {
			flex: 0 1 auto;
		}
	}

	/* A wide main area: the sentence is at the right of the title. */
	@container main (min-width: 38rem) {
		.page-header__subline {
			flex-basis: auto;
			max-inline-size: 18rem;
			text-align: end;
		}
	}
</style>
