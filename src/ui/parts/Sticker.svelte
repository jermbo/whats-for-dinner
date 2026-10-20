<script lang="ts">
	// tomato: use it first. amber: a level that is low. olive: done. outline: a fact, such as a
	// number of days. dashed: an empty place, such as food that the pantry does not have.
	type Props = { label: string; kind?: 'tomato' | 'amber' | 'olive' | 'outline' | 'dashed' };
	let { label, kind = 'outline' }: Props = $props();
</script>

<span class="wfd-sticker wfd-sticker--{kind} wfd-label">{label}</span>

<style>
	.wfd-sticker {
		display: inline-block;
		padding: var(--wfd-space-tight) var(--wfd-space-group);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-sticker);
		color: var(--wfd-color-text);
		line-height: var(--wfd-line-height-display);
		white-space: nowrap;
	}

	.wfd-sticker--tomato {
		border-color: var(--wfd-color-danger);
		background: var(--wfd-color-danger);
		color: var(--wfd-color-on-danger);
	}

	.wfd-sticker--amber {
		border-color: var(--wfd-color-warning);
		background: var(--wfd-color-warning);
		color: var(--wfd-color-on-warning);
	}

	.wfd-sticker--olive {
		border-color: var(--wfd-color-primary);
		background: var(--wfd-color-primary);
		color: var(--wfd-color-on-primary);
	}

	.wfd-sticker--dashed {
		border-style: dashed;
		border-color: var(--wfd-color-text-faint);
		color: var(--wfd-color-text-muted);
	}
</style>
