<script module>
	/**
	 * Line icons on a 24 by 24 grid. Each icon is a list of SVG path data.
	 * An icon is decoration: the text label next to it gives the meaning.
	 */
	const ICONS = {
		today: ['M4 11.5 12 4l8 7.5', 'M6 10v10h12V10', 'M10 20v-5h4v5'],
		menu: [
			'M7 4h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
			'M9 9h6M9 13h6M9 17h3'
		],
		shop: [
			'M3 4h2l2.4 10.6a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7.5H6',
			'M10 19.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z',
			'M18 19.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z'
		],
		pantry: ['M5 4h14v16H5z', 'M5 9.5h14M5 15h14', 'M9 6.5v.5M9 12v.5M9 17.5v.5'],
		recipes: [
			'M6 3h12a1 1 0 0 1 1 1v17H7a2 2 0 0 1-2-2V4a1 1 0 0 1 1-1z',
			'M5 19a2 2 0 0 1 2-2h12',
			'M9 8h6'
		],
		more: [
			'M6.25 12a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z',
			'M13.25 12a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z',
			'M20.25 12a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z'
		]
	};

	/** @typedef {keyof typeof ICONS} IconName */
</script>

<script>
	/** @type {{ name: IconName }} */
	let { name } = $props();
</script>

<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
	{#each ICONS[name] as path (path)}
		<path d={path} />
	{/each}
</svg>

<style>
	.icon {
		inline-size: 1.5rem;
		block-size: 1.5rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.75;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
