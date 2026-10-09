<script>
	import { resolve } from '$app/paths';
	import BarcodeScanner from '$lib/components/pantry/BarcodeScanner.svelte';
	import QrCode from '$lib/components/transfer/QrCode.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import SegmentedControl from '$lib/components/ui/SegmentedControl.svelte';
	import { vibrate } from '$lib/input/vibrate';
	import { QR_SIZES, sideOf } from '$lib/qr/sizes';
	import { readTestText, testText } from '$lib/qr/test-text';

	/** @typedef {import('$lib/qr/test-text').SizeName} SizeName */

	// A test for the owner: which size of QR code can the camera of each device read? One
	// device shows a code that is full of text, and the other device reads it.

	const JOBS = [
		{ value: 'show', label: 'Show' },
		{ value: 'read', label: 'Read' }
	];
	const names = /** @type {SizeName[]} */ (Object.keys(QR_SIZES));
	const SIZES = names.map((name) => ({ value: name, label: title(name) }));

	let job = $state('show');
	/** @type {SizeName} */
	let shown = $state('small');
	/** @type {Partial<Record<SizeName, boolean>>} For each size that the camera read: was the text correct? */
	let results = $state({});

	/** @param {string} name */
	function title(name) {
		return name[0].toUpperCase() + name.slice(1);
	}

	/** @param {string} text */
	function found(text) {
		const result = readTestText(text);
		if (!result) return;
		// The owner looks at the other device, so the phone tells the hand.
		if (!(result.name in results)) vibrate(80);
		results[result.name] = result.correct;
	}
</script>

<PageHeader title="Code test">
	<a class="button" href={resolve('/settings/data')}>Data</a>
</PageHeader>

<SegmentedControl legend="This device" options={JOBS} bind:value={job} hideLegend />

{#if job === 'show'}
	<SegmentedControl legend="Size of the code" options={SIZES} bind:value={shown} hideLegend />
	<QrCode
		text={testText(shown)}
		size={QR_SIZES[shown]}
		label="{title(shown)} test code. Read it with the other device."
	/>
	<p class="receipt-text">
		{sideOf(QR_SIZES[shown])} squares · {QR_SIZES[shown].letters} letters
	</p>
{:else}
	<BarcodeScanner
		ondetect={found}
		formats={['qr_code']}
		sharp
		label="Camera view for the test code"
	/>
	<dl class="code-test" aria-live="polite">
		{#each names as name (name)}
			<dt>{title(name)} · {sideOf(QR_SIZES[name])}</dt>
			<dd>
				{#if !(name in results)}
					<span class="muted">Not read</span>
				{:else if results[name]}
					Read
				{:else}
					Read, but the text is wrong
				{/if}
			</dd>
		{/each}
	</dl>
{/if}

<style>
	.code-test {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--space-1) var(--space-4);
		margin: 0;

		& dt {
			font-weight: 600;
		}

		& dd {
			margin: 0;
		}
	}
</style>
