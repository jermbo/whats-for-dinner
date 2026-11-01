<script lang="ts" module>
	// Obsidian on Android does not ask for the camera, so it gives a plugin no live view, and it
	// does not give one later in the same run. After the first no, each scan goes straight to the
	// camera of the phone.
	let noLiveView = false;
</script>

<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import Button from '../parts/Button.svelte';
	import type { ReadBarcode } from './barcode-reader';

	// The scan of a barcode. The live view of the camera reads the code with no shutter. When
	// Obsidian gives no live view, the camera of the phone opens by itself and takes one photo, and
	// the same reader looks for the code in it. `onread` gets the code, or null for a photo with no
	// code. Two quiet ways out: `ontype` is for the digits typed by hand, and `oncancel` goes to the
	// name.
	type Props = {
		read: ReadBarcode;
		onread: (code: string | null) => void;
		ontype: () => void;
		oncancel: () => void;
	};
	let { read, onread, ontype, oncancel }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 150);
	const uid = $props.id();

	let video = $state<HTMLVideoElement>();
	let photo = $state<HTMLInputElement>();
	let live = $state(!noLiveView);

	// A browser opens the camera only soon after a tap. The tap on + or on a date is that tap. When
	// it is too late, the camera stays shut, and the button is there.
	async function toPhoto() {
		live = false;
		await tick();
		photo?.click();
	}

	onMount(() => {
		let stream: MediaStream | null = null;
		let stopped = false;
		let timer: ReturnType<typeof setTimeout> | undefined;
		const stop = () => {
			stopped = true;
			clearTimeout(timer);
			stream?.getTracks().forEach((track) => track.stop());
		};

		// One frame each 150 ms is fast enough for a hand that holds still, and it leaves the phone
		// time for the view.
		async function look() {
			if (stopped || !video) return;
			const code = video.readyState >= 2 ? await read(video) : null;
			if (stopped) return;
			if (code) {
				stop();
				onread(code);
				return;
			}
			timer = setTimeout(look, 150);
		}

		async function start() {
			if (noLiveView) return void toPhoto();
			try {
				stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: 'environment' },
					audio: false
				});
				if (stopped || !video) return stop();
				video.srcObject = stream;
				await video.play();
				void look();
			} catch {
				stop();
				noLiveView = true;
				void toPhoto();
			}
		}

		void start();
		return stop;
	});

	// A photo with no code opens the camera again for a second try. The field forgets the file, so
	// that the same photo counts again.
	async function fromPhoto(event: Event & { currentTarget: HTMLInputElement }) {
		const input = event.currentTarget;
		const file = input.files?.[0];
		if (!file) return;
		const code = await read(await createImageBitmap(file));
		input.value = '';
		onread(code);
		if (!code) input.click();
	}
</script>

<div class="wfd-scan" in:fade={{ duration }}>
	{#if live}
		<div class="wfd-scan__frame">
			<!-- svelte-ignore a11y_media_has_caption -->
			<video class="wfd-scan__view" bind:this={video} muted playsinline aria-label="Camera"></video>
			<span class="wfd-scan__aim" aria-hidden="true"></span>
		</div>
		<p class="wfd-scan__hint wfd-label">Point the camera at the barcode</p>
	{:else}
		<label class="wfd-scan__photo" for="{uid}-photo">
			Take a photo of the barcode
			<input
				id="{uid}-photo"
				bind:this={photo}
				class="wfd-scan__hidden"
				type="file"
				accept="image/*"
				capture="environment"
				onchange={fromPhoto}
			/>
		</label>
	{/if}
	<div class="wfd-scan__ways">
		<Button kind="link" onclick={ontype}>Type barcode</Button>
		<Button kind="link" onclick={oncancel}>Type name</Button>
	</div>
</div>

<style>
	.wfd-scan {
		display: grid;
		gap: var(--wfd-space-stack);
		justify-items: center;
	}

	/* A wide window over the code: a barcode is wide and low, so the view is too. */
	.wfd-scan__frame {
		position: relative;
		inline-size: 100%;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-color-frame);
	}

	.wfd-scan__view {
		inline-size: 100%;
		block-size: 100%;
		object-fit: cover;
	}

	.wfd-scan__aim {
		position: absolute;
		inset: 35% 10%;
		border: var(--wfd-border) solid var(--wfd-color-on-frame);
		border-radius: var(--wfd-radius-button);
	}

	.wfd-scan__ways {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--wfd-space-stack);
		justify-content: center;
	}

	.wfd-scan__hint {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}

	.wfd-scan__photo {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		inline-size: 100%;
		min-block-size: var(--wfd-control);
		padding: 0 var(--wfd-space-inset);
		border: var(--wfd-border) dashed var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-control);
		color: var(--wfd-color-text);
		font-weight: 700;
		cursor: pointer;

		&:focus-within {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	.wfd-scan__hidden {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}
</style>
