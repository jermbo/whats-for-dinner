<script>
	import { addStepNote, saveStepNote } from '$lib/data/step-notes';

	/** @typedef {{ note: import('$lib/types').StepNote, sessionId: string }} NoteEntry */

	/**
	 * Writes a note on a step, or changes one. A new note goes into the cook session of now.
	 * A note from an earlier cook stays in its own session.
	 * @type {{ sessionId: string, stepId: string, number: number }}
	 */
	let { sessionId, stepId, number } = $props();

	const uid = $props.id();

	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state();
	/** The note that the dialog changes. Null: the dialog makes a new note. */
	let entry = $state.raw(/** @type {NoteEntry | null} */ (null));
	let text = $state('');

	/** @param {NoteEntry} [existing] */
	export function open(existing) {
		entry = existing ?? null;
		text = existing?.note.text ?? '';
		dialog?.showModal();
	}

	/**
	 * @param {SubmitEvent} event
	 */
	async function save(event) {
		event.preventDefault();
		if (entry) await saveStepNote(entry.sessionId, entry.note.id, text);
		else await addStepNote(sessionId, stepId, text);
		dialog?.close();
	}

	async function remove() {
		if (entry) await saveStepNote(entry.sessionId, entry.note.id, '');
		dialog?.close();
	}
</script>

<!-- "data-controls": a tap in this dialog is not a tap on the card of Cook mode. -->
<dialog bind:this={dialog} aria-labelledby="{uid}-title" data-controls>
	<form class="stack" onsubmit={save}>
		<h2 id="{uid}-title">{entry ? 'Change the note' : `Note on step ${number}`}</h2>

		<div class="field">
			<label class="visually-hidden" for="{uid}-text">Note</label>
			<textarea
				class="field__control"
				id="{uid}-text"
				placeholder="Less salt. One spoon is sufficient."
				bind:value={text}></textarea>
			<span class="field__hint">The next cook shows the note on this step.</span>
		</div>

		<div class="cluster">
			<button class="button button--primary" type="submit">Save note</button>
			{#if entry}
				<button class="button button--danger" type="button" onclick={remove}>Delete</button>
			{/if}
			<button class="button" type="button" onclick={() => dialog?.close()}>Cancel</button>
		</div>
	</form>
</dialog>
