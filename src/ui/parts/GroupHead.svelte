<script lang="ts">
	let { title, note = '' }: { title: string; note?: string } = $props();
</script>

<div class="wfd-group">
	<h3 class="wfd-group__title wfd-display">{title}</h3>
	{#if note}<span class="wfd-group__note">{note}</span>{/if}
</div>

<style>
	.wfd-group {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: baseline;
		justify-content: space-between;
		margin-block-start: var(--wfd-space-stack);
		padding-block-end: var(--wfd-space-tight);
		border-block-end: var(--wfd-border) solid var(--wfd-color-border);
	}

	.wfd-group__title {
		margin: 0;
		color: var(--wfd-color-text);
		font-size: var(--wfd-font-size-title);
	}

	.wfd-group__note {
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
		font-weight: 700;
	}
</style>
