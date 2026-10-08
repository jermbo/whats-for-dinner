<script>
	import Icon from '$lib/components/ui/Icon.svelte';
	import { readyAfter } from '$lib/domain/recipes';
	import { useClock } from '$lib/state/clock.svelte';
	import { formatWhen } from '$lib/util/format';
	import { SECOND } from '$lib/util/time';

	/** @typedef {import('$lib/domain/menu').MenuEntry} MenuEntry */

	/**
	 * What a meal needs before you can cook it, on the back of its card.
	 * Not done: the steps, when the meal is ready if you do them now, and "Preparation done".
	 * Done: a line goes through the steps, and a bar fills until the meal is ready.
	 * @type {{ entry: MenuEntry, onprep: (entry: MenuEntry) => unknown }}
	 */
	let { entry, onprep } = $props();

	let saving = $state(false);

	// The time when the meal is ready, and the bar, move with the clock.
	const clock = useClock(30 * SECOND);
	const now = $derived(clock.now);

	const steps = $derived(entry.recipe.prepSteps);
	const progress = $derived.by(() => {
		if (!entry.item.prepDoneAt || !entry.readyAt) return 1;
		const start = Date.parse(entry.item.prepDoneAt);
		return Math.min(1, Math.max(0, (now - start) / (entry.readyAt - start)));
	});

	async function prepare() {
		saving = true;
		await onprep(entry);
		saving = false;
	}
</script>

<div class={['meal-prep', entry.item.prepDoneAt && 'meal-prep--done']}>
	<ol class="meal-prep__steps">
		{#each steps as step, index (index)}
			<li>
				<span class="meal-prep__task">{step.text}.</span>
				<span class="meal-prep__lead">{step.leadHours} hours before.</span>
			</li>
		{/each}
	</ol>

	{#if entry.state === 'todo'}
		<p class="meal-prep__when">
			<Icon name="clock" />
			<span>Do it now, and the meal is ready {formatWhen(readyAfter(entry.recipe, now))}.</span>
		</p>
		<button class="button button--primary" type="button" onclick={prepare} disabled={saving}>
			Preparation done
		</button>
	{:else if entry.state === 'waiting' && entry.readyAt}
		<p class="meal-prep__when">
			<Icon name="clock" />
			<span>Ready {formatWhen(entry.readyAt)}.</span>
		</p>
		<span class="meal-prep__bar" style:--progress={progress} aria-hidden="true"></span>
	{:else}
		<p class="meal-prep__when">
			<Icon name="check" />
			<span>The preparation is done. You can cook it now.</span>
		</p>
	{/if}
</div>

<style>
	.meal-prep {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.meal-prep__steps {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		margin: 0;
		padding-inline-start: var(--space-4);
		font-size: 0.875rem;
	}

	/* After "Preparation done", a line draws through each step, as a pen does. */
	.meal-prep__task {
		background: linear-gradient(currentColor, currentColor) no-repeat 0 55% / 0% 2px;
		box-decoration-break: clone;
		-webkit-box-decoration-break: clone;
		transition: background-size 0.6s var(--ease-out) 0.1s;
	}

	.meal-prep__lead {
		font-weight: 800;
	}

	.meal-prep--done {
		& .meal-prep__task {
			background-size: 100% 2px;
		}

		& .meal-prep__task,
		& .meal-prep__lead {
			color: var(--ink-soft);
		}
	}

	.meal-prep__when {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: 0.875rem;
		font-weight: 700;

		& :global(.icon) {
			flex: none;
			inline-size: 1.125rem;
			block-size: 1.125rem;
		}
	}

	/* How much of the wait is over. */
	.meal-prep__bar {
		block-size: 0.5rem;
		background: var(--paper-deep);

		&::before {
			display: block;
			inline-size: calc(var(--progress) * 100%);
			block-size: 100%;
			content: '';
			background: var(--ink);
			transition: inline-size 1s var(--ease-out);
		}
	}
</style>
