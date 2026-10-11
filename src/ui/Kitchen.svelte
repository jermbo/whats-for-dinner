<script lang="ts">
	import './fonts.css';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import type { Kitchen } from '../kitchen-state.svelte';
	import CookMode from './cook/CookMode.svelte';
	import PantryPart from './pantry/PantryPart.svelte';
	import Nav from './parts/Nav.svelte';
	import PlanPart from './plan/PlanPart.svelte';
	import RecipesPart from './recipes/RecipesPart.svelte';
	import ShopPart from './shop/ShopPart.svelte';

	let { kitchen }: { kitchen: Kitchen } = $props();

	type Part = 'pantry' | 'recipes' | 'plan' | 'shop';
	const sequence: Part[] = ['pantry', 'recipes', 'plan', 'shop'];

	const toCook = $derived(kitchen.meals.filter((meal) => !meal.cooked).length);
	const toBuy = $derived(kitchen.shopping.filter((row) => !kitchen.cart.includes(row.key)).length);
	const options = $derived([
		{ value: 'pantry' as const, label: 'Pantry' },
		{ value: 'recipes' as const, label: 'Recipes' },
		{ value: 'plan' as const, label: 'Plan', count: toCook },
		{ value: 'shop' as const, label: 'Shop', count: toBuy }
	]);

	let part = $state<Part>('pantry');
	// The new part comes in from the side of its option in the navigation.
	let from = $state(-16);
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	function show(next: Part) {
		from = sequence.indexOf(next) > sequence.indexOf(part) ? 16 : -16;
		part = next;
	}

	// The path of the recipe that is in Cook Mode.
	let cooking = $state<string | null>(null);
	const cooked = $derived(kitchen.recipes.find((entry) => entry.path === cooking));
	const cook = (path: string) => (cooking = path);
</script>

{#if cooked}
	<CookMode {kitchen} entry={cooked} onclose={() => (cooking = null)} />
{:else}
	<div class="wfd-kitchen">
		<Nav label="Part of the kitchen" {options} value={part} onchange={show} />

		{#key part}
			<div in:fly={{ x: from, duration }}>
				{#if part === 'pantry'}
					<PantryPart {kitchen} />
				{:else if part === 'recipes'}
					<RecipesPart {kitchen} oncook={cook} />
				{:else if part === 'plan'}
					<PlanPart {kitchen} oncook={cook} onbrowse={() => show('recipes')} />
				{:else}
					<ShopPart {kitchen} />
				{/if}
			</div>
		{/key}
	</div>
{/if}

<style>
	/*
	 * The Larder look: paper, cards, and ink. Olive, amber, and tomato are rare, so that they keep
	 * their meaning. Each class has the prefix "wfd", because Obsidian has its own rules for names
	 * such as "card".
	 */
	:global(.wfd) {
		--wfd-paper: #eceae2;
		--wfd-card: #ffffff;
		--wfd-ink: #1d1c1a;
		--wfd-ink-2: #4a463f;
		--wfd-ink-3: #9d998e;
		--wfd-track: #d9d6cb;
		/* A thin rule between rows, and the edge of a control that is not on. */
		--wfd-line: #1d1c1a;
		/* The surface of a control that is not on. */
		--wfd-quiet: #ffffff;
		--wfd-on-ink: #ffffff;
		--wfd-olive: oklch(0.78 0.15 110);
		--wfd-on-olive: #1d1c1a;
		--wfd-amber: oklch(0.75 0.15 75);
		--wfd-on-amber: #1d1c1a;
		--wfd-tomato: oklch(0.55 0.17 30);
		--wfd-frame: #1d1c1a;

		--wfd-rule-4: 4px;
		--wfd-radius-card: 12px;
		--wfd-radius-button: 8px;
		--wfd-radius-sticker: 2px;

		/* Titles, names, and numbers have their own font. All other text is the font of the system. */
		--wfd-display: 'Bricolage Grotesque Variable', var(--font-interface);
		--wfd-body: var(--font-interface);

		background: var(--wfd-paper);
		color: var(--wfd-ink);
		font-family: var(--wfd-body);
		font-size: 16px;
		font-weight: 500;
	}

	/*
	 * In the dark scheme of Obsidian, the paper and the ink change places. Light lines on a dark
	 * page are hard on the eyes, so the thin rules and the edges of controls are soft here.
	 */
	:global(.theme-dark .wfd) {
		--wfd-paper: #1d1c1a;
		--wfd-card: #2b2a27;
		--wfd-ink: #e6e3d9;
		--wfd-ink-2: #b5b1a5;
		--wfd-ink-3: #827e74;
		--wfd-track: #45433e;
		--wfd-line: #504e48;
		--wfd-quiet: #383733;
		--wfd-on-ink: #1d1c1a;
		--wfd-tomato: oklch(0.63 0.18 30);
	}

	/* The parts set their own space, so that Cook Mode can fill the tab. */
	:global(.workspace-leaf-content .view-content.wfd) {
		padding: 0;
	}

	/* Names and titles: the few words that you must find at a glance. */
	:global(.wfd-display) {
		font-family: var(--wfd-display);
		font-weight: 700;
		line-height: 1.12;
		letter-spacing: -0.02em;
	}

	/* The one number of a row. The unit stays as you wrote it: "500 g", not "500 G". */
	:global(.wfd-number) {
		font-family: var(--wfd-display);
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		line-height: 1.12;
		letter-spacing: -0.02em;
	}

	/* A label names a thing. It is small, heavy, and in capitals. */
	:global(.wfd-label) {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	/* A field is a card with an ink rule. */
	:global(.wfd :is(input[type='text'], input[type='date'], textarea, select)) {
		min-block-size: 50px;
		padding: 0 14px;
		border: 2px solid var(--wfd-line);
		border-radius: var(--wfd-radius-button);
		background-color: var(--wfd-quiet);
		box-shadow: none;
		color: var(--wfd-ink);
		font-family: inherit;
		font-size: 17px;
		font-weight: 600;
	}

	:global(.wfd textarea) {
		padding-block: 12px;
	}

	/* The arrow of a select: two small triangles of ink. */
	:global(.wfd select:not([multiple])) {
		padding-inline-end: 30px;
		background-image:
			linear-gradient(45deg, transparent 50%, var(--wfd-ink) 50%),
			linear-gradient(135deg, var(--wfd-ink) 50%, transparent 50%);
		background-repeat: no-repeat;
		background-position:
			calc(100% - 16px) 50%,
			calc(100% - 11px) 50%;
		background-size: 5px 5px;
		appearance: none;
	}

	:global(.wfd input[type='checkbox']:checked::after) {
		inset-block-start: -2px;
		inset-inline-start: -2px;
	}

	:global(.wfd :is(input, textarea, select):focus-visible) {
		border-color: var(--wfd-ink);
		outline: 2px solid var(--wfd-ink);
		outline-offset: 2px;
		box-shadow: none;
	}

	/* A check box is a square of ink. Obsidian draws the check, with these values. */
	:global(.wfd input[type='checkbox']) {
		--checkbox-size: 28px;
		--checkbox-radius: var(--wfd-radius-sticker);
		--checkbox-border-color: var(--wfd-ink);
		--checkbox-border-color-hover: var(--wfd-ink);
		--checkbox-color: var(--wfd-ink);
		--checkbox-color-hover: var(--wfd-ink);
		--checkbox-marker-color: var(--wfd-on-ink);

		margin: 0;
		border-width: 2px;
	}

	.wfd-kitchen {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 16px;
		padding: 12px 14px max(var(--safe-area-inset-bottom, 0px), 40px);
	}
</style>
