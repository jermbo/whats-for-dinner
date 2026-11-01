<script lang="ts">
	import { showDate } from '../../dates';
	import type { OccasionTask } from '../../occasion/occasion-note';
	import Field from '../parts/Field.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import Struck from '../parts/Struck.svelte';
	import Tick from '../parts/Tick.svelte';

	type Props = {
		tasks: OccasionTask[];
		ondone: (index: number, done: boolean) => void;
		onadd: (task: string) => void;
	};
	let { tasks, ondone, onadd }: Props = $props();

	// A task gets its day in the note. On the phone, the words are enough.
	let typed = $state('');
	function add(event: SubmitEvent) {
		event.preventDefault();
		if (typed.trim()) onadd(typed.trim());
		typed = '';
	}

	// The work that comes first is at the top. A task with no day can wait until the end.
	const inSequence = $derived(
		tasks
			.map((task, index) => ({ task, index }))
			.sort((a, b) => (a.task.day ?? '9999-12-31').localeCompare(b.task.day ?? '9999-12-31'))
	);
</script>

<section class="wfd-tasks">
	<GroupHead title="To do" note={String(tasks.filter((task) => !task.done).length)} />
	<ul class="wfd-tasks__list">
		{#each inSequence as { task, index } (index)}
			<li>
				<button
					class="wfd-tasks__task"
					type="button"
					aria-pressed={task.done}
					onclick={() => ondone(index, !task.done)}
				>
					<Tick on={task.done} />
					<span class="wfd-tasks__text"><Struck on={task.done}>{task.text}</Struck></span>
					{#if task.day}<span class="wfd-tasks__day wfd-label">{showDate(task.day)}</span>{/if}
				</button>
			</li>
		{/each}
	</ul>
	<form onsubmit={add}>
		<Field kind="new">
			<input type="text" autocomplete="off" placeholder="Add a task" aria-label="Add a task" bind:value={typed} />
		</Field>
	</form>
</section>

<style>
	.wfd-tasks {
		display: grid;
		gap: var(--wfd-space-group);
	}

	.wfd-tasks__list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	button.wfd-tasks__task {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: center;
		inline-size: 100%;
		block-size: auto;
		min-block-size: var(--wfd-control);
		padding: 0;
		border: 0;
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-border);
		border-radius: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		font-size: var(--wfd-font-size-text);
		text-align: start;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: var(--wfd-focus-offset);
		}

		&:active :global(.wfd-tick) {
			scale: 0.88;
		}
	}

	.wfd-tasks__text {
		flex: 1;
		min-inline-size: 0;
		font-weight: 600;
	}

	.wfd-tasks__day {
		color: var(--wfd-color-text-muted);
	}
</style>
