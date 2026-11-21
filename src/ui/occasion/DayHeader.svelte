<script lang="ts">
	import { showDate } from '../../dates';
	import { clockToMinutes, showLength } from '../../occasion/clock';
	import type { NextUp } from '../../occasion/cook-plan';
	import { daysLabel, type Occasion } from '../../occasion/occasions';
	import Button from '../parts/Button.svelte';

	// The top of "Cook day": a place card with the name of the occasion, as the tables of a dinner
	// have. It tells when the food is on the table, how far the day is, and what to do next.
	type Props = {
		occasion: Occasion;
		today: string;
		// The hour on the device, in minutes from midnight.
		now: number;
		// The day of the occasion is today. Before it, the card shows a plan, with no clock.
		live: boolean;
		done: number;
		total: number;
		next: NextUp | null;
		// A dish is open: the card shrinks to a few lines, so that Cook Mode keeps the height.
		compact?: boolean;
		onlate: () => void;
	};
	let { occasion, today, now, live, done, total, next, compact = false, onlate }: Props = $props();

	const when = $derived(
		[occasion.date ? showDate(occasion.date) : 'No date', daysLabel(occasion.date, today)]
			.filter(Boolean)
			.join(' · ')
	);

	const left = $derived.by(() => {
		const end = occasion.serve === null ? null : clockToMinutes(occasion.serve);
		return live && end !== null ? end - now : null;
	});
	const serveLine = $derived(
		left === null ? null : left > 0 ? `Serve in ${showLength(left)}` : 'Serve time is here'
	);

	const nextLine = $derived.by(() => {
		if (!live || !next) return null;
		if (next.minutes > 0) return `Next: start ${next.name} in ${showLength(next.minutes)}`;
		return next.minutes === 0
			? `Start ${next.name} now`
			: `${next.name} is ${showLength(-next.minutes)} late`;
	});
	const late = $derived(next !== null && live && next.minutes <= 0);
	const share = $derived(total ? (done / total) * 100 : 0);
</script>

<section class="wfd-head" class:wfd-head--compact={compact} aria-label="The day">
	<div class="wfd-head__top">
		{#if compact}
			<h2 class="wfd-head__name wfd-display">{occasion.name}</h2>
		{:else}
			<span class="wfd-label wfd-head__when">{when}</span>
		{/if}
		{#if occasion.serve}
			<span class="wfd-head__serve wfd-number">Serve {occasion.serve}</span>
		{/if}
	</div>

	{#if !compact}
		<h2 class="wfd-head__name wfd-display">{occasion.name}</h2>

		<!-- The fold of a place card. -->
		<div class="wfd-head__fold"></div>
	{/if}

	<div class="wfd-head__facts">
		{#if serveLine && !compact}<span class="wfd-head__count wfd-display">{serveLine}</span>{/if}
		<span class="wfd-head__done">
			<span class="wfd-label">{done} of {total} done</span>
			<span
				class="wfd-head__bar"
				role="progressbar"
				aria-valuemin="0"
				aria-valuemax={total}
				aria-valuenow={done}
				aria-label="Dishes done"
			>
				<span class="wfd-head__fill" style:inline-size="{share}%"></span>
			</span>
		</span>
	</div>

	{#if nextLine || (occasion.serve && !compact)}
		<div class="wfd-head__next" class:wfd-head__next--late={late}>
			{#if nextLine}<span class="wfd-head__line">{nextLine}</span>{/if}
			{#if occasion.serve && !compact}
				<Button kind="link" onclick={onlate}>Running late: serve 15 min later</Button>
			{/if}
		</div>
	{/if}
</section>

<style>
	/* A paper card in the dark frame: it has the one olive stripe of the kitchen, and the fold. */
	.wfd-head {
		display: grid;
		flex: none;
		gap: var(--wfd-space-group);
		padding: var(--wfd-space-inset) var(--wfd-space-section) var(--wfd-space-section);
		border-block-start: var(--wfd-space-group) solid var(--wfd-color-primary);
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-color-surface);
		color: var(--wfd-color-text);
		container-type: inline-size;
	}

	.wfd-head__top {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group);
		align-items: center;
		justify-content: space-between;
	}

	.wfd-head--compact {
		gap: var(--wfd-space-tight);
		padding-block: var(--wfd-space-group);
	}

	.wfd-head--compact .wfd-head__name {
		font-size: var(--wfd-font-size-title);
	}

	.wfd-head__when {
		color: var(--wfd-color-text-muted);
	}

	/* The serve time is a sticker on the card: the one fact that the day moves toward. */
	.wfd-head__serve {
		padding: 2px var(--wfd-space-inset);
		border-radius: var(--wfd-radius-pill);
		background: var(--wfd-color-primary);
		color: var(--wfd-color-on-primary);
		font-size: var(--wfd-font-size-name);
	}

	.wfd-head__name {
		margin: 0;
		font-size: clamp(2rem, 9cqi, 3.5rem);
		line-height: var(--wfd-line-height-display);
		overflow-wrap: anywhere;
	}

	.wfd-head__fold {
		border-block-end: var(--wfd-border-thin) dashed var(--wfd-color-text-faint);
	}

	.wfd-head__facts {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group) var(--wfd-space-section);
		align-items: end;
		justify-content: space-between;
	}

	.wfd-head__count {
		font-size: var(--wfd-font-size-title);
	}

	.wfd-head__done {
		display: grid;
		flex: 1 1 8rem;
		gap: var(--wfd-space-tight);
		max-inline-size: 16rem;
	}

	.wfd-head__bar {
		display: block;
		block-size: 8px;
		border-radius: var(--wfd-radius-pill);
		background: var(--wfd-color-track);
		overflow: hidden;
	}

	.wfd-head__fill {
		display: block;
		block-size: 100%;
		background: var(--wfd-color-primary);
		transition: inline-size var(--wfd-motion-change) var(--wfd-ease-out);
	}

	.wfd-head__next {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-tight) var(--wfd-space-section);
		align-items: center;
		justify-content: space-between;
	}

	.wfd-head__line {
		font-weight: 700;
	}

	.wfd-head__next--late .wfd-head__line {
		color: var(--wfd-color-danger);
	}
</style>
