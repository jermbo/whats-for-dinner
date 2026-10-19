<script lang="ts">
	import { untrack } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import type { Only, Sort } from '../../shop/browse';
	import type { BarState } from '../bar-state.svelte';
	import PartHead from '../parts/PartHead.svelte';
	import ExtrasStage from './ExtrasStage.svelte';
	import type { PutAwayDraft } from './put-away-draft.svelte';
	import PutAway from './PutAway.svelte';
	import ShopStage from './ShopStage.svelte';
	import { STAGES, stageWithWork, type Stage } from './stage';
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

	// The new stage comes in from the side of its place in the strip.
	let from = $state(0);
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	function open(next: Stage) {
		from = STAGES.indexOf(next) > STAGES.indexOf(shown) ? 16 : -16;
		stage = next;
	}
</script>

<section class="wfd-shop-part" aria-labelledby={headId}>
	<PartHead id={headId} title="Shop" />
	<StageStrip {counts} value={shown} onchange={open} />

	{#key shown}
		<div in:fly={{ x: from, duration }}>
			{#if shown === 'extras'}
				<ExtrasStage {kitchen} onshop={() => open('shop')} />
			{:else if shown === 'shop'}
				<ShopStage {kitchen} {bar} onputaway={() => open('away')} />
			{:else}
				<PutAway {kitchen} {draft} ondone={() => open(stageWithWork(kitchen))} />
			{/if}
		</div>
	{/key}
</section>

<style>
	.wfd-shop-part {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
	}
</style>
