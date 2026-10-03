<script>
	import { tick } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { resolve } from '$app/paths';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { entryName } from '$lib/data/menu';
	import { MEAL_TYPES, labelOf } from '$lib/data/options';
	import { gsap } from '$lib/motion/gsap';
	import MealCardBack from './MealCardBack.svelte';

	/** @typedef {import('$lib/data/menu').MenuEntry} MenuEntry */

	/** The corner of a card, for the start of the grow and the end of the shrink. */
	const CARD_RADIUS = '24px';

	/**
	 * The back of a meal card on the full screen. "open" turns the card to its edge, and then the
	 * back grows from the place of the card to the full screen. "Turn back" does the reverse.
	 * It is a modal dialog: it is above the pile, and it keeps the focus.
	 * It reads the meal from "entries", so that a change, such as "Preparation done", shows at once.
	 * @type {{
	 *   entries: MenuEntry[],
	 *   kitchen: import('$lib/kitchen.svelte').Kitchen,
	 *   lastSessions: Map<string, import('$lib/types').CookSession>,
	 *   oncook: (entry: MenuEntry) => void,
	 *   onprep: (entry: MenuEntry) => unknown
	 * }}
	 */
	let { entries, kitchen, lastSessions, oncook, onprep } = $props();

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

<dialog
	class="meal-sheet"
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
				<button
					class="button button--strong meal-sheet__cook"
					type="button"
					onclick={() => oncook(entry)}
				>
					Cooked
				</button>
			</footer>
		</div>
	{/if}
</dialog>

<style>
	/*
	 * Phone: the full screen. A large screen: a large card in the middle.
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
		background: var(--color-surface);
		border-radius: 0;
		box-shadow: none;
		opacity: 1;
		translate: none;
		transition:
			overlay 0.3s allow-discrete,
			display 0.3s allow-discrete;

		&::backdrop {
			background: rgb(4 40 44 / 0.55);
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
		border-block-end: 1px solid var(--color-border);
	}

	.meal-sheet__meta {
		color: var(--color-muted);
		font-size: 0.9rem;
	}

	.meal-sheet__close {
		display: grid;
		flex: none;
		place-items: center;
		inline-size: var(--tap);
		block-size: var(--tap);
		padding: 0;
		color: var(--color-text);
		background: var(--color-surface-soft);
		border: 0;
		border-radius: 50%;
		cursor: pointer;
		transition: scale 0.25s var(--ease-spring);

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
		gap: var(--space-3);
		padding: var(--space-4) var(--space-5) max(var(--space-4), env(safe-area-inset-bottom));
		border-block-start: 1px solid var(--color-border);
	}

	.meal-sheet__cook {
		flex: 1;
	}

	@media (min-width: 48rem) {
		.meal-sheet.meal-sheet {
			inline-size: min(40rem, 100% - 4rem);
			block-size: min(52rem, 100dvh - 4rem);
			margin: auto;
			border-radius: var(--radius);
			box-shadow: var(--shadow);
		}
	}
</style>
