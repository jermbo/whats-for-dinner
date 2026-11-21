<script lang="ts">
	import { showLength } from '../../occasion/clock';
	import Button from '../parts/Button.svelte';
	import Field from '../parts/Field.svelte';

	// The time of a dish and its start, in the sheet of the dish. A guess shows with "~", and a change
	// makes it a field of the line. "Auto" gives the decision of the start back to the serve time.
	type Props = {
		minutes: number | null;
		guessed: boolean;
		// The start as the plan has it, or null when nobody knows it yet.
		start: string | null;
		// The line has its own start.
		fixed: boolean;
		onminutes: (minutes: number) => void;
		onstart: (start: string | null) => void;
	};
	let { minutes, guessed, start, fixed, onminutes, onstart }: Props = $props();

	const STEP = 15;
	const SHORTEST = 5;
	const step = (by: number) => onminutes(Math.max(SHORTEST, (minutes ?? 0) + by));
</script>

<div class="wfd-time">
	<div class="wfd-time__length" role="group" aria-label="How long it takes">
		<Button aria-label="Shorter by {STEP} minutes" onclick={() => step(-STEP)}>−</Button>
		<span class="wfd-time__value wfd-number">
			{minutes === null ? 'Set time' : `${guessed ? '~' : ''}${showLength(minutes)}`}
		</span>
		<Button aria-label="Longer by {STEP} minutes" onclick={() => step(minutes === null ? 60 : STEP)}>+</Button>
	</div>

	<div class="wfd-time__start">
		<Field label="Start at">
			<input
				type="time"
				value={start ?? ''}
				onchange={(event) => onstart(event.currentTarget.value || null)}
			/>
		</Field>
		{#if fixed}<Button kind="link" onclick={() => onstart(null)}>Auto</Button>{/if}
	</div>
</div>

<style>
	.wfd-time {
		display: grid;
		gap: var(--wfd-space-stack);
	}

	.wfd-time__length {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: center;
		justify-content: space-between;
	}

	.wfd-time__value {
		font-size: var(--wfd-font-size-title);
		text-align: center;
	}

	.wfd-time__start {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: end;
	}

	.wfd-time__start :global(.wfd-field) {
		flex: 1;
	}
</style>
