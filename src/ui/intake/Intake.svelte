<script lang="ts">
	import { tagsOf, titleInUse } from '../../intake/known';
	import { foodsOf, groupOf, readLine } from '../../intake/line';
	import {
		whyNotSave,
		type IntakeDraft,
		type IntakeIngredient,
		type IntakeStart
	} from '../../intake/recipe-text';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import { foodNameOf } from '../../match/names';
	import type { FoodNote } from '../../note';
	import Button from '../parts/Button.svelte';
	import PartHead from '../parts/PartHead.svelte';
	import IngredientResult from './IngredientResult.svelte';
	import IntakeLines, { linesOf, type Line } from './IntakeLines.svelte';
	import NewFood from './NewFood.svelte';
	import SourcePhotos from './SourcePhotos.svelte';
	import TagsField from './TagsField.svelte';

	type Props = {
		kitchen: Kitchen;
		// "Convert" starts with the text of a note that is not a recipe, and "Edit" with a recipe.
		// Each replaces the text of that note.
		replace?: { is: 'convert' | 'edit'; path: string; start: IntakeStart };
		onclose: (saved: boolean) => void;
	};
	let { kitchen, replace, onclose }: Props = $props();

	const uid = $props.id();
	// The fields start once, with the note or empty.
	const start = (() => replace?.start)();
	const heading = (() => {
		if (replace?.is === 'edit') return 'Edit recipe';
		return replace ? 'Convert' : 'Add recipe';
	})();

	let title = $state(start?.title ?? '');
	let tags = $state<string[]>(start?.tags ?? []);
	let yields = $state(start?.yields ?? '');
	let source = $state(start?.source ?? '');
	let description = $state(start?.description ?? '');
	// The source photos that the note has, by name, and the new ones, which go into the vault at "Save".
	let kept = $state<string[]>(start?.sourcePhotos ?? []);
	let photos = $state<Blob[]>([]);
	let ingredients = $state<Line[]>(linesOf((start?.ingredients ?? []).map((one) => one.text)));
	let steps = $state<Line[]>(linesOf((start?.steps ?? []).map((one) => one.text)));
	// "Edit" knows the text of the note for each first line, and the photos of each step. The ids
	// of the first lines are their places, as `linesOf` gives them.
	const starts = new Map((start?.ingredients ?? []).map((one, at) => [at + 1, one]));
	const stepPhotos = new Map((start?.steps ?? []).map((one, at) => [at + 1, one.photos]));
	let saving = $state(false);
	// What you selected for a line with no food item, by the id of the line: a food item of the
	// pantry, or a name for the new food. It is for the text of that moment: when you change the
	// text, the line finds its food item again.
	type Choice = { text: string } & ({ is: 'food'; path: string } | { is: 'new'; name: string });
	let chosen = $state<Record<number, Choice>>({});

	const recipes = $derived(kitchen.recipes.map((entry) => entry.recipe));
	const knownTags = $derived(tagsOf(recipes));
	// The recipe that you edit does not count: its title is in use by itself.
	const others = $derived(
		kitchen.recipes.filter((entry) => entry.path !== replace?.path).map((entry) => entry.recipe)
	);
	const inUse = $derived(titleInUse(title, others));

	const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
	const foodAt = (path: string) => kitchen.foods.find((food) => food.path === path);

	const choiceOf = (line: Line) => (chosen[line.id]?.text === line.text ? chosen[line.id] : null);

	// The text of the note for a line that is as the note has it, or null.
	function rawOf(line: Line): string | null {
		const first = starts.get(line.id);
		return first?.raw != null && first.text === line.text ? first.raw : null;
	}

	// The food items of a line: the one that you selected, or the ones of its name. A line as the
	// note has it keeps its link, so its food is the food of the link.
	function foodsOfLine(line: Line): FoodNote[] {
		const raw = rawOf(line);
		if (raw !== null) {
			const name = foodNameOf(raw.replace(/^(?:\*[^*]+\*|_[^_]+_)\s*/, ''));
			return foodsOf({ amount: null, name, extra: '' }, kitchen.foodIndex);
		}
		const choice = choiceOf(line);
		if (choice?.is === 'new') return [];
		const picked = choice?.is === 'food' ? foodAt(choice.path) : undefined;
		return picked ? [picked] : foodsOf(readLine(line.text), kitchen.foodIndex);
	}

	// The name of the stub: the name that you typed, or the name of the line.
	function newNameOf(line: Line): string {
		const choice = choiceOf(line);
		return choice?.is === 'new' ? choice.name : capital(readLine(line.text).name);
	}

	// One food item: a link. Two or more: no link, and Cook Mode selects one. None: a stub.
	function ingredientOf(line: Line): IntakeIngredient {
		const group = groupOf(line.text);
		if (group) return { is: 'group', title: group };
		const food = { is: 'food', text: line.text, link: null, isNew: false, raw: null } as const;
		const raw = rawOf(line);
		if (raw !== null) return { ...food, raw };
		const foods = foodsOfLine(line);
		if (foods.length === 1) return { ...food, link: foods[0].path };
		if (foods.length > 1) return food;
		const name = newNameOf(line);
		if (!name) return food;
		return { ...food, link: kitchen.newFoodPath(name), isNew: true };
	}

	const draft = $derived<IntakeDraft>({
		title,
		tags,
		yields,
		source,
		sourcePhotos: kept,
		description,
		ingredients: ingredients.map(ingredientOf),
		steps: steps.map((line) => ({ text: line.text, photos: stepPhotos.get(line.id) ?? [] })),
		after: start?.after ?? ''
	});
	const problem = $derived(whyNotSave(draft));

	async function save() {
		if (problem || saving) return;
		saving = true;
		// When the write fails, intake stays open with each field, and a notice tells why.
		const properties = start?.properties ?? '';
		const saved =
			replace?.is === 'convert'
				? await kitchen.intake.convertRecipe(replace.path, properties, draft, photos)
				: replace?.is === 'edit'
					? await kitchen.intake.editRecipe(replace.path, properties, draft, photos)
					: await kitchen.intake.saveRecipe(draft, photos);
		saving = false;
		if (saved) onclose(true);
	}
</script>

<!-- No form: Enter in a field gives the next line, and only the button saves. -->
<section class="wfd-intake" aria-labelledby="{uid}-head">
	<PartHead id="{uid}-head" title={heading}>
		{#snippet side()}
			<Button kind="link" onclick={() => onclose(false)}>Close</Button>
		{/snippet}
	</PartHead>

	<label class="wfd-intake__field" for="{uid}-title">
		<span class="wfd-label">Title</span>
		<input id="{uid}-title" type="text" autocomplete="off" bind:value={title} />
		{#if inUse}
			<span class="wfd-intake__note" aria-live="polite">
				The vault has the recipe "{inUse}". "Save" makes a second one.
			</span>
		{/if}
	</label>

	<TagsField known={knownTags} bind:tags />

	<div class="wfd-intake__field">
		<label class="wfd-label" for="{uid}-source">Source</label>
		<textarea
			id="{uid}-source"
			rows="1"
			placeholder="One Pan Wonders, page 46"
			bind:value={source}
		></textarea>
		<SourcePhotos
			bind:photos
			bind:kept
			urlOf={(name) => (replace ? kitchen.photoUrl(name, replace.path) : null)}
		/>
	</div>

	{#if replace}
		<!-- Each text of the note that has no other field is here, so that nothing is lost. -->
		<label class="wfd-intake__field" for="{uid}-description">
			<span class="wfd-label">Description</span>
			<textarea id="{uid}-description" rows="4" bind:value={description}></textarea>
		</label>
	{/if}

	<label class="wfd-intake__field" for="{uid}-yields">
		<span class="wfd-label">Yield</span>
		<input
			id="{uid}-yields"
			type="text"
			autocomplete="off"
			placeholder="4 servings"
			bind:value={yields}
		/>
	</label>

	<IntakeLines label="Ingredients" hint="200 g flour" bind:lines={ingredients}>
		{#snippet result(line)}
			{@const read = readLine(line.text)}
			{@const foods = foodsOfLine(line)}
			{#if groupOf(line.text)}
				<p class="wfd-intake__group">Group</p>
			{:else if foods.length || rawOf(line) !== null}
				<!-- A line as the note has it keeps its text, so "Save" makes no stub for it. -->
				<IngredientResult line={read} {foods} />
			{:else}
				<NewFood
					name={newNameOf(line)}
					foods={kitchen.foods}
					onpick={(path) => (chosen[line.id] = { text: line.text, is: 'food', path })}
					onname={(name) => (chosen[line.id] = { text: line.text, is: 'new', name })}
				/>
			{/if}
		{/snippet}
	</IntakeLines>

	<IntakeLines label="Steps" hint="Mix the flour and the milk." bind:lines={steps}>
		{#snippet result(line)}
			{@const count = stepPhotos.get(line.id)?.length ?? 0}
			{#if count}
				<p class="wfd-intake__note">
					{count === 1 ? '1 photo stays' : `${count} photos stay`} with this step.
				</p>
			{/if}
		{/snippet}
	</IntakeLines>

	<div class="wfd-intake__end">
		<!-- An empty title only turns "Save" off: a new intake starts with no title, and that is no problem. -->
		{#if problem && title.trim()}
			<p class="wfd-intake__note" aria-live="polite">{problem}</p>
		{/if}
		<Button kind="main" disabled={Boolean(problem) || saving} onclick={save}>
			{saving ? 'One moment' : 'Save'}
		</Button>
	</div>
</section>

<style>
	.wfd-intake {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 18px;
		max-inline-size: 40rem;
	}

	.wfd-intake__field {
		display: grid;
		gap: 6px;
		color: var(--wfd-ink-2);
	}

	.wfd-intake__field :global(:is(input, textarea)) {
		inline-size: 100%;
	}

	.wfd-intake__end {
		display: grid;
		gap: 8px;
		padding-block-start: 8px;
		border-block-start: var(--wfd-rule-4) solid var(--wfd-ink);
	}

	.wfd-intake__group {
		margin: 0;
		padding-inline: 4px;
		color: var(--wfd-ink-2);
		font-size: 14px;
		font-weight: 600;
	}

	.wfd-intake__note {
		margin: 0;
		color: var(--wfd-ink-2);
		font-size: 14px;
	}
</style>
