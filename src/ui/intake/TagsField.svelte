<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { crossfade, scale } from 'svelte/transition';
	import Chip from '../parts/Chip.svelte';
	import HiddenName from '../parts/HiddenName.svelte';

	type Props = {
		// The tags of the recipes of the vault, from A to Z.
		known: string[];
		// The tags of this recipe, in the sequence in which you added them.
		tags: string[];
	};
	let { known, tags = $bindable() }: Props = $props();

	const uid = $props.id();
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	// A chip that you tap moves from one list to the other. A new tag has no chip to move from, so
	// it grows in place.
	const [send, receive] = crossfade({
		fallback: (node, { delay, duration, easing }) =>
			scale(node, { delay, easing, duration: typeof duration === 'number' ? duration : 0, start: 0.8 })
	});
	let typed = $state('');

	const has = (tag: string) => tags.some((one) => one.toLowerCase() === tag.toLowerCase());
	// The chips that you can still add: the known tags, and not the tags of this recipe.
	const others = $derived(known.filter((tag) => !has(tag)));

	const add = (tag: string) => (tags = [...tags, tag]);
	const remove = (tag: string) => (tags = tags.filter((one) => one !== tag));

	function onkeydown(event: KeyboardEvent) {
		if (event.key !== 'Enter' || event.isComposing) return;
		event.preventDefault();
		const tag = typed.trim().replace(/,/g, ' ');
		if (tag && !has(tag)) add(tag);
		typed = '';
	}
</script>

<fieldset class="wfd-tags">
	<legend class="wfd-tags__label wfd-label">Tags</legend>
	<!-- The two lists stay when they are empty, so that a chip always has a list to move to. -->
	<HiddenName id="{uid}-this" text="Tags of this recipe" />
	<ul class="wfd-tags__chips" aria-labelledby="{uid}-this">
		{#each tags as tag (tag)}
			<li in:receive={{ key: tag, duration }} out:send={{ key: tag, duration }}>
				<Chip label={tag} on={true} name="Take away {tag}" onclick={() => remove(tag)} />
			</li>
		{/each}
	</ul>
	<HiddenName id="{uid}-yours" text="Tags of your recipes" />
	<ul class="wfd-tags__chips" aria-labelledby="{uid}-yours">
		{#each others as tag (tag)}
			<li in:receive={{ key: tag, duration }} out:send={{ key: tag, duration }}>
				<Chip label={tag} on={false} name="Add {tag}" onclick={() => add(tag)} />
			</li>
		{/each}
	</ul>
	<input
		id="{uid}-new"
		type="text"
		aria-label="A new tag"
		placeholder="A new tag"
		enterkeyhint="done"
		autocomplete="off"
		bind:value={typed}
		{onkeydown}
	/>
</fieldset>

<style>
	.wfd-tags {
		display: grid;
		gap: 6px;
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.wfd-tags__label {
		margin-block-end: 6px;
		padding: 0;
		color: var(--wfd-ink-2);
	}

	.wfd-tags__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-tags :global(input) {
		inline-size: 100%;
	}
</style>
