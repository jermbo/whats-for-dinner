<script>
	/**
	 * The alternative to the camera: the owner types the number below the barcode.
	 * @type {{ onsubmit: (barcode: string) => void }}
	 */
	let { onsubmit } = $props();

	const uid = $props.id();

	/** @param {SubmitEvent & { currentTarget: HTMLFormElement }} event */
	function submit(event) {
		event.preventDefault();
		const barcode = String(new FormData(event.currentTarget).get('barcode') ?? '').trim();
		if (barcode) onsubmit(barcode);
	}
</script>

<form class="barcode-entry" onsubmit={submit}>
	<div class="field">
		<label class="field__label" for="{uid}-barcode">Or type the barcode number</label>
		<input
			class="field__control"
			id="{uid}-barcode"
			name="barcode"
			inputmode="numeric"
			pattern="[0-9]+"
			autocomplete="off"
			required
		/>
	</div>
	<button class="button" type="submit">Find</button>
</form>

<style>
	.barcode-entry {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: end;
		gap: var(--space-2);
	}
</style>
