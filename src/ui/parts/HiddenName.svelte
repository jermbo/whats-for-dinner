<script lang="ts">
	// The name of a list or a region for a screen reader, which aria-labelledby points to. It is
	// hidden text and not an aria-label, because Obsidian shows each aria-label as a tooltip.
	let { id, text }: { id: string; text: string } = $props();
</script>

<span class="wfd-hidden" {id}>{text}</span>
