<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { GuestRow } from '../../occasion/guests';
	import Field from '../parts/Field.svelte';
	import { tokenTime } from '../motion';

	// One short row for each guest: most guests only come, so a row is enough. The list is who
	// "Who brings?" can pick.
	type Props = {
		guests: GuestRow[];
		coming: number;
		jobsOf: (person: string | null) => string[];
		onadd: (name: string) => void;
		onsize: (name: string, size: number) => void;
		onremove: (name: string) => void;
	};
	let { guests, coming, jobsOf, onadd, onsize, onremove }: Props = $props();

	const duration = $derived(tokenTime('change'));
	let typed = $state('');

	function add(event: SubmitEvent) {
		event.preventDefault();
		if (typed.trim()) onadd(typed.trim());
		typed = '';
	}
</script>

<div class="wfd-guests">
	<form onsubmit={add}>
		<Field kind="new">
			<input type="text" autocomplete="off" placeholder="Add a guest" aria-label="Add a guest" bind:value={typed} />
		</Field>
	</form>

	<ul class="wfd-guests__list">
		<li class="wfd-guests__row">
			<span class="wfd-guests__who">
				<b>You</b>
				<span class="wfd-guests__jobs">{jobsOf(null).join(', ') || 'Host'}</span>
			</span>
		</li>
		{#each guests as guest (guest.name)}
			{@const jobs = jobsOf(guest.name)}
			<li class="wfd-guests__row" transition:slide={{ duration }}>
				<span class="wfd-guests__who">
					<b>{guest.name}</b>
					<span class="wfd-guests__jobs">{jobs.length ? jobs.join(', ') : 'Visitor'}</span>
				</span>
				<span class="wfd-guests__size">
					<button
						type="button"
						aria-label="One fewer with {guest.name}"
						disabled={guest.size <= 1}
						onclick={() => onsize(guest.name, guest.size - 1)}>−</button
					>
					<span class="wfd-number">×{guest.size}</span>
					<button type="button" aria-label="One more with {guest.name}" onclick={() => onsize(guest.name, guest.size + 1)}
						>+</button
					>
				</span>
				<button class="wfd-guests__remove" type="button" aria-label="Remove {guest.name}" onclick={() => onremove(guest.name)}>
					<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" /></svg>
				</button>
			</li>
		{/each}
	</ul>
	<p class="wfd-guests__total"><b class="wfd-number">{coming}</b> coming</p>
</div>

<style>
	.wfd-guests {
		display: grid;
		gap: var(--wfd-space-group);
	}

	.wfd-guests__list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-guests__row {
		display: flex;
		gap: var(--wfd-space-group);
		align-items: center;
		min-block-size: var(--wfd-control);
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-track);
	}

	.wfd-guests__who {
		display: flex;
		flex: 1;
		flex-wrap: wrap;
		gap: 0 var(--wfd-space-group);
		align-items: baseline;
		min-inline-size: 0;
		padding-block: var(--wfd-space-group);

		& b {
			font-size: var(--wfd-font-size-name);
			overflow-wrap: anywhere;
		}
	}

	.wfd-guests__jobs {
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
	}

	.wfd-guests__size {
		display: flex;
		gap: var(--wfd-space-tight);
		align-items: center;

		& button {
			inline-size: var(--wfd-control-min);
			block-size: var(--wfd-control-min);
			padding: 0;
			border: var(--wfd-border-thin) solid var(--wfd-color-border);
			border-radius: var(--wfd-radius-pill);
			background: var(--wfd-color-control);
			box-shadow: none;
			color: var(--wfd-color-text);
			font-size: var(--wfd-font-size-name);
			cursor: pointer;
		}

		& button:disabled {
			opacity: 0.4;
			cursor: default;
		}
	}

	button.wfd-guests__remove {
		display: grid;
		place-items: center;
		inline-size: var(--wfd-control-min);
		block-size: var(--wfd-control-min);
		padding: 0;
		border: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text-muted);
		cursor: pointer;

		& svg {
			inline-size: 16px;
			block-size: 16px;
			fill: none;
			stroke: currentcolor;
			stroke-linecap: square;
			stroke-width: 2.5;
		}
	}

	.wfd-guests__total {
		margin: 0;
		text-align: end;

		& b {
			font-size: var(--wfd-font-size-title);
		}
	}
</style>
