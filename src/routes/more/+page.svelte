<script>
	import { resolve } from '$app/paths';
	import SampleDataPanel from '$lib/components/data/SampleDataPanel.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { countSampleData } from '$lib/data/sample';
	import { live } from '$lib/state/live.svelte';

	const sampleCount = live(countSampleData, 0);

	const links = /** @type {const} */ ([
		{ path: '/ingredients', label: 'Ingredients', hint: 'Names, units, and categories.' },
		{ path: '/pantry/check', label: 'Pantry check', hint: 'The weekly check of the stock.' },
		{ path: '/pantry/scan', label: 'Scan', hint: 'Add an item with its barcode.' },
		{ path: '/shop/trips', label: 'Shopping trips', hint: 'The cost of each trip to the store.' },
		{ path: '/data', label: 'Data', hint: 'Export, import, and the status of the app.' },
		{
			path: '/data/code-test',
			label: 'Code test',
			hint: 'Find the QR code that the cameras can read.'
		}
	]);
</script>

<PageHeader title="More" />

<ul class="list">
	{#each links as link (link.path)}
		<li class="list__item">
			<a class="list__link" href={resolve(link.path)}>{link.label}</a>
			<span class="muted">{link.hint}</span>
		</li>
	{/each}
</ul>

<SampleDataPanel count={sampleCount.current} />
