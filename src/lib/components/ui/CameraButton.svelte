<script>
	import { shrinkPhoto } from '$lib/data/photo-capture';
	import { status } from '$lib/status.svelte';
	import Icon from './Icon.svelte';

	/**
	 * A button that takes a photo. A tap opens the rear camera of the phone. On a desktop, it
	 * opens the files. The photo becomes small before "onphoto" gets it, so the large file of
	 * the camera stays only in memory.
	 * There is no confirm step: the hands of the owner are busy.
	 * "quiet" hides the label: then only screen readers get it.
	 * @type {{
	 *   label: string,
	 *   onphoto: (blob: Blob) => unknown,
	 *   quiet?: boolean,
	 *   class?: string
	 * }}
	 */
	let { label, onphoto, quiet = false, class: className = '' } = $props();

	let busy = $state(false);

	/** @param {Event & { currentTarget: HTMLInputElement }} event */
	async function pick(event) {
		const input = event.currentTarget;
		const file = input.files?.[0];
		if (!file) return;

		busy = true;
		try {
			await onphoto(await shrinkPhoto(file));
		} catch {
			status.say('The app cannot read this photo. Take the photo again.');
		} finally {
			busy = false;
			// The same file can be selected again.
			input.value = '';
		}
	}
</script>

<label class={['camera-button', className, busy && 'camera-button--busy']}>
	<input
		class="visually-hidden"
		type="file"
		accept="image/*"
		capture="environment"
		disabled={busy}
		onchange={pick}
	/>
	<Icon name="camera" />
	<span class={[quiet && 'visually-hidden']}>{label}</span>
</label>

<style>
	.camera-button {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		cursor: pointer;

		&:has(:focus-visible) {
			outline: 3px solid var(--ink);
			outline-offset: 2px;
		}

		& :global(.icon) {
			flex: none;
		}
	}

	.camera-button--busy {
		opacity: 0.5;
	}
</style>
