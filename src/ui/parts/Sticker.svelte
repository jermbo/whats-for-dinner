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
		padding: 3px 7px;
		border: 2px solid var(--wfd-ink);
		border-radius: var(--wfd-radius-sticker);
		color: var(--wfd-ink);
		line-height: 1.2;
		white-space: nowrap;
	}

	.wfd-sticker--tomato {
		border-color: var(--wfd-tomato);
		background: var(--wfd-tomato);
		color: #fff;
	}

	.wfd-sticker--amber {
		border-color: var(--wfd-amber);
		background: var(--wfd-amber);
		color: var(--wfd-on-olive);
	}

	.wfd-sticker--olive {
		border-color: var(--wfd-olive);
		background: var(--wfd-olive);
		color: var(--wfd-on-olive);
	}

	.wfd-sticker--dashed {
		border-style: dashed;
		border-color: var(--wfd-ink-3);
		color: var(--wfd-ink-2);
	}
</style>
