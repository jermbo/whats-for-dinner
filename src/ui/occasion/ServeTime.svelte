<script lang="ts">
	import { slide } from 'svelte/transition';
	import Button from '../parts/Button.svelte';
	import Field from '../parts/Field.svelte';
	import { tokenTime } from '../motion';

	// When the food is on the table. One chip tells it, and a tap opens a time field.
	type Props = { serve: string | null; onchange: (time: string | null) => void };
	let { serve, onchange }: Props = $props();

	const duration = $derived(tokenTime('change'));
	let open = $state(false);
</script>

<div class="wfd-serve">
	<Button kind="quiet" aria-expanded={open} onclick={() => (open = !open)}>
		{serve ? `Serve at ${serve}` : 'Set serve time'}
	</Button>

	{#if open}
		<div class="wfd-serve__edit" transition:slide={{ duration }}>
			<Field label="Serve at">
				<input
					type="time"
					value={serve ?? ''}
					onchange={(event) => onchange(event.currentTarget.value || null)}
				/>
			</Field>
			{#if serve}<Button kind="link" onclick={() => onchange(null)}>Clear</Button>{/if}
			<Button kind="link" onclick={() => (open = false)}>Done</Button>
		</div>
	{/if}
</div>

<style>
	.wfd-serve {
		display: grid;
		gap: var(--wfd-space-group);
		justify-items: start;
	}

	.wfd-serve__edit {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-stack);
		align-items: end;
	}
</style>
