<script lang="ts">
	import './fonts.css';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade, fly } from 'svelte/transition';
	import type { Kitchen, Part } from '../kitchen-state.svelte';
	import type { Only as PantryOnly, Sort as PantrySort } from '../pantry/views';
	import type { Only as PlanOnly, Sort as PlanSort } from '../plan/browse';
	import type { Only as RecipeOnly, Sort as RecipeSort } from '../recipes/browse';
	import type { Only as ShopOnly, Sort as ShopSort } from '../shop/browse';
	import { BarState } from './bar-state.svelte';
	import CookMode from './cook/CookMode.svelte';
	import PantryPart from './pantry/PantryPart.svelte';
	import Button from './parts/Button.svelte';
	import Nav from './parts/Nav.svelte';
	import PartHead from './parts/PartHead.svelte';
	import PlanPart from './plan/PlanPart.svelte';
	import RecipesPart from './recipes/RecipesPart.svelte';
	import Intake from './intake/Intake.svelte';
	import Gallery from './recipes/Gallery.svelte';
	import HasNotes from './setup/HasNotes.svelte';
	import Setup from './setup/Setup.svelte';
	import { PutAwayDraft } from './shop/put-away-draft.svelte';
	import ShopPart from './shop/ShopPart.svelte';
	import type { Stage } from './shop/stage';

	let { kitchen }: { kitchen: Kitchen } = $props();

	const sequence: Part[] = ['pantry', 'recipes', 'plan', 'shop'];

	const toCook = $derived(kitchen.meals.filter((meal) => !meal.cooked).length);
	const options = $derived([
		{ value: 'pantry' as const, label: 'Pantry' },
		{ value: 'recipes' as const, label: 'Recipes' },
		{ value: 'plan' as const, label: 'Plan', count: toCook },
		{ value: 'shop' as const, label: 'Shop', count: kitchen.list.length }
	]);

	const part = $derived(kitchen.part);
	// The new part comes in from the side of its option in the navigation.
	let from = $state(-16);
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	// The kitchen fades in at the end of setup. A tab that opens on the four parts shows them at once.
	let inSetup = $state(false);
	$effect.pre(() => {
		if (kitchen.screen !== 'kitchen') inSetup = true;
	});

	// The bar of each part, with the sequence that the part starts with. A part forgets its bar
	// when it goes off the screen, so the bars are here: they stay while the kitchen is open.
	const bars = {
		pantry: new BarState<PantrySort, PantryOnly>('place'),
		recipes: new BarState<RecipeSort, RecipeOnly>('match'),
		plan: new BarState<PlanSort, PlanOnly>('type'),
		shop: new BarState<ShopSort, ShopOnly>('name')
	};

	function show(next: Part) {
		from = sequence.indexOf(next) > sequence.indexOf(part) ? 16 : -16;
		kitchen.showPart(next);
	}

	// The plan asks for the recipes of one type, to add a meal of that type. Only that filter is
	// on, and the open bar shows why the list is short.
	function browse(type: string) {
		bars.recipes.clear();
		bars.recipes.find = '';
		bars.recipes.one = type;
		bars.recipes.open = true;
		show('recipes');
	}

	// The path of the recipe that is in Cook Mode.
	let cooking = $state<string | null>(null);
	const cooked = $derived(kitchen.recipes.find((entry) => entry.path === cooking));
	const cook = (path: string) => (cooking = path);
	const page = $derived(kitchen.page);
	const inGallery = $derived(
		page?.is === 'gallery' ? kitchen.recipes.find((entry) => entry.path === page.path) : undefined
	);

	// After "Save", the Recipes part shows the new recipe.
	function closePage(saved: boolean) {
		kitchen.closePage();
		if (saved) show('recipes');
	}

	// The Shop part forgets its stage and what you gave at put away when it goes off the screen, so
	// the two are here: they stay while the kitchen is open.
	let shopStage = $state<Stage | null>(null);
	const draft = new PutAwayDraft();
</script>

<!-- The note is gone, or it is not a recipe now, or the vault cannot read it: one tap goes back. -->
{#snippet gone(path: string)}
	<PartHead title="Intake">
		{#snippet side()}
			<Button kind="link" onclick={() => kitchen.closePage()}>Close</Button>
		{/snippet}
	</PartHead>
	<p class="wfd-kitchen__gone">The plugin cannot read the note "{path}".</p>
{/snippet}

<!--
	Until setup is complete, the four parts are not there. Before the first read of the vault, the
	kitchen cannot tell setup from a vault with notes, so the screen is empty.
-->
{#if kitchen.screen === null}
	<div class="wfd-kitchen"></div>
{:else if kitchen.screen === 'notes'}
	<HasNotes />
{:else if kitchen.screen !== 'kitchen'}
	<Setup {kitchen} step={kitchen.screen} />
{:else if page?.is === 'intake'}
	<div class="wfd-kitchen" in:fade={{ duration }}>
		<Intake {kitchen} onclose={closePage} />
	</div>
{:else if page?.is === 'convert' || page?.is === 'edit'}
	<div class="wfd-kitchen" in:fade={{ duration }}>
		{#await kitchen.readForIntake(page) then start}
			{#if start}
				<Intake {kitchen} replace={{ is: page.is, path: page.path, start }} onclose={closePage} />
			{:else}
				{@render gone(page.path)}
			{/if}
		{:catch}
			{@render gone(page.path)}
		{/await}
	</div>
{:else if inGallery}
	<Gallery {kitchen} entry={inGallery} onclose={() => kitchen.closePage()} />
{:else if cooked}
	<CookMode {kitchen} entry={cooked} onclose={() => (cooking = null)} />
{:else}
	<div class="wfd-kitchen" in:fade={{ duration: inSetup ? duration : 0 }}>
		<Nav label="Part of the kitchen" {options} value={part} onchange={show} />

		{#key part}
			<div in:fly={{ x: from, duration }}>
				{#if part === 'pantry'}
					<PantryPart {kitchen} bar={bars.pantry} />
				{:else if part === 'recipes'}
					<RecipesPart {kitchen} oncook={cook} bar={bars.recipes} />
				{:else if part === 'plan'}
					<PlanPart {kitchen} oncook={cook} onbrowse={browse} bar={bars.plan} />
				{:else}
					<ShopPart {kitchen} bar={bars.shop} {draft} bind:stage={shopStage} />
				{/if}
			</div>
		{/key}
	</div>
{/if}

<style>
	.wfd-kitchen__gone {
		margin: 0;
		color: var(--wfd-ink-2);
	}

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
