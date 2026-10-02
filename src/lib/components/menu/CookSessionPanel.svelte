<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import RatingInput from '$lib/components/ui/RatingInput.svelte';
	import SuccessMark from '$lib/components/ui/SuccessMark.svelte';
	import { setLeftovers, undoCook, updateSession } from '$lib/data/cooking';
	import { db } from '$lib/db/db';
	import { live } from '$lib/live.svelte';
	import { status } from '$lib/status.svelte';
	import { indexBy } from '$lib/util/collections';
	import { formatQuantity } from '$lib/util/format';

	/**
	 * The screen after "Cooked": what the pantry lost, plus the optional rating, note,
	 * leftovers, and undo.
	 * @type {{ id: string }}
	 */
	let { id } = $props();

	const uid = $props.id();

	const session = live(() => db.sessions.get(id), undefined);
	const ingredients = live(() => db.ingredients.toArray(), []);
	const ingredientsById = $derived(indexBy(ingredients.current, 'id'));

	/** @param {import('$lib/types').CookSession} current */
	async function undo(current) {
		await undoCook(current);
		status.say('Undone. The meal is back on the menu.');
		goto(resolve('/'));
	}
</script>

{#if session.current}
	{@const current = session.current}

	<SuccessMark />

	<PageHeader
		title="Cooked: {current.recipeName}"
		heading={current.recipeName}
		eyebrow="Cooked. Nice work."
	/>

	<section class="stack stack--tight" aria-labelledby="{uid}-pantry">
		<h2 id="{uid}-pantry">Pantry update</h2>
		{#if current.deductions.length === 0}
			<p class="muted">The pantry did not change.</p>
		{:else}
			<ul class="list">
				{#each current.deductions as deduction, index (index)}
					{@const ingredient = ingredientsById.get(deduction.ingredientId)}
					{#if ingredient}
						<li class="list__item cluster cluster--between">
							<span>{ingredient.name}</span>
							<span>−{formatQuantity(deduction.amount, ingredient.unit)}</span>
						</li>
					{/if}
				{/each}
			</ul>
		{/if}
	</section>

	<RatingInput
		legend="Rating (optional)"
		value={current.rating}
		onchange={(rating) => updateSession(id, { rating })}
	/>

	<div class="field">
		<label class="field__label" for="{uid}-note">Note for the next time (optional)</label>
		<textarea
			class="field__control"
			id="{uid}-note"
			value={current.note}
			onchange={(event) => updateSession(id, { note: event.currentTarget.value })}></textarea>
	</div>

	{#if current.kind === 'recipe'}
		<label class="field field--inline">
			<input
				type="checkbox"
				checked={current.leftoverMenuId !== null}
				onchange={(event) => setLeftovers(current, event.currentTarget.checked)}
			/>
			<span>There are leftovers. Add them to the menu.</span>
		</label>
	{/if}

	<div class="cluster">
		<a class="button button--primary" href={resolve('/')}>Done</a>
		<button class="button" type="button" onclick={() => undo(current)}>Undo "Cooked"</button>
	</div>
{:else}
	<PageHeader title="Cooked" />
	<p class="muted">This cook session is not on this device.</p>
{/if}
