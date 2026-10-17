<script lang="ts">
	import { STAGES, type Stage } from './stage';

	type Props = {
		// The number of items that wait in each stage.
		counts: Record<Stage, number>;
		value: Stage;
		onchange: (stage: Stage) => void;
	};
	let { counts, value, onchange }: Props = $props();

	const names: Record<Stage, string> = { extras: 'Extras', shop: 'Shop', away: 'Put away' };
	const uid = $props.id();
	const at = $derived(STAGES.indexOf(value));
</script>

<!--
	The three stages of a trip. Each stage has its number, so that the sequence is clear, and its
	count, so that you see where the items are. An ink line slides under the stage that is open.
-->
<fieldset class="wfd-stages" style:--at={at}>
	<legend class="wfd-stages__legend">Stage of the trip</legend>
	{#each STAGES as stage, index}
		<label class="wfd-stages__stage">
			<input
				class="wfd-stages__input"
				type="radio"
				name={uid}
				checked={stage === value}
				onchange={() => onchange(stage)}
			/>
			{#key counts[stage]}
				<span class="wfd-stages__count wfd-number">{counts[stage]}</span>
			{/key}
			<span class="wfd-stages__name wfd-label">{index + 1} {names[stage]}</span>
		</label>
	{/each}
</fieldset>

<style>
	.wfd-stages {
		position: relative;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
		border-block-end: 2px solid var(--wfd-line);

		&::after {
			content: '';
			position: absolute;
			inset-block-end: -2px;
			inset-inline-start: 0;
			inline-size: calc(100% / 3);
			block-size: var(--wfd-rule-4);
			background: var(--wfd-ink);
			translate: calc(var(--at) * 100%) 0;
			transition: translate 0.2s ease-out;
		}

		&:has(:focus-visible) {
			outline: 2px solid var(--wfd-ink);
			outline-offset: 2px;
		}
	}

	.wfd-stages__legend,
	.wfd-stages__input {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.wfd-stages__stage {
		display: grid;
		gap: 2px;
		justify-items: center;
		min-block-size: 52px;
		padding-block: 6px 8px;
		color: var(--wfd-ink-3);
		cursor: pointer;
		transition: color 0.2s ease-out;

		&:has(:checked) {
			color: var(--wfd-ink);
		}
	}

	/* A count that changes makes a small jump, so that you see where the item went. */
	.wfd-stages__count {
		font-size: 22px;
		animation: jump 0.3s ease-out;
	}

	.wfd-stages__name {
		white-space: nowrap;
	}

	@keyframes jump {
		40% {
			translate: 0 -5px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-stages::after,
		.wfd-stages__stage {
			transition: none;
		}

		.wfd-stages__count {
			animation: none;
		}
	}
</style>
