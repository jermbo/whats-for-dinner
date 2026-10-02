<script>
	/**
	 * The title of a screen, with its actions.
	 * @type {{
	 *   title: string,
	 *   heading?: string,
	 *   eyebrow?: string,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let { title, heading = title, eyebrow, children } = $props();
</script>

<svelte:head>
	<title>{title} · Meal Planner</title>
</svelte:head>

<header class="page-header">
	<div class="page-header__text">
		{#if eyebrow}
			<p class="page-header__eyebrow">{eyebrow}</p>
		{/if}
		<h1 class="page-header__title">{heading}</h1>
	</div>

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
		gap: var(--space-3);
	}

	.page-header__eyebrow {
		margin-block-end: var(--space-1);
		color: var(--color-muted);
	}

	.page-header__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}
</style>
