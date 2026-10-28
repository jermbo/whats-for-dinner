<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import Button from '../parts/Button.svelte';
	import type { ReadBarcode } from './barcode-reader';

	// The scan of a barcode. The live view of the camera reads the code with no shutter. When
	// Obsidian gives no live view, the camera of the phone takes one photo, and the same reader
	// looks for the code in it. `onread` gets the code, or null for a photo with no code.
	type Props = { read: ReadBarcode; onread: (code: string | null) => void; oncancel: () => void };
	let { read, onread, oncancel }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 150);
	const uid = $props.id();

	let video = $state<HTMLVideoElement>();
	let live = $state(true);

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
				live = false;
			}
		}

		void start();
		return stop;
	});

	async function fromPhoto(event: Event & { currentTarget: HTMLInputElement }) {
		const file = event.currentTarget.files?.[0];
		if (!file) return;
		onread(await read(await createImageBitmap(file)));
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
				class="wfd-scan__hidden"
				type="file"
				accept="image/*"
				capture="environment"
				onchange={fromPhoto}
			/>
		</label>
	{/if}
	<Button kind="link" onclick={oncancel}>Cancel</Button>
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
