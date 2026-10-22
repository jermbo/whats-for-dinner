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
	import { ShopMoves } from './shop-moves.svelte';
	import ShopStage from './ShopStage.svelte';
	import { stageWithWork, type Stage } from './stage';
	import StageStrip from './StageStrip.svelte';
	import TripButtons from './TripButtons.svelte';

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

	// The list and the cart as the screen shows them while a tick moves a row.
	const moves = new ShopMoves(() => ({ list: kitchen.list, cart: kitchen.cart }));
	$effect(() => moves.settle());

	const counts = $derived({
		extras: kitchen.suggestions.length,
		shop: moves.toGet,
		away: moves.inCart
	});

	// The stage Shop shows the list or the cart. A dark circle grows from the cart into the cart,
	// and paper grows from the shelf back into the list.
	let view = $state<'list' | 'cart'>('list');
	function show(next: 'list' | 'cart', event: MouseEvent) {
		const source = event.currentTarget instanceof HTMLElement ? event.currentTarget : undefined;
		if (next === view || !source || !stageBox) return;
		cover(source, next === 'cart' ? 'frame' : 'bg', () => (view = next), stageBox);
	}

	// Each name that lands gives its button one squeeze.
	let landed = $state({ shelf: 0, cart: 0 });
	const onland = (on: 'shelf' | 'cart') => (landed[on] += 1);

	// The new stage comes in under a circle of paper from the button that you tapped. The circle
	// covers only the stage, so the strip stays in view.
	// The strip shows the new stage at once, while the circle grows.
	let stageBox = $state<HTMLElement>();
	let going = $state<Stage | null>(null);
	function open(next: Stage, source: HTMLElement | undefined = stageBox) {
		if (next === (going ?? shown) || !source || !stageBox) return void (stage = next);
		going = next;
		cover(source, 'bg', () => ((stage = next), (going = null), (view = 'list')), stageBox);
	}
	const fromButton = (next: Stage) => (event: MouseEvent) =>
		open(next, event.currentTarget instanceof HTMLElement ? event.currentTarget : undefined);
</script>

<section class="wfd-shop-part" aria-labelledby={headId}>
	<PartTop>
		<PartHead id={headId} title="Shop" />
		<StageStrip {counts} value={going ?? shown} onchange={open} />
		{#if shown === 'shop'}
			<TripButtons
				{view}
				toGet={moves.toGet}
				inCart={moves.inCart}
				shelfLanded={landed.shelf}
				cartLanded={landed.cart}
				onshow={show}
			/>
		{/if}
	</PartTop>

	<div bind:this={stageBox}>
		{#key shown}
			{#if shown === 'extras'}
				<ExtrasStage {kitchen} onshop={fromButton('shop')} />
			{:else if shown === 'shop'}
				<ShopStage {kitchen} {bar} {moves} {view} {onland} onputaway={fromButton('away')} />
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
