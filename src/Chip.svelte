<script lang="ts">
	let { label }: { label: string } = $props();
</script>

<span class="chip">{label}</span>

<style>
	.chip {
		padding: var(--tag-padding-y) var(--tag-padding-x);
		border-radius: var(--tag-radius);
		background: var(--tag-background);
		color: var(--tag-color);
		font-size: var(--font-ui-smaller);
	}
</style>
