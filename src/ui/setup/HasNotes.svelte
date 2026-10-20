<script lang="ts">
	import PartHead from '../parts/PartHead.svelte';

	const headId = $props.id();
</script>

<!--
	Setup is for a new vault, and it moves no note. A vault that has notes of the kitchen already
	goes on from the settings tab, where you check the folders first.
-->
<section class="wfd-notes" aria-labelledby={headId}>
	<PartHead id={headId} title="Setup" />
	<p>This vault has notes of the kitchen already, so setup does not start.</p>
	<p>
		Open the settings of the plugin. Check the folders, and then tap "Use these notes" at the top.
	</p>
</section>

<style>
	.wfd-notes {
		display: grid;
		gap: var(--wfd-space-stack);
		max-inline-size: 40rem;
		padding: var(--wfd-space-page) var(--wfd-space-page) var(--wfd-space-section);
		color: var(--wfd-color-text);

		& p {
			margin: 0;
		}
	}
</style>
