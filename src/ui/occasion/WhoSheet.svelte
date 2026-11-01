<script lang="ts">
	import { OPEN } from '../../occasion/occasion-note';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import Field from '../parts/Field.svelte';

	// "Who brings?": a sheet from the bottom, with one large button for each person, for the thumb.
	// A dialog is in the top layer, so the main area needs no fixed position.
	export type SheetDish = { name: string; person: string | null; course: string; scale: number };
	type Props = {
		// The dish of the sheet, or null when the sheet is closed.
		dish: SheetDish | null;
		guests: string[];
		courses: string[];
		onperson: (person: string | null) => void;
		onnewperson: (name: string) => void;
		oncourse: (course: string) => void;
		onscale: (scale: number) => void;
		onremove: () => void;
		onclose: () => void;
	};
	let { dish, guests, courses, onperson, onnewperson, oncourse, onscale, onremove, onclose }: Props =
		$props();

	const SCALES = [1, 1.5, 2, 3, 4];
	let dialog = $state<HTMLDialogElement>();
	let person = $state('');
	let course = $state('');
	let typingCourse = $state(false);
	const people = $derived([null, ...guests, OPEN]);

	$effect(() => {
		if (!dialog) return;
		if (dish && !dialog.open) dialog.showModal();
		if (!dish && dialog.open) dialog.close();
	});

	const label = (one: string | null) => (one === null ? 'You' : one === OPEN ? 'Nobody yet' : one);
	const face = (one: string | null) => (one === null ? '★' : one === OPEN ? '?' : one.charAt(0).toUpperCase());

	function addPerson(event: SubmitEvent) {
		event.preventDefault();
		if (person.trim()) onnewperson(person.trim());
		person = '';
	}
	function addCourse(event: SubmitEvent) {
		event.preventDefault();
		if (course.trim()) oncourse(course.trim().toLowerCase());
		course = '';
		typingCourse = false;
	}
</script>

<dialog
	class="wfd-sheet"
	aria-labelledby="wfd-sheet-title"
	bind:this={dialog}
	{onclose}
	onclick={(event) => event.target === dialog && onclose()}
>
	{#if dish}
		<div class="wfd-sheet__inner">
			<div>
				<span class="wfd-label wfd-sheet__muted">Who brings</span>
				<h3 class="wfd-display wfd-sheet__title" id="wfd-sheet-title">{dish.name}</h3>
			</div>

			<div class="wfd-sheet__people">
				{#each people as one (one ?? '')}
					{@const on = dish.person === one}
					<button
						type="button"
						class="wfd-sheet__person"
						class:wfd-sheet__person--on={on}
						class:wfd-sheet__person--open={one === OPEN}
						aria-pressed={on}
						onclick={() => onperson(one)}
					>
						<span class="wfd-sheet__face" aria-hidden="true">{face(one)}</span>
						<span class="wfd-sheet__name">{label(one)}</span>
						{#if on}<span aria-hidden="true">✓</span>{/if}
					</button>
				{/each}
			</div>

			<form onsubmit={addPerson}>
				<Field kind="new">
					<input type="text" autocomplete="off" placeholder="New person" aria-label="New person" bind:value={person} />
				</Field>
			</form>

			<div class="wfd-sheet__chips" role="group" aria-label="Course of {dish.name}">
				{#each courses as one (one)}
					<Chip label={one} on={dish.course === one} onclick={() => oncourse(one)} />
				{/each}
				<Chip label="+ Course" on={typingCourse} onclick={() => (typingCourse = !typingCourse)} />
			</div>
			{#if typingCourse}
				<form onsubmit={addCourse}>
					<Field kind="new">
						<!-- svelte-ignore a11y_autofocus -->
						<input type="text" autocomplete="off" placeholder="A course, such as bread" aria-label="A course" autofocus bind:value={course} />
					</Field>
				</form>
			{/if}

			<div class="wfd-sheet__chips" role="group" aria-label="Scale of {dish.name}">
				{#each SCALES as one (one)}
					<Chip label="×{one}" on={dish.scale === one} onclick={() => onscale(one)} />
				{/each}
			</div>

			<div class="wfd-sheet__end">
				<Button kind="danger" onclick={onremove}>Remove dish</Button>
				<Button kind="link" onclick={onclose}>Done</Button>
			</div>
		</div>
	{/if}
</dialog>

<style>
	.wfd-sheet {
		box-sizing: border-box;
		inline-size: 100%;
		max-inline-size: 32rem;
		max-block-size: 85dvh;
		margin: auto auto 0;
		padding: 0;
		border: 0;
		border-radius: var(--wfd-radius-card) var(--wfd-radius-card) 0 0;
		background: var(--wfd-color-bg);
		color: var(--wfd-color-text);

		&::backdrop {
			background: color-mix(in srgb, var(--wfd-color-frame) 50%, transparent);
		}

		&[open] {
			animation: wfd-rise var(--wfd-motion-change) var(--wfd-ease-out);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-sheet[open] {
			animation: none;
		}
	}

	.wfd-sheet__inner {
		display: grid;
		gap: var(--wfd-space-stack);
		padding: var(--wfd-space-section) var(--wfd-space-page)
			max(var(--safe-area-inset-bottom, 0px), var(--wfd-space-section));
	}

	.wfd-sheet__muted {
		color: var(--wfd-color-text-muted);
	}

	.wfd-sheet__title {
		margin: 0;
		font-size: var(--wfd-font-size-title);
		overflow-wrap: anywhere;
	}

	.wfd-sheet__people {
		display: grid;
		gap: var(--wfd-space-group);
	}

	button.wfd-sheet__person {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: center;
		inline-size: 100%;
		block-size: auto;
		min-block-size: calc(var(--wfd-control) + var(--wfd-space-group));
		padding: 0 var(--wfd-space-inset);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-color-surface);
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		font-size: var(--wfd-font-size-name);
		font-weight: 700;
		text-align: start;
		cursor: pointer;
		transition:
			background-color var(--wfd-chip-motion),
			color var(--wfd-chip-motion);

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: var(--wfd-focus-offset);
		}
	}

	button.wfd-sheet__person--on {
		background: var(--wfd-color-selected);
		color: var(--wfd-color-on-selected);
	}

	button.wfd-sheet__person--open {
		border-style: dashed;
	}

	button.wfd-sheet__person--open:not(.wfd-sheet__person--on) {
		background: none;
	}

	.wfd-sheet__face {
		display: grid;
		flex: none;
		place-items: center;
		inline-size: 32px;
		block-size: 32px;
		border-radius: var(--wfd-radius-pill);
		background: var(--wfd-color-track);
		color: var(--wfd-color-text);
		font-size: var(--wfd-font-size-small);
	}

	.wfd-sheet__name {
		flex: 1;
		min-inline-size: 0;
		overflow-wrap: anywhere;
	}

	.wfd-sheet__chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-tight) var(--wfd-space-group);
	}

	.wfd-sheet__end {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	@keyframes wfd-rise {
		from {
			translate: 0 100%;
		}
	}
</style>
