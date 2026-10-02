<script>
	import { formatDate } from '$lib/util/format';

	/**
	 * The cook sessions of one recipe: date, rating, and note.
	 * @type {{ sessions: import('$lib/types').CookSession[] }}
	 */
	let { sessions } = $props();

	const sorted = $derived(sessions.toSorted((a, b) => b.cookedAt.localeCompare(a.cookedAt)));
</script>

{#if sorted.length === 0}
	<p class="muted">Not cooked yet. This recipe is in the "to try" group.</p>
{:else}
	<ul class="list">
		{#each sorted as session (session.id)}
			<li class="list__item stack stack--tight">
				<span class="cluster cluster--between">
					<strong>{formatDate(session.cookedAt)}</strong>
					<span>{session.rating ? `Rating ${session.rating} of 5` : 'No rating'}</span>
				</span>
				{#if session.kind === 'leftover'}
					<span class="muted">Leftovers</span>
				{/if}
				{#if session.note}
					<p>{session.note}</p>
				{/if}
			</li>
		{/each}
	</ul>
{/if}
