<script lang="ts">
	type Props = { have: number; of: number; label?: string };
	let { have, of, label }: Props = $props();
</script>

<!-- A count in two shades: you read the first number first, and the second number is the limit. -->
<span class="wfd-count">
	<span class="wfd-count__numbers wfd-display" aria-label="{have} of {of}">
		{have}<span class="wfd-count__of">/{of}</span>
	</span>
	{#if label}<span class="wfd-count__label wfd-label">{label}</span>{/if}
</span>

<style>
	.wfd-count {
		display: inline-flex;
		gap: 6px;
		align-items: baseline;
		white-space: nowrap;
	}

	.wfd-count__numbers {
		font-size: var(--wfd-count-size, 26px);
	}

	.wfd-count__of {
		color: var(--wfd-ink-3);
	}
</style>
