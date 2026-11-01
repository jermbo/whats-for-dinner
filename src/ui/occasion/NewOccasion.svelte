<script lang="ts">
	import type { Kitchen } from '../../kitchen-state.svelte';
	import { dayProblem, nameProblem, pastOccasions } from '../../occasion/occasions';
	import { cover, coverThen } from '../cover';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import Field from '../parts/Field.svelte';
	import PartHead from '../parts/PartHead.svelte';

	// The path of the new note, or null when you cancel.
	type Props = { kitchen: Kitchen; onclose: (path: string | null) => void };
	let { kitchen, onclose }: Props = $props();
	const uid = $props.id();

	let name = $state('');
	let day = $state('');
	// The past occasion that the new one copies, or null for an empty note.
	let from = $state<string | null>(null);
	let busy = $state(false);

	const names = $derived(kitchen.occasions.map((occasion) => occasion.name));
	const problem = $derived(nameProblem(name, names) ?? dayProblem(day, kitchen.today));
	// A name of spaces or signs only is no name. The form says nothing about it.
	const hasName = $derived(/[\p{L}\p{N}]/u.test(name));
	const ready = $derived(hasName && Boolean(day) && !problem && !busy);
	// Next Thanksgiving starts from this Thanksgiving.
	const past = $derived(pastOccasions(kitchen.occasions, kitchen.today));

	async function start(event: SubmitEvent) {
		event.preventDefault();
		if (!ready) return;
		busy = true;
		const path = await kitchen.occasion.start(name, day, from);
		busy = false;
		if (!path) return;
		const source = event.submitter;
		if (source instanceof HTMLElement) cover(source, 'bg', () => onclose(path));
		else onclose(path);
	}
</script>

<section class="wfd-new-occasion" aria-labelledby="{uid}-head">
	<PartHead id="{uid}-head" title="New occasion" />

	<form class="wfd-new-occasion__form" onsubmit={start}>
		<Field label="Name">
			<!-- svelte-ignore a11y_autofocus -->
			<input type="text" autocomplete="off" placeholder="Thanksgiving 2026" autofocus bind:value={name} />
		</Field>
		<Field label="Day">
			<input type="date" min={kitchen.today} bind:value={day} />
		</Field>
		<p class="wfd-new-occasion__problem" aria-live="polite">{problem ?? ''}</p>

		{#if past.length}
			<div class="wfd-new-occasion__past" role="group" aria-labelledby="{uid}-past">
				<span class="wfd-label" id="{uid}-past">Start from</span>
				<div class="wfd-new-occasion__chips">
					{#each past as occasion (occasion.path)}
						<Chip
							label={occasion.name}
							on={from === occasion.path}
							onclick={() => (from = from === occasion.path ? null : occasion.path)}
						/>
					{/each}
				</div>
			</div>
		{/if}

		<div class="wfd-new-occasion__actions">
			<Button kind="link" onclick={(event) => coverThen(event, 'bg', () => onclose(null))}>Cancel</Button>
			<Button kind="olive" type="submit" disabled={!ready}>Start</Button>
		</div>
	</form>
</section>

<style>
	.wfd-new-occasion,
	.wfd-new-occasion__form {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-section);
	}

	.wfd-new-occasion__form {
		max-inline-size: 32rem;
	}

	/* The line keeps its height with no text, so the buttons do not jump. */
	.wfd-new-occasion__problem {
		min-block-size: 1lh;
		margin: 0;
		color: var(--wfd-color-danger);
		font-weight: 700;
	}

	.wfd-new-occasion__past {
		display: grid;
		gap: var(--wfd-space-group);
		color: var(--wfd-color-text-muted);
	}

	/* The chips stay in one row, and the row scrolls to the side. */
	.wfd-new-occasion__chips {
		display: flex;
		gap: var(--wfd-space-group);
		overflow-x: auto;
	}

	.wfd-new-occasion__actions {
		display: flex;
		gap: var(--wfd-space-section);
		align-items: center;
		justify-content: space-between;
	}
</style>
