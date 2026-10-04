<script>
	import { tick } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { resolve } from '$app/paths';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { entryName } from '$lib/domain/menu';
	import { MEAL_TYPES, labelOf } from '$lib/domain/options';
	import { sideColumn } from '$lib/layout/side-column';
	import { gsap } from '$lib/motion/gsap';
	import MealCardBack from './MealCardBack.svelte';

	/** @typedef {import('$lib/domain/menu').MenuEntry} MenuEntry */

	/** The corner of a card, for the start of the grow and the end of the shrink. */
	const CARD_RADIUS = '12px';

	/**
	 * The back of a meal card on the full screen. "open" turns the card to its edge, and then the
	 * back grows from the place of the card to the full screen. "Turn back" does the reverse.
	 * On a page that has a side column, the back covers only that column: it is next to the card.
	 * It is a modal dialog: it is above the pile, and it keeps the focus.
	 * It reads the meal from "entries", so that a change, such as "Preparation done", shows at once.
	 * The foot has the action of the screen: "Cooked" with "oncook", and "Remove from the menu"
	 * with "onremove".
	 * @type {{
	 *   entries: MenuEntry[],
	 *   kitchen: import('$lib/state/kitchen.svelte').Kitchen,
	 *   lastSessions: Map<string, import('$lib/types').CookSession>,
	 *   oncook?: (entry: MenuEntry) => void,
	 *   onremove?: (entry: MenuEntry) => void,
	 *   onprep: (entry: MenuEntry) => unknown
	 * }}
	 */
	let { entries, kitchen, lastSessions, oncook, onremove, onprep } = $props();

	const uid = $props.id();

	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state();
	/** @type {HTMLElement | undefined} */
	let inner = $state();
	/** The menu item ID of the meal that is open. */
	let openId = $state('');
	const entry = $derived(entries.find((item) => item.item.id === openId));
	const last = $derived(entry && lastSessions.get(entry.recipe.id));
	/** The card that was turned. The back goes back onto it. */
	let card = /** @type {HTMLElement | undefined} */ (undefined);
	/** The level bars fill when the back is open. */
	let filled = $state(false);
	let moving = false;
	/**
	 * The place of the side column of the page, in pixels: the distance from its right edge to
	 * the right edge of the screen, and its width. Null: the page has one column.
	 * @type {{ end: number, size: number } | null}
	 */
	let side = $state.raw(null);

	/** Finds the side column next to the card. The back then opens on that column. */
	function place() {
		const column = card && sideColumn(card);
		if (!column) {
			side = null;
			return;
		}
		const box = column.getBoundingClientRect();
		side = { end: document.documentElement.clientWidth - box.right, size: box.width };
	}

	/**
	 * The transform that puts the full sheet exactly on a box, from the center.
	 * @param {DOMRect} box
	 */
	function onto(box) {
		const full = /** @type {HTMLDialogElement} */ (dialog).getBoundingClientRect();
		return {
			x: box.left + box.width / 2 - (full.left + full.width / 2),
			y: box.top + box.height / 2 - (full.top + full.height / 2),
			scaleX: box.width / full.width,
			scaleY: box.height / full.height
		};
	}

	/**
	 * The box of the card with no turn, also when the card is on its edge now.
	 * @param {HTMLElement} element
	 */
	function boxOf(element) {
		const turn = gsap.getProperty(element, 'rotationY');
		gsap.set(element, { rotationY: 0 });
		const box = element.getBoundingClientRect();
		gsap.set(element, { rotationY: turn });
		return box;
	}

	/**
	 * @param {string} id The menu item ID of the meal.
	 * @param {HTMLElement} from The card element.
	 */
	export async function open(id, from) {
		if (moving || dialog?.open) return;
		moving = true;
		openId = id;
		card = from;
		filled = false;
		place();
		await tick();
		if (!dialog || !inner) {
			moving = false;
			return;
		}

		if (prefersReducedMotion.current) {
			dialog.showModal();
		} else {
			const box = boxOf(from);
			await gsap.to(from, {
				rotationY: 90,
				transformPerspective: 900,
				duration: 0.2,
				ease: 'power2.in'
			});

			gsap.set(dialog, { clearProps: 'transform,borderRadius' });
			gsap.set(inner, { opacity: 0, y: 16 });
			dialog.showModal();
			const radius = getComputedStyle(dialog).borderRadius;

			await gsap.fromTo(
				dialog,
				{ ...onto(box), rotationY: -90, transformPerspective: 1400, borderRadius: CARD_RADIUS },
				{
					x: 0,
					y: 0,
					scaleX: 1,
					scaleY: 1,
					rotationY: 0,
					borderRadius: radius,
					duration: 0.5,
					ease: 'power3.out'
				}
			);
			gsap.set(dialog, { clearProps: 'borderRadius' });
			gsap.to(inner, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
		}

		filled = true;
		moving = false;
	}

	async function close() {
		if (moving || !dialog?.open) return;
		moving = true;

		if (card && inner && !prefersReducedMotion.current) {
			const box = boxOf(card);
			await gsap.to(inner, { opacity: 0, duration: 0.15 });
			await gsap.to(dialog, {
				...onto(box),
				rotationY: -90,
				transformPerspective: 1400,
				borderRadius: CARD_RADIUS,
				duration: 0.32,
				ease: 'power2.in'
			});
		}

		// The browser gives the focus back to the button that opened the dialog.
		dialog.close();
		filled = false;

		if (card) {
			const turned = card;
			await gsap.to(turned, {
				rotationY: 0,
				duration: prefersReducedMotion.current ? 0 : 0.35,
				ease: 'back.out(1.7)',
				onComplete: () => gsap.set(turned, { clearProps: 'transform' })
			});
		}
		moving = false;
	}

	/**
	 * The card turns back first. Then the meal goes off the menu, and its card goes out of the row.
	 * @param {MenuEntry} target
	 */
	async function remove(target) {
		await close();
		onremove?.(target);
	}

	/** @param {Event} event */
	function cancel(event) {
		// The Escape key: the same turn back as the button.
		event.preventDefault();
		close();
	}

	/** @param {MouseEvent} event */
	function outside(event) {
		// A click on the backdrop, outside the sheet, on a large screen.
		if (event.target === dialog) close();
	}
</script>

<!-- A new size of the window can move the side column. -->
<svelte:window onresize={() => dialog?.open && place()} />

<dialog
	class={['meal-sheet', side && 'meal-sheet--side']}
	style:--side-end={side ? `${side.end}px` : null}
	style:--side-size={side ? `${side.size}px` : null}
	bind:this={dialog}
	aria-labelledby="{uid}-title"
	oncancel={cancel}
	onclick={outside}
>
	{#if entry}
		<div class="meal-sheet__inner" bind:this={inner}>
			<header class="meal-sheet__head">
				<div class="meal-sheet__title">
					<p class="meal-sheet__meta">
						{labelOf(MEAL_TYPES, entry.recipe.mealType)} · {entry.recipe.servings} servings
					</p>
					<h2 id="{uid}-title">{entryName(entry)}</h2>
				</div>
				<button class="meal-sheet__close" type="button" onclick={close}>
					<Icon name="turn" />
					<span class="visually-hidden">Turn the card back</span>
				</button>
			</header>

			<div class="meal-sheet__body">
				<MealCardBack {entry} {kitchen} {last} open={filled} {onprep} />
			</div>

			<footer class="meal-sheet__foot">
				<a class="button" href={resolve('/recipes/[id]', { id: entry.recipe.id })}>Full recipe</a>
				{#if onremove}
					<button
						class="button button--danger meal-sheet__action"
						type="button"
						onclick={() => remove(entry)}
					>
						Remove from the menu
					</button>
				{/if}
				{#if oncook}
					<button
						class="button button--strong meal-sheet__action"
						type="button"
						onclick={() => oncook(entry)}
					>
						Cooked
					</button>
				{/if}
			</footer>
		</div>
	{/if}
</dialog>

<style>
	/*
	 * Phone: the full screen. A wider main area: a large card in the middle of the screen.
	 * A page with a side column: a panel on that column.
	 * GSAP moves the sheet, so the open and close styles of other dialogs are off here.
	 * The selector has two classes, so that it is stronger than the styles of "dialog".
	 */
	.meal-sheet.meal-sheet {
		inline-size: 100%;
		max-inline-size: none;
		block-size: 100dvh;
		max-block-size: none;
		margin: 0;
		padding: 0;
		overflow: hidden;
		background: var(--card);
		border: 0;
		border-radius: 0;
		box-shadow: none;
		opacity: 1;
		translate: none;
		transition:
			overlay 0.3s allow-discrete,
			display 0.3s allow-discrete;

		&::backdrop {
			background: color-mix(in srgb, var(--ink) 60%, transparent);
		}
	}

	.meal-sheet__inner {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto;
		block-size: 100%;
	}

	.meal-sheet__head {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: var(--space-3);
		padding: max(var(--space-5), env(safe-area-inset-top)) var(--space-5) var(--space-4);
		border-block-end: var(--rule-4) solid var(--ink);
	}

	.meal-sheet__meta {
		margin-block-end: var(--space-1);
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.meal-sheet__close {
		display: grid;
		flex: none;
		place-items: center;
		inline-size: var(--tap);
		block-size: var(--tap);
		padding: 0;
		color: var(--paper);
		background: var(--ink);
		border: 0;
		border-radius: var(--radius-control);
		cursor: pointer;
		transition: scale 0.2s var(--ease-out);

		&:active {
			scale: 0.9;
		}
	}

	.meal-sheet__body {
		padding: var(--space-5);
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.meal-sheet__foot {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		padding: var(--space-4) var(--space-5) max(var(--space-4), env(safe-area-inset-bottom));
		border-block-start: var(--rule-1) solid var(--ink);
	}

	.meal-sheet__action {
		flex: 1;
	}

	@container main (min-width: 38rem) {
		.meal-sheet.meal-sheet {
			inline-size: min(40rem, 100% - 4rem);
			block-size: min(52rem, 100dvh - 4rem);
			margin: auto;
			border: var(--rule-4) solid var(--ink);
			border-radius: var(--radius);
			box-shadow: var(--shadow);
		}
	}

	/*
	 * The script gives the place of the side column. The panel is as wide as the column, but
	 * not too narrow for its buttons: then it grows to the left.
	 * The page stays in view, so the backdrop is light.
	 */
	.meal-sheet.meal-sheet.meal-sheet--side {
		inset-inline: auto var(--side-end);
		inline-size: max(var(--side-size), 24rem);
		block-size: calc(100dvh - 2 * var(--space-4));
		margin: var(--space-4) 0;
		border: var(--rule-4) solid var(--ink);
		border-radius: var(--radius);
		box-shadow: var(--shadow);

		&::backdrop {
			background: color-mix(in srgb, var(--ink) 30%, transparent);
		}
	}
</style>
