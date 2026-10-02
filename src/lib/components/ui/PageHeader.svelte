<script>
	/** @type {{ title: string, children?: import('svelte').Snippet }} */
	let { title, children } = $props();
</script>

<svelte:head>
	<title>{title} · Meal Planner</title>
</svelte:head>

<header class="page-header">
	<h1 class="page-header__title">{title}</h1>
	{#if children}
		<div class="page-header__actions">{@render children()}</div>
	{/if}
</header>

<style>
	.page-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
	}

	.page-header__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}
</style>
