<script>
	import { importFile } from '$lib/data/backup';

	const uid = $props.id();

	let result = $state('');
	let failed = $state(false);

	/** @param {Event & { currentTarget: HTMLInputElement }} event */
	async function load(event) {
		const input = event.currentTarget;
		const file = input.files?.[0];
		if (!file) return;

		try {
			const backup = JSON.parse(await file.text());
			const replaces = backup?.scope !== 'recipes';
			if (replaces && !confirm('A full backup replaces all data on this device. Continue?')) return;
			result = await importFile(backup);
			failed = false;
		} catch (error) {
			result = error instanceof Error ? error.message : 'The import failed.';
			failed = true;
		} finally {
			input.value = '';
		}
	}
</script>

<section class="stack" aria-labelledby="{uid}-title">
	<h2 id="{uid}-title">Import</h2>

	<p>
		A full backup replaces all data on this device. A recipe file adds new recipes and merges the
		others: the newer text wins, and no photo is lost. It changes nothing else.
	</p>

	<div class="field">
		<label class="field__label" for="{uid}-file">Meal Planner file (JSON)</label>
		<input
			class="field__control"
			id="{uid}-file"
			type="file"
			accept="application/json,.json"
			onchange={load}
		/>
	</div>

	<p class={['card', failed && 'card--notice']} role="status" hidden={!result}>{result}</p>
</section>
