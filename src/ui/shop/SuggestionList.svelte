<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import { factsOf, showReason, type Reason, type Suggestion } from '../../shop/suggestions';
	import Button from '../parts/Button.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import Sticker from '../parts/Sticker.svelte';

	type Props = {
		suggestions: Suggestion[];
		onadd: (path: string) => void;
		onskip: (path: string) => void;
	};
	let { suggestions, onadd, onskip }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	// A reason has the colour that it has in the pantry: dashed for an empty place, amber for a low
	// level, and tomato for food to use first. Each other reason is a fact.
	function stickerOf(reason: Reason) {
		if (reason.is === 'out') return 'dashed';
		if (reason.is === 'low') return 'amber';
		return reason.is === 'past' ? 'tomato' : 'outline';
	}
</script>

<!-- The staples that need a look. You accept or skip each line, and then the group is gone. -->
<section class="wfd-suggest" aria-label="Suggestions">
	<GroupHead title="Suggestions" note={String(suggestions.length)} />
	<ul class="wfd-suggest__list">
		{#each suggestions as { food, reason } (food.path)}
			{@const facts = factsOf(food)}
			<li class="wfd-suggest__line" transition:slide={{ duration }}>
				<span class="wfd-suggest__text">
					<span class="wfd-suggest__top">
						<span class="wfd-suggest__name">{food.item.name}</span>
						<Sticker label={showReason(reason)} kind={stickerOf(reason)} />
					</span>
					{#if facts.length}
						<span class="wfd-suggest__facts">{facts.join(' · ')}</span>
					{/if}
				</span>
				<Button kind="link" aria-label="Skip {food.item.name}" onclick={() => onskip(food.path)}>
					Skip
				</Button>
				<Button aria-label="Add {food.item.name}" onclick={() => onadd(food.path)}>Add</Button>
			</li>
		{/each}
	</ul>
</section>

<style>
	.wfd-suggest,
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
		grid-template-columns: minmax(0, 1fr) auto auto;
		gap: 14px;
		align-items: center;
		min-block-size: 64px;
		padding-block: 8px;
		border-block-end: 1px solid var(--wfd-line);
	}

	.wfd-suggest__text {
		display: grid;
		gap: 3px;
	}

	.wfd-suggest__top {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 10px;
		align-items: center;
	}

	.wfd-suggest__name {
		font-size: 18px;
		font-weight: 600;
	}

	.wfd-suggest__facts {
		color: var(--wfd-ink-2);
		font-size: 14px;
	}
</style>
