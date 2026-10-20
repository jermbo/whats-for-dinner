<script lang="ts">
	import { onDestroy } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import {
		factsOf,
		groupOf,
		GROUPS,
		showReason,
		type Reason,
		type Suggestion
	} from '../../shop/suggestions';
	import Button from '../parts/Button.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import HiddenName from '../parts/HiddenName.svelte';
	import ListLine from '../parts/ListLine.svelte';
	import Sticker from '../parts/Sticker.svelte';

	type Props = {
		suggestions: Suggestion[];
		onadd: (path: string) => void;
		onskip: (path: string) => void;
		onunskip: (path: string) => void;
		onneverask: (path: string) => void;
	};
	let { suggestions, onadd, onskip, onunskip, onneverask }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	// The need first: what you have none of, then what is low, then the dates, then a reminder of time.
	const groups = $derived(
		GROUPS.map(({ group, title }) => ({
			title,
			lines: suggestions.filter(({ reason }) => groupOf(reason) === group)
		})).filter(({ lines }) => lines.length)
	);

	// A reason has the colour that it has in the pantry: dashed for an empty place, amber for a low
	// level, and tomato for food to use first. Each other reason is a fact.
	function stickerOf(reason: Reason) {
		if (reason.is === 'out') return 'dashed';
		if (reason.is === 'low') return 'amber';
		return reason.is === 'past' ? 'tomato' : 'outline';
	}

	// The last skip, with a way to make it "never" or to take it back. It goes at your next action,
	// or after a time, so that it does not stay in the way.
	const SKIP_SHOWS = 8000;
	let skipped = $state<{ path: string; name: string } | null>(null);
	let timer: ReturnType<typeof setTimeout> | undefined;

	function forget() {
		clearTimeout(timer);
		skipped = null;
	}

	function skip(path: string, name: string) {
		forget();
		onskip(path);
		skipped = { path, name };
		timer = setTimeout(forget, SKIP_SHOWS);
	}

	function add(path: string) {
		forget();
		onadd(path);
	}

	function never(path: string) {
		forget();
		onneverask(path);
	}

	function undo(path: string) {
		forget();
		onunskip(path);
	}

	onDestroy(() => clearTimeout(timer));

	const uid = $props.id();
</script>

<!-- The food items that need a look. You accept or skip each line, and then it is gone. -->
<section class="wfd-suggest" aria-labelledby="{uid}-name">
	<HiddenName id="{uid}-name" text="Suggestions" />
	<div aria-live="polite">
		{#if skipped}
			{@const { path, name } = skipped}
			<p class="wfd-suggest__skipped" transition:slide={{ duration }}>
				<span class="wfd-suggest__skipped-text">{name} is skipped for this trip.</span>
				<Button kind="link" onclick={() => never(path)}>Never ask</Button>
				<Button kind="link" onclick={() => undo(path)}>Undo</Button>
			</p>
		{/if}
	</div>

	<!-- With the last suggestion gone, the note of a skip stays, so that "Undo" can bring it back. -->
	{#if !groups.length}
		<p class="wfd-suggest__none">No food needs a look.</p>
	{/if}

	{#each groups as group (group.title)}
		<section class="wfd-suggest__group" transition:slide={{ duration }}>
			<GroupHead title={group.title} note={String(group.lines.length)} />
			<ul class="wfd-suggest__list">
				{#each group.lines as { food, reason } (food.path)}
					{@const facts = factsOf(food)}
					<li class="wfd-suggest__line" transition:slide={{ duration }}>
						<ListLine name={food.item.name} small={facts.join(' · ') || undefined}>
							{#snippet tag()}
								<Sticker label={showReason(reason)} kind={stickerOf(reason)} />
							{/snippet}
							{#snippet control()}
								<Button
									kind="link"
									aria-label="Skip {food.item.name}"
									onclick={() => skip(food.path, food.item.name)}
								>
									Skip
								</Button>
								<Button aria-label="Add {food.item.name}" onclick={() => add(food.path)}>Add</Button>
							{/snippet}
						</ListLine>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</section>

<style>
	.wfd-suggest,
	.wfd-suggest__group,
	.wfd-suggest__list {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
	}

	.wfd-suggest__list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-suggest__line {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: center;
		min-block-size: 64px;
		padding-block: var(--wfd-space-group);
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-border);
	}

	.wfd-suggest__none {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}

	/* The note of a skip is a quiet card, so that it does not look like one more suggestion. */
	.wfd-suggest__skipped {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--wfd-space-section);
		align-items: center;
		margin: 0;
		padding: var(--wfd-space-tight) var(--wfd-space-inset);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-surface);
	}

	.wfd-suggest__skipped-text {
		flex: 1 1 12rem;
		color: var(--wfd-color-text-muted);
		font-weight: 600;
	}
</style>
