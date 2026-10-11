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
		gap: 12px;
		align-items: baseline;
		justify-content: space-between;
		margin-block-start: 12px;
		padding-block-end: 6px;
		border-block-end: var(--wfd-rule-4) solid var(--wfd-ink);
	}

	.wfd-group__title {
		margin: 0;
		color: var(--wfd-ink);
		font-size: 22px;
	}

	.wfd-group__note {
		color: var(--wfd-ink-2);
		font-size: 14px;
		font-weight: 700;
	}
</style>
