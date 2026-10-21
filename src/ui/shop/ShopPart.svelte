<script lang="ts">
	import { untrack } from 'svelte';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import type { Only, Sort } from '../../shop/browse';
	import type { BarState } from '../bar-state.svelte';
	import { cover } from '../cover';
	import PartHead from '../parts/PartHead.svelte';
	import PartTop from '../parts/PartTop.svelte';
	import ExtrasStage from './ExtrasStage.svelte';
	import type { PutAwayDraft } from './put-away-draft.svelte';
	import PutAway from './PutAway.svelte';
	import ShopStage from './ShopStage.svelte';
	import { stageWithWork, type Stage } from './stage';
	import StageStrip from './StageStrip.svelte';

	type Props = {
		kitchen: Kitchen;
		bar: BarState<Sort, Only>;
		draft: PutAwayDraft;
		// The stage that you opened. With none, the part opens on the stage that has work.
		stage: Stage | null;
	};
	let { kitchen, bar, draft, stage = $bindable() }: Props = $props();
	const headId = $props.id();

	// The stage with work is decided one time, when the part opens. If it followed the kitchen, the
	// last "Add" in Extras would move you to Shop under your thumb.
	const start = untrack(() => stageWithWork(kitchen));
	const shown = $derived(stage ?? start);

	const counts = $derived({
		extras: kitchen.suggestions.length,
		shop: kitchen.list.length,
		away: kitchen.cart.length
	});

	// The new stage comes in under a circle of paper from the button that you tapped. The circle
	// covers only the stage, so the strip stays in view.
	// The strip shows the new stage at once, while the circle grows.
	let stageBox = $state<HTMLElement>();
	let going = $state<Stage | null>(null);
	function open(next: Stage, source: HTMLElement | undefined = stageBox) {
		if (next === (going ?? shown) || !source || !stageBox) return void (stage = next);
		going = next;
		cover(source, 'bg', () => ((stage = next), (going = null)), stageBox);
	}
	const fromButton = (next: Stage) => (event: MouseEvent) =>
		open(next, event.currentTarget instanceof HTMLElement ? event.currentTarget : undefined);
</script>

<section class="wfd-shop-part" aria-labelledby={headId}>
	<PartTop>
		<PartHead id={headId} title="Shop" />
		<StageStrip {counts} value={going ?? shown} onchange={open} />
	</PartTop>

	<div bind:this={stageBox}>
		{#key shown}
			{#if shown === 'extras'}
				<ExtrasStage {kitchen} onshop={fromButton('shop')} />
			{:else if shown === 'shop'}
				<ShopStage {kitchen} {bar} onputaway={fromButton('away')} />
			{:else}
				<PutAway {kitchen} {draft} ondone={() => open(stageWithWork(kitchen))} />
			{/if}
		{/key}
	</div>
</section>

<style>
	.wfd-shop-part {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-stack);
	}
</style>
