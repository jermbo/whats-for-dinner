<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '../parts/Button.svelte';
	import PartHead from '../parts/PartHead.svelte';

	type Props = {
		title: string;
		// The number of the step, of four.
		at: number;
		ready: boolean;
		// The words of the button, such as "Continue".
		action?: string;
		oncontinue: () => Promise<unknown>;
		children: Snippet;
	};
	let { title, at, ready, action = 'Continue', oncontinue, children }: Props = $props();
	const headId = $props.id();

	// A second tap while the plugin writes does not write two times.
	let busy = $state(false);
	async function go() {
		if (!ready || busy) return;
		busy = true;
		try {
			await oncontinue();
		} finally {
			busy = false;
		}
	}
</script>

<!-- One step of setup: the title, what you give, and the one button that goes on. -->
<section class="wfd-step" aria-labelledby={headId}>
	<PartHead id={headId} {title}>
		{#snippet side()}
			<span class="wfd-label">Step {at} of 4</span>
		{/snippet}
	</PartHead>

	{@render children()}

	<Button kind="main" disabled={!ready || busy} onclick={go}>{action}</Button>
</section>

<style>
	.wfd-step {
		display: grid;
		gap: var(--wfd-space-section);
	}
</style>
