<script>
	import { onMount } from 'svelte';

	/**
	 * Reads a barcode from the camera with the Barcode Detection API of the browser.
	 * When the API or the camera is not available, it shows why. The page has a text
	 * field for the number as the alternative.
	 * @type {{ ondetect: (barcode: string) => void }}
	 */
	let { ondetect } = $props();

	const FORMATS = ['ean_13', 'ean_8', 'upc_a', 'upc_e'];
	const supported = 'BarcodeDetector' in globalThis;

	/** @type {HTMLVideoElement | undefined} */
	let video = $state();
	let problem = $state(supported ? '' : 'This browser cannot read barcodes with the camera.');

	onMount(() => {
		if (!supported) return;

		const detector = new BarcodeDetector({ formats: FORMATS });
		/** @type {MediaStream | undefined} */
		let stream;
		/** @type {ReturnType<typeof setInterval> | undefined} */
		let timer;
		let stopped = false;

		async function scan() {
			if (!video || video.readyState < video.HAVE_ENOUGH_DATA) return;
			const [barcode] = await detector.detect(video).catch(() => []);
			if (barcode && !stopped) ondetect(barcode.rawValue);
		}

		navigator.mediaDevices
			?.getUserMedia({ video: { facingMode: 'environment' } })
			.then(async (media) => {
				stream = media;
				if (stopped || !video) return stop();
				video.srcObject = media;
				await video.play();
				timer = setInterval(scan, 400);
			})
			.catch(() => (problem = 'The camera is not available. Check the camera permission.'));

		function stop() {
			stopped = true;
			clearInterval(timer);
			stream?.getTracks().forEach((track) => track.stop());
		}

		return stop;
	});
</script>

{#if problem}
	<p class="card card--notice" role="alert">{problem}</p>
{:else}
	<video
		class="scanner"
		bind:this={video}
		playsinline
		muted
		aria-label="Camera view for the barcode"
	></video>
{/if}

<style>
	.scanner {
		inline-size: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		background: #000000;
		border-radius: var(--radius);
	}
</style>
