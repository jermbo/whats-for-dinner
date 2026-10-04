<script>
	import { qrPath } from '$lib/qr/path';
	import { qrCode } from '$lib/qr/qr';

	/**
	 * Shows a text as a QR code. The code is black on white on each screen: a camera needs the
	 * contrast.
	 * @type {{ text: string, size: import('$lib/qr/sizes').QrSize, label: string }}
	 */
	let { text, size, label } = $props();

	/** The light border that the standard asks for, in squares. */
	const BORDER = 4;

	const code = $derived(qrCode(text, size));
	const box = $derived(code.side + BORDER * 2);
</script>

<svg class="qr-code" viewBox="0 0 {box} {box}" role="img" aria-label={label}>
	<rect width={box} height={box} fill="#ffffff" />
	<path d={qrPath(code, BORDER)} fill="#000000" />
</svg>

<style>
	.qr-code {
		display: block;
		/* As large as the width and the height of the screen permit. */
		inline-size: min(100%, 100dvb - var(--nav-space, 0rem));
		margin-inline: auto;
		/* Each square has sharp edges at each size. */
		shape-rendering: crispEdges;
	}
</style>
