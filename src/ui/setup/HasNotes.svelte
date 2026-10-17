<script lang="ts">
	import PartHead from '../parts/PartHead.svelte';
</script>

<!--
	Setup is for a new vault, and it moves no note. A vault that has notes of the kitchen already
	goes on from the settings tab, where you check the folders first.
-->
<section class="wfd-notes" aria-label="Setup">
	<PartHead title="Setup" />
	<p>This vault has notes of the kitchen already, so setup does not start.</p>
	<p>
		Open the settings of the plugin. Check the folders, and then tap "Use these notes" at the top.
	</p>
</section>

<style>
	.wfd-notes {
		display: grid;
		gap: 12px;
		max-inline-size: 40rem;
		padding: 12px 14px 40px;
		color: var(--wfd-ink);

		& p {
			margin: 0;
		}
	}
</style>
