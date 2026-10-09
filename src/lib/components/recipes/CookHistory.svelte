<script>
	import StoredPhoto from '$lib/components/ui/StoredPhoto.svelte';
	import { stepsToCook } from '$lib/domain/cook-cards';
	import { sessionMinutes } from '$lib/domain/cook-session';
	import { formatDate, plural } from '$lib/util/format';

	/** @typedef {import('$lib/types').CookSession} CookSession */

	/**
	 * The cook sessions of one recipe, newest first: the date, the rating, the note, and the
	 * facts that Cook mode recorded: the photo of the finished meal, the cook time, and the
	 * notes on the steps.
	 * @type {{ sessions: CookSession[], recipe: import('$lib/types').Recipe }}
	 */
	let { sessions, recipe } = $props();

	const sorted = $derived(sessions.toSorted((a, b) => b.cookedAt.localeCompare(a.cookedAt)));

	/** The number of each step of the recipe as it is now, by the ID of the step. */
	const numbers = $derived(new Map(stepsToCook(recipe).map((step, index) => [step.id, index + 1])));

	/**
	 * The time from the start of Cook mode to "Cooked", in words. A session from one tap on
	 * "Cooked" has no start, so it has no cook time.
	 * @param {CookSession} session
	 */
	function cookTime(session) {
		const minutes = sessionMinutes(session);
		return minutes ? plural(minutes, 'minute') : '';
	}
</script>

{#if sorted.length === 0}
	<p class="muted">Not cooked yet. This recipe is in the "to try" group.</p>
{:else}
	<ul class="list">
		{#each sorted as session (session.id)}
			{@const time = cookTime(session)}
			<li class="list__item cook-history__item">
				<div class="stack stack--tight cook-history__text">
					<span class="cluster cluster--between">
						<strong>{formatDate(session.cookedAt)}</strong>
						<span>{session.rating ? `Rating ${session.rating} of 5` : 'No rating'}</span>
					</span>
					{#if session.kind === 'leftover'}
						<span class="muted">Leftovers</span>
					{/if}
					{#if time}
						<span class="muted">Cook time: {time}</span>
					{/if}
					{#if session.note}
						<p>{session.note}</p>
					{/if}
					{#each session.stepNotes as note (note.id)}
						<p class="cook-history__note">
							<span class="muted">
								{numbers.has(note.stepId) ? `Step ${numbers.get(note.stepId)}:` : 'A step:'}
							</span>
							{note.text}
						</p>
					{/each}
				</div>

				{#if session.photoId}
					<span class="cook-history__photo">
						<StoredPhoto
							id={session.photoId}
							alt="The finished meal on {formatDate(session.cookedAt)}"
						/>
					</span>
				{/if}
			</li>
		{/each}
	</ul>
{/if}

<style>
	.cook-history__item {
		display: flex;
		align-items: start;
		gap: var(--space-3);
	}

	.cook-history__text {
		flex: 1;
		min-inline-size: 0;
	}

	.cook-history__photo {
		flex: none;
		inline-size: 4.5rem;
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: var(--radius-control);
	}
</style>
