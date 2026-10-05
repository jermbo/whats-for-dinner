<script>
	import { tick } from 'svelte';
	import { nextInCart } from '$lib/domain/put-away';
	import { closeLostPanel, isPanel, openSheetOrPanel } from '$lib/layout/sheet-or-panel';
	import { sideColumn } from '$lib/layout/side-column';
	import AmendItemForm from './AmendItemForm.svelte';
	import CartItemForm from './CartItemForm.svelte';

	/** @typedef {import('$lib/domain/put-away').CartEntry} CartEntry */

	/**
	 * The place of the card of one item of the receipt. It opens the card of a line, and selects
	 * the card: CartItemForm for an item in the cart, and AmendItemForm for an item that is put
	 * away.
	 *
	 * The card reads the item from "entries", so that a change, such as a new product, shows at
	 * once.
	 *
	 * On a page with one column, the card is a modal sheet above the page. On a page with a side
	 * column, the card is a panel in that column: put the card in the "split__side" element.
	 * The receipt stays in use next to the panel. After "Put away", the panel shows the next item
	 * that is in the cart.
	 * @type {{
	 *   entries: CartEntry[],
	 *   onputaway: (entry: CartEntry) => void,
	 *   onamend: (entry: CartEntry) => void,
	 *   onnotbought: (entry: CartEntry) => void,
	 *   onnew: (entry: CartEntry) => void
	 * }}
	 */
	let { entries, onputaway, onamend, onnotbought, onnew } = $props();

	const uid = $props.id();

	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state();
	/** The ID of the purchase that is open. */
	let openId = $state('');
	/** True when the card opened for an item that is put away. */
	let amending = $state(false);
	// A new key gives new fields each time the card opens.
	let opened = $state(0);

	const entry = $derived(entries.find((item) => item.purchase.id === openId));

	/** True when the card is open as a panel in the side column. */
	const asPanel = () => Boolean(dialog && isPanel(dialog));

	/** @param {string} purchaseId */
	export async function open(purchaseId) {
		if (!dialog) return;
		// The panel is open, and the focus is in it: the focus must go to the new item.
		const inPanel = isPanel(dialog) && dialog.contains(document.activeElement);

		openId = purchaseId;
		amending = entries.some((item) => item.purchase.id === purchaseId && item.purchase.putAwayAt);
		opened += 1;

		if (isPanel(dialog) && sideColumn(dialog)) {
			// The panel stays open. Only its item changes.
			if (!inPanel) return;
			await tick();
			/** @type {HTMLElement | null} */ (dialog.querySelector('button, input'))?.focus();
			return;
		}

		if (dialog.open) dialog.close();
		openSheetOrPanel(dialog);
	}

	// The panel does not cover the receipt. The ring of a line, or "Put all away", can put the
	// open item away: then its card closes.
	$effect(() => {
		if (!amending && entry?.purchase.putAwayAt && asPanel()) dialog?.close();
	});

	/**
	 * An item leaves the cart. The panel goes on to the next item in the cart. A sheet closes.
	 * @param {CartEntry} item
	 * @param {(item: CartEntry) => void} tell The action of the page for this item.
	 */
	function leaveCart(item, tell) {
		const next = asPanel() ? nextInCart(entries, item) : undefined;
		tell(item);
		if (next) open(next.purchase.id);
		else dialog?.close();
	}

	/** @param {CartEntry} item The item with its changes. */
	function save(item) {
		onamend(item);
		dialog?.close();
	}
</script>

<svelte:window onresize={() => dialog && closeLostPanel(dialog)} />

<dialog class="item-card" bind:this={dialog} aria-labelledby="{uid}-title">
	{#if entry}
		{@const item = entry}

		<!-- The panel goes from one item to the next. -->
		{#key opened}
			{#if amending}
				<AmendItemForm
					entry={item}
					titleId="{uid}-title"
					onsave={save}
					oncancel={() => dialog?.close()}
					onnew={() => onnew(item)}
				/>
			{:else}
				<CartItemForm
					entry={item}
					titleId="{uid}-title"
					onputaway={(values) => leaveCart(values, onputaway)}
					onlater={() => dialog?.close()}
					onnotbought={() => leaveCart(item, onnotbought)}
					onnew={() => onnew(item)}
				/>
			{/if}
		{/key}
	{/if}
</dialog>

<!-- The side column is empty while the panel is closed. This line tells how to open it. -->
<p class="item-card__hint muted split__extra">Select a line of the receipt to see its card.</p>

<style>
	/* A panel in the side column of the page: it is in the page, and not above it. */
	.item-card:not(:modal) {
		position: static;
		inline-size: 100%;
		max-inline-size: none;
		max-block-size: none;
		margin: 0;
	}

	/* The browser sets "open", so the selector is global. */
	.item-card:global([open]) + .item-card__hint {
		display: none;
	}
</style>
